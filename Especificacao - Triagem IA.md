# Especificação — Sistema de Triagem Radiológica por IA (TC e RM de Crânio)
**Santa Casa de Porto Alegre · Radiologia · Emergência**
_Documento de especificação para desenvolvimento. Pode ser entregue a outra IA ou equipe técnica como ponto de partida._

---

## 1. Visão geral

Sistema que coleta automaticamente os **exames de imagem ainda não laudados** no PACS (Carestream) e o **histórico clínico do paciente** no TASY, estrutura esses dados via API, roda um modelo de IA treinado que **classifica os achados críticos por ordem de prioridade**, e exibe uma **fila web de prioridades** ordenada por criticidade. Não altera os sistemas legados (PACS/TASY) — opera em paralelo, em modo leitura. O radiologista trabalha a fila de cima para baixo, abrindo cada caso no PACS para laudar.

**Objetivo de negócio:** reduzir o tempo entre a aquisição da imagem e o laudo dos casos graves (porta-laudo), priorizando quem corre risco de vida.

**Princípio regulatório:** a IA é ferramenta de **triagem/priorização**, não de diagnóstico. Nunca substitui o laudo médico. Não pode deixar passar caso grave (otimizar **sensibilidade**).

**Princípio de UX (anti-viés):** a fila exibe apenas a **prioridade** e a **confiança da IA** — **sem revelar o achado** — para não enviesar a leitura do radiologista. O achado e a região sinalizada só aparecem ao abrir o caso.

---

## 2. Achados-alvo (modelo de IA)

Foco em **Crânio**: TC sem contraste e, para isquemia, **RM (sequência de difusão / DWI-ADC)**. O modelo classifica os achados na seguinte **ordem de prioridade clínica** (1 = mais grave):

| # | Achado | Modalidade | Descrição | Métrica quantitativa |
|---|---|---|---|---|
| **1º** | **Desvio da linha média > 1 cm** | TC | Efeito de massa significativo | Desvio em mm |
| **2º** | **Apagamento difuso dos espaços liquóricos intracranianos** | TC | Edema cerebral difuso / hipertensão intracraniana (sulcos e cisternas apagados) | Qualitativo (graduação) |
| **3º** | **Hemorragia intracraniana nova** | TC | Intraparenquimatosa, subdural, extradural, subaracnóidea ou intraventricular | Volume estimado (mL) |
| **4º** | **Isquemia aguda (AVC)** | RM | Lesões com restrição à difusão na RM, sugestivas de isquemia aguda | DWI/ADC · ASPECTS (0–10) |
| **5º** | **Hidrocefalia volumosa** | TC | Dilatação acentuada do sistema ventricular | Índice de Evans |

Saída do modelo por exame: `{ achado, prioridade (1–5), probabilidade (0–1), corte_referência, bounding_box, métrica }`.
Classe negativa: "Sem achados agudos".

> A ordenação da fila combina essa prioridade clínica com a probabilidade da IA e o tempo de espera (ver §5).

---

## 3. Arquitetura do sistema (pipeline)

O sistema **puxa** os dados das fontes (modelo *pull*, em leitura), sem injetar nada nos sistemas legados.

```
[PACS Carestream]                       [TASY — HIS]
 exames de imagem (DICOM)                histórico clínico do paciente
 ainda NÃO laudados                      (idade, antecedentes, contexto)
        └───────────────┬───────────────────────┘
                        │  (consulta periódica / sob demanda)
                        ▼
        [API de Integração e Estruturação]
                        │  1. consulta PACS (estudos não laudados) + TASY (histórico)
                        │  2. estrutura os dados (imagem + contexto clínico)
                        ▼
        [Aplicação de IA — modelo treinado]
                        │  3. recebe os dados estruturados da API
                        │  4. pré-processa (janelamento, normalização HU / DWI-ADC)
                        │  5. classifica os achados → prioridade (1–5) + confiança
                        ▼
        [Banco de Prioridades]  (PostgreSQL)
                        ▼
        [API REST/WebSocket]
                        ▼
        [Painel Web de Triagem]  ← o radiologista olha aqui
                        │  exibe a fila ordenada por criticidade (sem revelar o achado)
                        ▼
        [PACS Carestream]  ← radiologista abre o estudo aqui para laudar
```

