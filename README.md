# Painel de Triagem IA — Santa Casa de Porto Alegre

Protótipo de **painel web de triagem radiológica por IA** para a emergência da Radiologia. Mostra uma **fila de exames de crânio (TC/RM) ainda não laudados**, ordenada por **criticidade clínica**, para o radiologista atacar primeiro os casos com risco de vida.

> ⚠️ **Protótipo com dados fictícios.** A IA é ferramenta de **triagem/priorização**, **não de diagnóstico**, e **não substitui o laudo médico**. Pacientes, exames e medidas são mockados.

🔗 **No ar:** _(preencher após ativar o GitHub Pages — ver abaixo)_

---

## O que faz

- **Fila priorizada** dos 3 níveis (Crítico / Alto / Rotina) com filtros **Pendentes / Críticos / Todos**.
- **Ordenação clínica** (Especificação §5): nível → rank do achado (1–5) → confiança da IA → tempo de espera.
- Cada linha mostra o **achado provável** e a **prioridade** (cor + rótulo + ícone — acessível a daltônicos). Confiança, região (ROI) e notas ficam no **caso (modal)**.
- **Simular novo exame** demonstra a chegada em tempo real (caso crítico entra no topo + toast).
- Identidade visual oficial Santa Casa (azul `#004D9D`, Montserrat) + IBM Plex Mono nos dados técnicos.

Ordem de gravidade dos achados (1 = mais urgente): **1** Desvio de linha média · **2** Apagamento liquórico · **3** Hemorragia nova · **4** Isquemia aguda (AVC) · **5** Hidrocefalia volumosa.

## Como rodar localmente

O JSX é compilado no navegador (Babel) e os módulos são carregados via HTTP — **precisa de um servidor** (abrir o `index.html` por `file://` não funciona). Qualquer servidor estático serve:

```bash
# Python
python -m http.server 8000

# ou Node
npx serve .
```

Abra `http://localhost:8000`.

> Existe também `Painel de Triagem IA - standalone.html`: versão **autossuficiente** (tudo embutido) que abre **offline com duplo-clique**, ideal para apresentação sem internet.

## Estrutura

```
index.html            shell: fontes, tema Tailwind (@theme), CDNs, ordem dos scripts
styles.css            animações, scrollbar, prefers-reduced-motion
assets/logo.svg       logotipo oficial Santa Casa
src/
  data.js             dados mockados (SEED_PATIENTS, INCOMING_CASE)
  shared.jsx          tokens, helpers, ícones, severidade → window.T
  components/         Header, Kpis, Queue, Viewer, CasoModal, Toasts
  app.jsx             estado, filtros, render
```

Sem etapa de build: React + Babel + Tailwind v4 via CDN. Componentes se comunicam por `window.T` (escopo explícito, cada arquivo isolado em IIFE).

## Colocar no ar (GitHub Pages)

1. Crie o repositório no GitHub e faça o push (ver comandos no fim).
2. No repositório: **Settings → Pages → Build and deployment → Source: _Deploy from a branch_ → Branch: `main` / `/ (root)`** → **Save**.
3. Em ~1 min o site fica em `https://<usuário>.github.io/<repo>/`. Atualize o link "No ar" acima.

Os caminhos são relativos, então funciona no subdiretório do Pages. O `.nojekyll` evita que o Jekyll ignore arquivos.

## Stack alvo (produção)

Frontend React+Vite · API FastAPI (REST + WebSocket) · PostgreSQL · modelo PyTorch/MONAI (CNN 3D) · coleta PACS (pydicom) + TASY, em leitura. Detalhes em [`Especificacao - Triagem IA.md`](./Especificacao%20-%20Triagem%20IA.md).
