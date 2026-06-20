;(function () {
/* Indicadores do topo: críticos na fila, pendentes, tempo médio até triagem. */
function Kpis({ patients }) {
  const { I } = window.T;
  const crit = patients.filter(p => p.priority === "critico" && p.status !== "laudado").length;
  const pend = patients.filter(p => p.status === "pendente").length;
  const cards = [
    { label: "Críticos na fila", value: crit, sub: "Aguardando leitura", val: "text-crit", icon: I.pulse, iconBg: "bg-crit-bg text-crit" },
    { label: "Pendentes", value: pend, sub: "Ainda não abertos", val: "text-santacasa-escuro", icon: I.inbox, iconBg: "bg-accent text-santacasa-escuro" },
    { label: "Tempo médio até triagem", value: "38s", sub: "Aquisição → fila", val: "text-rotina", icon: I.clock, iconBg: "bg-rotina-bg text-rotina" },
  ];
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1200px] px-6 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