**Por que não mexer no PACS/TASY:** evita depender de integração proprietária e mantém os legados como fonte de verdade. A IA roda em paralelo, lê os dados e mantém sua própria fila. Falha da IA não bloqueia o fluxo da emergência (degradação graciosa).

### Fluxo de dados
1. **Coleta:** uma rotina consulta o PACS pelos **exames de imagem ainda não laudados** e o TASY pelo **histórico do paciente**.
2. **Estruturação:** a **API** consulta e estrutura esses dados (imagem + contexto clínico) num formato único.
3. **Classificação:** a **aplicação que roda o modelo de IA treinado** recebe os dados da API e classifica os achados, gerando prioridade (1–5) e confiança (ex.: "98% de hemorragia, desvio de 6 mm").
4. **Priorização:** o resultado entra no banco de prioridades; o painel reordena por prioridade clínica × probabilidade × tempo de espera.
5. **Laudo:** o radiologista vê o próximo caso crítico no painel e abre o paciente no PACS para laudar.

---

## 4. Como construir o modelo de IA (resumo)

### 4.1 Dados (Data Engineering)
- **Extração (RIS/PACS):** query cruzando `Exame = TC Crânio` + palavras-chave no laudo.
  - Positivo: laudo contém `hemorragia`, `sangramento`, `desvio de linha média`, `hidrocefalia`, `isquemia`, `AVC`.
  - Negativo: `sem evidência de sangramento`, `normal`, `sem alterações agudas`.
- **Ground truth:** laudos são imprecisos — radiologistas parceiros anotam (bounding boxes / máscaras de segmentação) os achados em cada corte do dataset positivo.
- **Volume inicial:** ~1.000–5.000 exames confirmados por achado + volume equivalente de exames normais.

### 4.2 Treinamento (Machine Learning)
- **Arquitetura:** CNN. Classificação → ResNet-50/101 ou DenseNet. Segmentação ("onde/quanto") → U-Net / V-Net (3D).
- **Abordagem 3D vs 2D:** TC é volume → usar CNN 3D ou 2.5D (múltiplos cortes simultâneos).
- **Split:** 70% treino / 15% validação / 15% teste (teste nunca visto).
- **Transfer learning:** partir de modelos pré-treinados e ajustar ao domínio médico.
- **Hardware:** GPUs (NVIDIA A100/H100), local ou nuvem.

### 4.3 Avaliação e homologação
- Métricas: **Sensibilidade**, Especificidade, AUC-ROC.
- **Teste cego:** banca de ~100 exames misturados, laudados pelos melhores radiologistas; comparar com a IA. Provar confiabilidade para triagem (zero caso grave perdido).
- **Regulatório:** dispositivo médico — avaliar registro ANVISA (SaMD) antes do uso clínico real.

---

## 5. Modelo de dados (banco de prioridades)

### Tabela `exames`
```sql
id              TEXT PRIMARY KEY        -- ex: EXM-48217
study_uid       TEXT                    -- DICOM StudyInstanceUID
patient_name    TEXT
patient_age     INT
patient_sex     CHAR(1)                 -- F/M
mrn             TEXT                    -- prontuário
protocol        TEXT                    -- "Crânio s/ contraste"
equipment       TEXT                    -- "GE Revolution CT — EMERG-02"
series_count    INT
slice_count     INT
acquired_at     TIMESTAMP               -- aquisição (base do tempo de espera)
status          TEXT                    -- pendente | em_laudo | laudado
created_at      TIMESTAMP
```

### Tabela `ia_resultados`
```sql
id              SERIAL PRIMARY KEY
exam_id         TEXT REFERENCES exames(id)
finding         TEXT     -- "Desvio da Linha Média" | "Apagamento dos Espaços Liquóricos" | "Hemorragia Intracraniana" | "Isquemia Aguda (AVC)" | "Hidrocefalia Volumosa" | "Sem achados agudos"
priority_rank   INT      -- 1..5 (ordem de prioridade clínica do achado; ver §2)
finding_type    TEXT     -- crit | alto | neg
probability     REAL     -- 0..1
priority        TEXT     -- critico | alto | rotina
slice_focus     INT      -- corte de referência
roi_json        JSONB    -- { top, left, w, h, label }  (% relativos à imagem)
measure_label   TEXT     -- ex: "Desvio de linha média"
measure_value   TEXT     -- ex: "14 mm"
notes           TEXT     -- texto descritivo gerado
model_version   TEXT     -- ex: "NeuroCT-Triage v2.3"
inferred_at     TIMESTAMP
```

