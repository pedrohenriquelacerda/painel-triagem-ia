;(function () {
/* Fila de triagem: achado + prioridade (cor + rótulo + ícone). Confiança fica no caso.
   Linha = QueueRow; seção com busca, abas (Pendentes/Críticos/Todos) e ordenação clínica. */
const { useMemo } = React;

function QueueRow({ p, rank, onOpen, flash }) {
  const { SEV, STATUS, fmtWait, I } = window.T;
  const s = SEV[p.priority];
  const showMeasure = p.measure && p.findingType !== "neg";
  return (
    <button onClick={() => onOpen(p.id)}
      className={"group relative flex w-full items-center gap-4 border-b border-border/70 px-5 py-3.5 text-left transition hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-santacasa "
        + (p.priority === "critico" ? "bg-crit-bg/25 " : "")
        + (flash ? "animate-[flash_2.2s_ease-out]" : "")}>
      <span className={"flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold tabular-nums " + s.bg + " " + s.text}>{rank}</span>
      <span className={"size-2 shrink-0 rounded-full " + s.dot} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">{p.name}</span>
          <span className="font-mono text-[10px] text-muted-foreground">{p.age}{p.sex}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs">
          <span className="font-mono text-muted-foreground">{p.id}</span>
          <span className="text-border">·</span>
          <span className="truncate font-medium text-foreground">{p.findingDesc}</span>
          {showMeasure && <><span className="text-border">·</span><span className="whitespace-nowrap font-mono text-muted-foreground">{p.measure.value}</span></>}
        </div>
      </div>
      <span className={"flex w-[92px] shrink-0 items-center justify-center gap-1.5 rounded-md py-1 text-[11px] font-bold " + s.bg + " " + s.text}>
        {s.icon}{s.label}
      </span>
      <span className="w-16 text-right font-mono text-[11px] tabular-nums text-muted-foreground">{fmtWait(p.wait)}</span>
      <span className={"w-20 shrink-0 rounded px-2 py-0.5 text-center text-[10px] font-semibold " + STATUS[p.status].cls}>{STATUS[p.status].label}</span>
      <span className="shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-santacasa">{I.chevron}</span>
    </button>
  );
}

function Queue({ patients, onOpen, query, setQuery, flashId, filter, setFilter, counts }) {
  const { byClinical, I } = window.T;
  const sorted = useMemo(() => [...patients].sort(byClinical), [patients]);
  const tabs = [
    { k: "pendentes", label: "Pendentes" },
    { k: "criticos", label: "Críticos" },
    { k: "todos", label: "Todos" },
  ];
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-santacasa" />
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-santacasa-escuro">Fila de Triagem</h2>
          <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[11px] font-semibold text-santacasa-escuro">{sorted.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-santacasa/40">
          <span className="text-muted-foreground">{I.search}</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nome, ID, prontuário…"
            className="w-52 bg-transparent text-xs outline-none placeholder:text-muted-foreground" aria-label="Buscar na fila" />
        </div>
      </div>
      <div className="flex items-center gap-1 border-b border-border px-4 py-2">
        {tabs.map(t => {
          const on = filter === t.k;
          return (
            <button key={t.k} onClick={() => setFilter(t.k)}
              className={"flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-santacasa "
                + (on ? "bg-santacasa text-white shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-santacasa-escuro")}>
              {t.label}
              <span className={"rounded px-1.5 font-mono text-[10px] " + (on ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>{counts[t.k]}</span>
            </button>
          );
        })}
      </div>
      <div className="px-5 py-2.5">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Ordenada por <strong className="text-foreground">prioridade clínica</strong> e confiança da IA. A IA <strong className="text-foreground">assiste</strong> a triagem — o laudo é sempre do radiologista. Abra o caso para ver a região, a confiança e as notas.
        </p>
      </div>
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto border-t border-border">
        {sorted.map((p, i) => <QueueRow key={p.id} p={p} rank={i + 1} onOpen={onOpen} flash={p.id === flashId} />)}
        {!sorted.length && <div className="px-5 py-16 text-center text-sm text-muted-foreground">Nenhum caso nesta visão.</div>}
      </div>
    </section>
  );
}

window.T.Queue = Queue;
})();
