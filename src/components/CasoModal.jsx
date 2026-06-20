;(function () {
/* Modal do caso: visualizador + achado da IA (nome, prioridade clínica, medida,
   confiança e notas) + ação de laudar no PACS. Fecha com Esc ou clique fora. */
const { useEffect } = React;

function CasoModal({ p, onClose, onPacs }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!p) return null;
  const { SEV, STATUS, I, Viewer } = window.T;
  const s = SEV[p.priority];
  const isNeg = p.findingType === "neg";
  const done = p.status === "laudado";
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 animate-[fadein_.15s_ease-out]" onClick={onClose} role="dialog" aria-modal="true" aria-label={"Caso " + p.id}>
      <div className="absolute inset-0 bg-santacasa-profundo/40 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()}
        className="relative z-10 flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-[modalin_.2s_cubic-bezier(.2,.8,.2,1)]">
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
              <span className={"rounded px-2 py-0.5 text-[10px] font-semibold " + STATUS[p.status].cls}>{STATUS[p.status].label}</span>
              <span className={"flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " + s.bg + " " + s.text}>{s.icon}{s.label}</span>
            </div>
            <h2 className="mt-1 truncate text-xl font-bold tracking-tight text-santacasa-profundo">{p.name}</h2>
            <div className="mt-0.5 text-xs text-muted-foreground">{p.age} anos · {p.sex === "F" ? "Feminino" : "Masculino"} · Prontuário <span className="font-mono">{p.mrn}</span></div>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-santacasa">{I.x}</button>
        </header>

        <div className="flex flex-col gap-3 overflow-y-auto p-6">
          <Viewer p={p} />

          <div className={"rounded-lg border px-4 py-3 " + (isNeg ? "border-rotina/30 bg-rotina-bg/50" : "border-border " + s.bg + "/50")}>
            <div className="flex items-center justify-between gap-3">
              <span className={"flex items-center gap-2 text-sm font-bold " + s.text}>
                <span className={"flex size-5 items-center justify-center rounded-full text-white " + s.dot}>{s.icon}</span>
                {p.finding}
              </span>
              <span className={"font-mono text-sm font-bold " + s.text}>Confiança {Math.round(p.probability * 100)}%</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground">{p.measure.label}: <span className="font-mono font-semibold text-foreground">{p.measure.value}</span></span>
              <span className="text-muted-foreground">Corte de referência: <span className="font-mono font-semibold text-foreground">{p.sliceFocus}/{p.slices}</span></span>
              {p.priorityRank <= 5 && <span className="text-muted-foreground">Prioridade clínica: <span className={"font-semibold " + s.text}>Nº{p.priorityRank} de 5</span></span>}
            </div>
            <p className="mt-2 border-t border-border/60 pt-2 text-xs leading-relaxed text-foreground/80">{p.aiNotes}</p>
          </div>

          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sugestão da IA para priorização · não substitui o laudo médico</p>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-border bg-secondary/40 px-6 py-3.5">
          <button onClick={onClose} className="rounded-md px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-santacasa">Fechar</button>
          {done
            ? <span className="flex items-center gap-1.5 rounded-md bg-rotina-bg px-4 py-2 text-xs font-semibold text-rotina">{I.check}Laudo emitido</span>
            : <button onClick={() => onPacs(p)} className="flex items-center gap-1.5 rounded-md bg-santacasa px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-santacasa-escuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-santacasa focus-visible:ring-offset-2">{I.ext}Laudar no PACS Carestream</button>}
        </footer>
      </div>
    </div>
  );
}

window.T.CasoModal = CasoModal;
})();
