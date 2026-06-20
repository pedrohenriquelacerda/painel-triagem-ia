;(function () {
/* Fila de triagem: achado + prioridade (cor + rótulo + ícone). Confiança fica no caso.
   Linha = QueueRow; seção com busca, abas (Pendentes/Críticos/Todos) e ordenação clínica. */
const { useMemo, useState } = React;

/* QueueRow: card empilhado no celular; linha de colunas no desktop (≥ sm).
   Os blocos `sm:contents` deixam seus filhos participarem da mesma linha flex no desktop. */
function QueueRow({ p, rank, onOpen, flash }) {
  const { SEV, STATUS, SETOR, fmtWait, priorityIndex, I } = window.T;
  const s = SEV[p.priority];
  const sec = SETOR[p.setor] || SETOR.emergencia;
  const idx = priorityIndex(p);
  const showMeasure = p.measure && p.findingType !== "neg";
  return (
    <button onClick={() => onOpen(p.id)}
      className={"group relative flex w-full flex-col gap-3 rounded-xl border border-border p-4 text-left transition hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-santacasa "
        + "sm:flex-row sm:items-center sm:gap-4 sm:rounded-none sm:border-x-0 sm:border-t-0 sm:border-b sm:border-border/70 sm:p-0 sm:px-5 sm:py-3.5 "
        + (p.priority === "critico" ? "bg-crit-bg/25 " : "")
        + (flash ? "animate-[flash_2.2s_ease-out]" : "")}>
      {/* Identidade + índice (cabeçalho do card no celular) */}
      <div className="flex w-full items-start gap-3 sm:contents">
        <span className={"flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold tabular-nums " + s.bg + " " + s.text}>{rank}</span>
        <span className={"mt-1.5 size-2 shrink-0 rounded-full sm:mt-0 " + s.dot} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{p.name}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{p.age}{p.sex}</span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
            <span className="font-mono text-muted-foreground">{p.id}</span>
            <span className="text-border">·</span>
            <span className="font-medium text-foreground">{p.findingDesc}</span>
            {showMeasure && <><span className="text-border">·</span><span className="whitespace-nowrap font-mono text-muted-foreground">{p.measure.value}</span></>}
          </div>
        </div>
        <span className="flex shrink-0 flex-col items-center justify-center leading-none sm:w-[84px]" title={"Índice de prioridade: " + idx}>
          <span className={"font-mono text-lg font-extrabold tabular-nums " + s.text}>{idx}</span>
          <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Prioridade</span>
        </span>
      </div>
      {/* Setor · espera · status (rodapé do card no celular) */}
      <div className="flex flex-wrap items-center gap-2 pl-9 sm:contents sm:pl-0">
        <span className={"rounded px-2 py-1 text-center text-[10px] font-semibold sm:w-[104px] " + sec.cls}>{sec.label}</span>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground sm:w-16 sm:text-right">{fmtWait(p.wait)}</span>
        <span className={"rounded px-2 py-0.5 text-center text-[10px] font-semibold sm:w-20 " + STATUS[p.status].cls}>{STATUS[p.status].label}</span>
        <span className="hidden shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-santacasa sm:block">{I.chevron}</span>
      </div>
    </button>
  );
}

function Queue({ patients, onOpen, query, setQuery, flashId, filter, setFilter, counts }) {
  const { byClinical, I } = window.T;
  const [helpOpen, setHelpOpen] = useState(false);
  const sorted = useMemo(() => [...patients].sort(byClinical), [patients]);
  const tabs = [
    { k: "pendentes", label: "Pendentes" },
    { k: "criticos", label: "Críticos" },
    { k: "todos", label: "Todos" },
  ];
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="relative flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-santacasa" />
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-santacasa-escuro">Fila de Triagem</h2>
          <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[11px] font-semibold text-santacasa-escuro">{sorted.length}</span>
          <button onClick={() => setHelpOpen(v => !v)} aria-expanded={helpOpen} aria-label="Como funciona o índice de prioridade"
            className={"flex size-5 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-santacasa "
              + (helpOpen ? "border-santacasa bg-santacasa text-white" : "border-border text-muted-foreground hover:bg-accent hover:text-santacasa-escuro")}>
            {I.info}
          </button>
          {helpOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setHelpOpen(false)} />
              <div role="dialog" className="absolute left-0 top-9 z-20 w-[min(92vw,360px)] rounded-lg border border-border bg-card p-3.5 text-[11px] leading-relaxed text-muted-foreground shadow-xl">
                <p className="mb-1.5 text-xs font-bold normal-case tracking-normal text-santacasa-escuro">Como a fila é ordenada</p>
                Pelo <strong className="text-foreground">índice de prioridade</strong>: a gravidade do achado define o piso (um caso grave já entra prioritário) e o tempo de espera empurra o índice ao topo conforme se aproxima do SLA do setor — então um caso sem gravidade que esperou demais também sobe.
                <ul className="mt-2 space-y-0.5 font-mono text-[10px]">
                  <li>Emergência · limite 8&nbsp;h</li>
                  <li>Internação · limite 3&nbsp;dias</li>
                  <li>Ambulatório · limite 10&nbsp;dias</li>
                </ul>
                <p className="mt-2 border-t border-border/60 pt-2">A IA <strong className="text-foreground">assiste</strong> a triagem — o laudo é sempre do radiologista.</p>
              </div>
            </>
          )}
        </div>
        <div className="flex w-full items-center gap-2 rounded-md border border-input bg-background px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-santacasa/40 sm:w-auto">
          <span className="text-muted-foreground">{I.search}</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nome, ID, prontuário…"
            className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground sm:w-52" aria-label="Buscar na fila" />
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
      <div className="flex flex-col gap-3 border-t border-border p-3 sm:block sm:gap-0 sm:p-0 sm:max-h-[calc(100vh-360px)] sm:overflow-y-auto">
        {sorted.map((p, i) => <QueueRow key={p.id} p={p} rank={i + 1} onOpen={onOpen} flash={p.id === flashId} />)}
        {!sorted.length && <div className="px-5 py-16 text-center text-sm text-muted-foreground">Nenhum caso nesta visão.</div>}
      </div>
    </section>
  );
}

window.T.Queue = Queue;
})();