**Regra de prioridade (ordenação da fila):**
`ORDER BY peso(priority) ASC, priority_rank ASC, probability DESC, espera DESC`
onde peso = { critico:0, alto:1, rotina:2 }, `priority_rank` é a ordem clínica 1–5 do §2, e espera = `now() - acquired_at`.

---

## 6. Contratos de API

```
GET  /api/fila?filtro=criticos|pendentes|todos&q=<busca>
     → [ { exame + ia_resultado } ]  já ordenado

GET  /api/exame/{id}
     → exame completo + resultado + metadados

POST /api/exame/{id}/status   { status: "em_laudo" | "laudado" }
     → atualiza status (chamado ao abrir no PACS / concluir laudo)

POST /api/exame/{id}/reclassificar  { motivo }
     → sinaliza para revisão da equipe

WS   /ws/fila
     → push em tempo real quando um novo exame crítico é classificado

--- integração / coleta (interno) ---

GET  /coleta/pacs/nao-laudados        (job de coleta → PACS)
     → lista de estudos de imagem ainda não laudados (DICOM / metadados)

GET  /coleta/tasy/historico/{mrn}     (job de coleta → TASY)
     → histórico clínico estruturado do paciente

POST /ia/classificar   { exame_estruturado }   (API → aplicação de IA)
     → { achado, priority_rank, probabilidade, roi, métrica }

POST /resultados/ingest   { exame + ia_resultado }   (IA → banco)
     → grava exame + resultado e dispara o push no WebSocket
```

---

## 7. Frontend — estrutura do protótipo atual

Protótipo funcional já construído (React via Babel + Tailwind no navegador, dados mockados). Serve de referência de UX/UI para a aplicação real.

**Entrega:** arquivo **único e autossuficiente** — `Painel de Triagem IA - standalone.html`. Fontes, React/ReactDOM, Babel, Tailwind, o logotipo oficial (SVG) e os dados mockados ficam **embutidos** (base64/gzip) e são desempacotados em runtime via blob URLs. Abre offline com duplo clique, sem build nem servidor — ideal para apresentação.

```
Painel de Triagem IA - standalone.html
├─ loader            — desempacota os assets (manifest/template) e injeta o app
├─ <style> @theme    — design system Tailwind (tokens de cor da Santa Casa, fontes)
├─ data (mock)       — window.SEED_PATIENTS, window.INCOMING_CASE
├─ logo (SVG)        — exposto em window.__resources["sc-logo"]
└─ app (JSX/React)   — componentes abaixo
```

### Árvore de componentes
```
App
├─ Header        (logotipo Santa Casa, pipeline PACS·TASY → API → IA → Painel → PACS,
│                 badge "ao vivo", relógio, botão "Simular novo exame")
├─ Kpis          (Críticos na fila · Pendentes · Tempo médio até triagem — com ícones)
├─ main
│  └─ Queue      (cabeçalho + busca + aviso anti-viés → QueueRow[])
│     └─ QueueRow  (rank, prioridade, paciente, BARRA de confiança da IA, espera, status)
├─ footer        (aviso clínico + versão do modelo)
├─ CasoModal     (Viewer DICOM + ROI pulsante da IA, achado crítico, ações)  — sob demanda
└─ Toasts        (chegada de novo exame crítico)
```

A **fila não mostra o achado** (anti-viés): exibe só prioridade + confiança. O achado e a região (ROI) só aparecem no `CasoModal`.

