# Product

## Register

product

## Users

Radiologistas de plantão na emergência da Santa Casa de Porto Alegre (Radiologia). Contexto: sala de laudos sob pressão de tempo, fadiga, múltiplos exames em espera, monitor de mesa (às vezes lido a alguma distância). Trabalham a fila de cima para baixo e abrem cada caso no PACS Carestream para laudar.

Job a ser feito: identificar e laudar primeiro os casos com risco de vida. O painel responde "qual exame eu abro agora?" mostrando o achado provável e a prioridade clínica na fila; a confiança da IA, a região sinalizada e as notas ficam no caso (modal).

## Product Purpose

Painel web de triagem que mostra uma fila de exames de crânio (TC/RM) ainda não laudados, ordenada por criticidade clínica × confiança da IA × tempo de espera. A IA é ferramenta de **triagem/priorização, não de diagnóstico** — nunca substitui o laudo médico. Opera em paralelo aos legados (PACS/TASY), em modo leitura.

Sucesso = reduzir o tempo porta-laudo dos casos graves (zero caso crítico perdido — otimizar sensibilidade). Estado atual: protótipo funcional autossuficiente (`Painel de Triagem IA - standalone.html`, React+Tailwind embutido) que valida a UX da fila priorizada com dados mockados, fase MVP do dashboard. A fila exibe os três níveis (Crítico/Alto/Rotina) com filtros (Pendentes/Críticos/Todos) e o achado provável por linha.

## Brand Personality

**Clínico, confiável, urgente.** Estética de instrumento médico, não de produto de marketing. Tom hospitalar sério: precisão e velocidade acima de tudo. A urgência é comunicada por hierarquia e estado (severidade, status ao vivo, tempo de espera), nunca por decoração. Voz direta, factual, em português clínico. Identidade institucional Santa Casa (azul oficial) como base de confiança.

## Anti-references

- **SaaS genérico / startup** — gradientes, cards idênticos repetidos, ilustrações fofas, tom marketing-y. Errado para ferramenta clínica de vida ou morte.
- **Software hospitalar legado** (PACS/HIS anos 2000) — cinza morto, denso ao ponto de ilegível, datado e confuso. O painel deve ser denso *e* claro, não denso *e* feio.
- **App de consumo / gamificado** — cores chamativas, badges, animações decorativas, tom casual.
- **Dashboard de BI sobrecarregado** — gráficos e widgets competindo por atenção, KPIs decorativos. A fila é o produto; tudo mais é suporte.

## Design Principles

- **Transparência sem ruído.** A fila mostra o achado provável + a prioridade clínica (cor + rótulo + ícone). Detalhe que enviesaria ou poluiria a leitura rápida — confiança, região, notas — fica no caso, a um clique.
- **Não deixar passar caso grave.** Hierarquia visual serve à sensibilidade: o crítico salta aos olhos, é impossível de ignorar, está sempre no topo.
- **Densa e calma ao mesmo tempo.** Muita informação por linha sem ruído. Cada pixel ganha seu lugar; decoração que não comunica estado sai.
- **A IA assiste, o médico decide.** Nunca apresentar a saída do modelo como veredito. Confiança, versão do modelo e o banner "triagem · não substitui o laudo" são permanentes e honestos.
- **Degradação graciosa.** Falha da IA não bloqueia a emergência. A interface assume que dados podem faltar ou atrasar.

## Accessibility & Inclusion

- **WCAG 2.1 AA.** Texto corrido ≥4.5:1; texto grande e UI ≥3:1. Verificar especialmente cinza sobre fundos frios tingidos.
- **Não depender só de cor.** Severidade (Crítico/Alto/Rotina) sempre reforçada por rótulo e/ou ícone, não apenas vermelho/âmbar/verde — daltonismo (deuteranopia/protanopia comum).
- **Legível em plantão.** Alvos de toque/clique amplos, texto legível em monitor de sala e sob fadiga/pressa. Foco visível sempre.
- **Reduced motion respeitado.** Toda animação (ROI pulsante, entrada de novo caso, toasts) tem alternativa para `prefers-reduced-motion: reduce` — crossfade ou estado instantâneo.
