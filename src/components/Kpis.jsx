;(function () {
/* Indicadores do topo: críticos na fila, pendentes, tempo médio até triagem.
   No celular ficam recolhidos atrás de um dropdown (economiza altura); no
   desktop (≥ sm) aparecem sempre. */
const { useState } = React;

function Kpis({ patients }) {
  const { I } = window.T;
  const [open, setOpen] = useState(false);
  const crit = patients.filter(p => p.priority === "critico" && p.status !== "laudado").length;
  const pend = patients.filter(p => p.status === "pendente").length;
  const cards = [
    { label: "Críticos na fila", value: crit, sub: "Aguardando leitura", val: "text-crit", icon: I.pulse, iconBg: "bg-crit-bg text-crit" },
    { label: "Pendentes", value: pend, sub: "Ainda não abertos", val: "text-santacasa-escuro", icon: I.inbox, iconBg: "bg-accent text-santacasa-escuro" },
    { label: "Tempo médio até triagem", value: "38s", sub: "Aquisição → fila", val: "text-rotina", icon: I.clock, iconBg: "bg-rotina-bg text-rotina" },
  ];
  return (
    <div className="shrink-0 border-b border-border bg-card">
      <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 sm:py-4">
        {/* Toggle (só no celular) — mostra resumo crítico mesmo recolhido */}
        <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="kpi-grid"
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5 text-left transition hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-santacasa sm:hidden">
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Indicadores
            <span className="rounded bg-crit-bg px-1.5 py-0.5 font-mono text-[11px] font-bold text-crit">{crit} críticos</span>
            <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[11px] font-bold text-santacasa-escuro">{pend} pend.</span>
          </span>
          <span className={"shrink-0 text-muted-foreground transition " + (open ? "rotate-90" : "")}>{I.chevron}</span>
        </button>
        <div id="kpi-grid" className={(open ? "mt-3 grid" : "hidden") + " grid-cols-1 gap-4 sm:mt-0 sm:grid sm:grid-cols-3"}>
          {cards.map(c => (
            <div key={c.label} className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 shadow-sm transition hover:shadow">
              <div className={"flex size-11 shrink-0 items-center justify-center rounded-lg " + c.iconBg}>{c.icon}</div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{c.label}</div>
                <div className={"text-3xl font-bold leading-tight tracking-tight tabular-nums " + c.val}>{c.value}</div>
                <div className="text-xs text-muted-foreground">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.T.Kpis = Kpis;
})();
