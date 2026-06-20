;(function () {
/* Primitivos compartilhados entre os componentes.
   Sem build (Babel no navegador) → exponho tudo em window.T, e cada componente
   lê o que precisa de window.T. Mantém escopo explícito e previsível. */
window.T = window.T || {};

/* Status do exame no fluxo de laudo */
const STATUS = {
  pendente: { label: "Pendente", cls: "bg-muted text-muted-foreground" },
  em_laudo: { label: "Em laudo", cls: "bg-santacasa/10 text-santacasa-escuro" },
  laudado:  { label: "Laudado",  cls: "bg-rotina-bg text-rotina" },
};

/* Tempo de espera legível */
const fmtWait = (m) => m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${(m % 60).toString().padStart(2, "0")}`;

/* Ordenação da fila: nível clínico → rank do achado → confiança → espera (Especificação §5) */
const W = { critico: 0, alto: 1, rotina: 2 };
const rk = (p) => p.priorityRank || 99;
const byClinical = (a, b) => W[a.priority] - W[b.priority] || rk(a) - rk(b) || b.probability - a.probability || b.wait - a.wait;

/* Ícones SVG (stroke = currentColor, herdam a cor do contexto) */
const Svg = ({ children, className = "size-4", w = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w}
    strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const I = {
  bolt: <Svg><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></Svg>,
  search: <Svg className="size-3.5"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Svg>,
  ext: <Svg className="size-3.5"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></Svg>,
  check: <Svg className="size-3"><path d="M20 6 9 17l-5-5" /></Svg>,
  x: <Svg className="size-5"><path d="M18 6 6 18M6 6l12 12" /></Svg>,
  chevron: <Svg className="size-4"><path d="m9 18 6-6-6-6" /></Svg>,
  pulse: <Svg className="size-5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></Svg>,
  clock: <Svg className="size-5"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>,
  inbox: <Svg className="size-5"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.4 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.4-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.8 1.5Z" /></Svg>,
  tri: <Svg className="size-3" w={2.2}><path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></Svg>,
  alert: <Svg className="size-3" w={2.2}><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></Svg>,
};

/* Severidade clínica: cor + rótulo + ícone (nunca só cor → acessível a daltônicos) */
const SEV = {
  critico: { label: "Crítico", text: "text-crit",   bg: "bg-crit-bg",   dot: "bg-crit",   hex: "#dc2626", icon: I.tri },
  alto:    { label: "Alto",    text: "text-alto",   bg: "bg-alto-bg",   dot: "bg-alto",   hex: "#d97706", icon: I.alert },
  rotina:  { label: "Rotina",  text: "text-rotina", bg: "bg-rotina-bg", dot: "bg-rotina", hex: "#15a34a", icon: I.check },
};

Object.assign(window.T, { STATUS, fmtWait, W, rk, byClinical, Svg, I, SEV });
})();