### Modelo de dados do frontend (objeto por exame)
```js
{
  id, name, age, sex, mrn,
  protocol, equipment, series, slices,
  finding,            // achado completo (só no modal)
  findingDesc,        // versão curta
  findingType,        // "crit" | "alto" | "neg"  → cor
  probability,        // 0..1  → % e barra de confiança
  priority,           // "critico" | "alto" | "rotina"
  wait,               // minutos de espera
  status,             // "pendente" | "em_laudo" | "laudado"
  roi,                // { top, left, w, h, label } em % ou null
  sliceFocus,         // corte de referência da IA
  measure,            // { label, value }  ex: { "Desvio de linha média", "14 mm" }
  aiNotes             // texto descritivo
}
```

### Interações implementadas
- Selecionar linha → abre `CasoModal` com visualizador, ROI pulsante e confiança.
- Busca por nome/ID/prontuário.
- **Simular novo exame:** insere caso crítico no topo, anima entrada, dispara toast (demonstra o push em tempo real).
- "Laudar no PACS Carestream" → muda status para *Em laudo*.
- Fechar com Esc / clique fora.

---

## 8. Design system (resumo)

Segue a **identidade visual oficial da Santa Casa de Porto Alegre** (ver [`identidade-visual-santa-casa.md`](identidade-visual-santa-casa.md)).

- **Cores da marca (oficiais):**
  - Azul Santa Casa `#004D9D` (PANTONE 286) — **principal**
  - Azul Médio `#0071B9` (PANTONE 285)
  - Azul Escuro `#073772` (PANTONE 288)
  - Azul Profundo `#062047` (PANTONE 289) — usado no cabeçalho
- **Logotipo:** marca oficial (SVG) no cabeçalho, em branco sobre o azul profundo. Proporções preservadas.
- **Severidade clínica** (convenção médica, mantida): Crítico = vermelho `#DC2626`, Alto = âmbar `#D97706`, Rotina = verde `#15A34A`.
- **Tipografia:** **Montserrat** (fonte da marca) na UI + IBM Plex Mono para dados técnicos (IDs, cortes, medidas).
- Layout denso, fundo neutro frio, cartões brancos. Barra de confiança da IA por linha; ROI pulsante no visualizador.

---

## 9. Stack tecnológica recomendada

| Camada | Tecnologia |
|---|---|
| Coleta PACS (não-laudados) | Python + `pynetdicom` / `pydicom` (DICOM Q/R) |
| Coleta TASY (histórico) | API/integração TASY (REST ou consulta ao banco, conforme liberação) |
| Pré-processamento | `numpy`, `SimpleITK`, janelamento HU / DWI-ADC |
| Modelo | PyTorch (MONAI para imagem médica 3D) |
| Serving | TorchServe / Triton Inference Server (GPU) |
| Banco | PostgreSQL |
| API | FastAPI (REST + WebSocket) |
| Frontend | React + Vite (migrar o protótipo) ou manter HTML estático |
| Visualizador DICOM | Cornerstone.js / OHIF (ou deep-link para o PACS) |
| Infra | On-premise (dados sensíveis) ou nuvem com VPC isolada |

---

## 10. Requisitos não-funcionais

- **LGPD / privacidade:** dados de paciente sensíveis. Manter on-premise ou em ambiente isolado; controle de acesso por perfil; logs de auditoria.
- **Disponibilidade:** servidor de IA não pode interromper o fluxo da emergência; falha da IA não pode bloquear o PACS (degradação graciosa — fila volta ao modo manual).
- **Latência:** alvo de triagem em segundos após a aquisição (referência do protótipo: ~38 s).
- **Rastreabilidade:** versão do modelo gravada em cada resultado; possibilidade de auditar falsos negativos.
- **Segurança clínica:** banner permanente "uso para triagem · não substitui o laudo médico".

---

## 11. Fases de implantação

1. **MVP do dashboard** (este protótipo) — valida a UX da fila priorizada com dados de exemplo.
2. **Pipeline de dados** — extração e curadoria do banco histórico, anotação por radiologistas.
3. **Treino + homologação** — modelo, métricas, teste cego.
4. **Integração PACS/TASY** — coleta dos exames não laudados (PACS) + histórico clínico (TASY) via API, em ambiente de homologação.
5. **Piloto controlado** — IA em paralelo, sem afetar o fluxo, medindo concordância e tempo porta-laudo.
6. **Produção** — após validação clínica e regulatória.
