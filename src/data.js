/* Mock data — fila da emergência, TC/RM de Crânio. Dados fictícios (protótipo).
   priorityRank = ordem de gravidade clínica do achado (1 = mais grave; ver Especificação §2):
     1 Desvio de linha média · 2 Apagamento liquórico · 3 Hemorragia nova · 4 Isquemia aguda · 5 Hidrocefalia.
   wait = minutos desde a aquisição. */
window.SEED_PATIENTS = [
  {
    id: "EXM-48217", name: "Maria Aparecida dos Santos", age: 67, sex: "F", mrn: "PRT-882041",
    protocol: "Crânio s/ contraste", equipment: "GE Revolution CT — EMERG-02", series: 3, slices: 32,
    finding: "Hemorragia Intracraniana", findingDesc: "Hemorragia intraparenquimatosa", findingType: "crit",
    probability: 0.97, priority: "critico", priorityRank: 3, wait: 220, setor: "emergencia", status: "pendente",
    roi: { top: 30, left: 38, w: 26, h: 22, label: "Hemorragia · temporal D" },
    sliceFocus: 17, measure: { label: "Volume estimado", value: "~18 mL" },
    aiNotes: "Hiperdensidade compatível com hemorragia intraparenquimatosa em lobo temporal direito. Volume estimado ~18 mL. Sem desvio de linha média significativo.",
  },
  {
    id: "EXM-48219", name: "José Carlos Ferreira", age: 58, sex: "M", mrn: "PRT-773190",
    protocol: "Crânio s/ contraste", equipment: "Canon Aquilion — EMERG-03", series: 3, slices: 30,
    finding: "Desvio de Linha Média", findingDesc: "Desvio de linha média 1,4 cm", findingType: "crit",
    probability: 0.95, priority: "critico", priorityRank: 1, wait: 14, setor: "emergencia", status: "pendente",
    roi: { top: 36, left: 40, w: 22, h: 30, label: "Linha média desviada" },
    sliceFocus: 16, measure: { label: "Desvio de linha média", value: "14 mm" },
    aiNotes: "Efeito de massa com desvio da linha média de ~14 mm para a esquerda (> 1 cm). Apagamento de sulcos no hemisfério direito. Priorização imediata recomendada.",
  },
  {
    id: "EXM-48224", name: "Antônio Pereira Lima", age: 74, sex: "M", mrn: "PRT-654832",
    protocol: "Crânio s/ contraste", equipment: "GE Revolution CT — EMERG-02", series: 3, slices: 31,
    finding: "Isquemia Aguda (AVC)", findingDesc: "Isquemia aguda — AVCi", findingType: "crit",
    probability: 0.93, priority: "critico", priorityRank: 4, wait: 410, setor: "emergencia", status: "pendente",
    roi: { top: 40, left: 30, w: 24, h: 20, label: "Hipodensidade · ACM E" },
    sliceFocus: 18, measure: { label: "ASPECTS estimado", value: "6/10" },
    aiNotes: "Hipodensidade insular e dos núcleos da base à esquerda, com perda da diferenciação córtico-subcortical. Compatível com isquemia aguda no território da ACM esquerda. ASPECTS estimado 6.",
  },
  {
    id: "EXM-48230", name: "Sebastiana Rocha Alves", age: 61, sex: "F", mrn: "PRT-901277",
    protocol: "Crânio s/ contraste", equipment: "Canon Aquilion — EMERG-03", series: 3, slices: 29,
    finding: "Hidrocefalia Volumosa", findingDesc: "Hidrocefalia volumosa", findingType: "crit",
    probability: 0.91, priority: "critico", priorityRank: 5, wait: 1500, setor: "internacao", status: "em_laudo",
    roi: { top: 28, left: 34, w: 32, h: 26, label: "Ventrículos dilatados" },
    sliceFocus: 14, measure: { label: "Índice de Evans", value: "0,42" },
    aiNotes: "Dilatação acentuada do sistema ventricular supratentorial (índice de Evans 0,42) com sinais de transudação liquórica periventricular. Compatível com hidrocefalia volumosa.",
  },
  {
    id: "EXM-48233", name: "Francisco das Chagas Souza", age: 49, sex: "M", mrn: "PRT-118923",
    protocol: "Crânio s/ contraste", equipment: "GE Revolution CT — EMERG-02", series: 3, slices: 28,
    finding: "Hematoma Subdural", findingDesc: "Hematoma subdural agudo", findingType: "crit",
    probability: 0.87, priority: "critico", priorityRank: 3, wait: 95, setor: "emergencia", status: "pendente",
    roi: { top: 20, left: 26, w: 20, h: 34, label: "Coleção subdural E" },
    sliceFocus: 12, measure: { label: "Espessura", value: "9 mm" },
    aiNotes: "Coleção hiperdensa em forma de crescente na convexidade esquerda (espessura ~9 mm), compatível com hematoma subdural agudo.",
  },
  {
    id: "EXM-48236", name: "Cleusa Maria Barbosa", age: 63, sex: "F", mrn: "PRT-220841",
    protocol: "Crânio s/ contraste", equipment: "Canon Aquilion — EMERG-03", series: 3, slices: 30,
    finding: "Achado indeterminado", findingDesc: "Hipodensidade a esclarecer", findingType: "alto",
    probability: 0.56, priority: "alto", priorityRank: 6, wait: 2800, setor: "internacao", status: "pendente",
    roi: { top: 44, left: 46, w: 14, h: 12, label: "Hipodensidade · revisar" },
    sliceFocus: 15, measure: { label: "Confiança", value: "Moderada" },
    aiNotes: "Área de hipodensidade frontal a esclarecer — possível artefato vs. isquemia precoce. Confiança moderada; recomenda-se revisão.",
  },
  {
    id: "EXM-48201", name: "Rita de Cássia Monteiro", age: 55, sex: "F", mrn: "PRT-447120",
    protocol: "Crânio s/ contraste", equipment: "GE Revolution CT — EMERG-02", series: 3, slices: 31,
    finding: "Sem achados agudos", findingDesc: "Sem achados agudos", findingType: "neg",
    probability: 0.03, priority: "rotina", priorityRank: 9, wait: 390, setor: "emergencia", status: "pendente",
    roi: null, sliceFocus: 16, measure: { label: "Linha média", value: "Centrada" },
    aiNotes: "Sem evidência de sangramento, efeito de massa ou hipodensidade aguda. Estruturas da linha média preservadas.",
  },
  {
    id: "EXM-48176", name: "Geraldo Magela Pinto", age: 70, sex: "M", mrn: "PRT-330918",
    protocol: "Crânio s/ contraste", equipment: "Canon Aquilion — EMERG-03", series: 3, slices: 29,
    finding: "Sem achados agudos", findingDesc: "Sem achados agudos", findingType: "neg",
    probability: 0.05, priority: "rotina", priorityRank: 9, wait: 9000, setor: "ambulatorio", status: "laudado",
    roi: null, sliceFocus: 15, measure: { label: "Linha média", value: "Centrada" },
    aiNotes: "Sem alterações agudas. Laudo já emitido pela equipe.",
  },
];

/* Caso para simular chegada de novo exame crítico da emergência */
window.INCOMING_CASE = {
  id: "EXM-48241", name: "Vicente Oliveira Gomes", age: 66, sex: "M", mrn: "PRT-994120",
  protocol: "Crânio s/ contraste", equipment: "GE Revolution CT — EMERG-02", series: 3, slices: 33,
  finding: "Hemorragia + Desvio de Linha Média", findingDesc: "Hemorragia volumosa c/ desvio", findingType: "crit",
  probability: 0.985, priority: "critico", priorityRank: 1, wait: 1, setor: "emergencia", status: "pendente",
  roi: { top: 32, left: 40, w: 30, h: 26, label: "Hemorragia · desvio 6 mm" },
  sliceFocus: 18, measure: { label: "Desvio de linha média", value: "6 mm" },
  aiNotes: "Volumosa hemorragia intraparenquimatosa com extensão ventricular e desvio de linha média de ~6 mm. ALERTA: priorização imediata.",
};
