;(function () {
/* App: estado da fila, filtros, busca, simulação de novo exame e abertura do caso.
   Monta os componentes de window.T e renderiza no #root. */
const { useState, useCallback, useMemo } = React;

function App() {
  const { Header, Kpis, Queue, CasoModal, Toasts } = window.T;
  const [patients, setPatients] = useState(() => window.SEED_PATIENTS.map(p => ({ ...p })));
  const [openId, setOpenId] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("pendentes");
  const [toasts, setToasts] = useState([]);
  const [flashId, setFlashId] = useState(null);

  const pushToast = useCallback((text, opts = {}) => {
    const id = "t" + Date.now() + Math.random();
    setToasts(ts => [...ts, { id, text, ...opts }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), opts.ttl || 5200);
  }, []);

  const counts = useMemo(() => ({
    pendentes: patients.filter(p => p.status !== "laudado").length,
    criticos: patients.filter(p => p.priority === "critico" && p.status !== "laudado").length,
    todos: patients.length,
  }), [patients]);

  const view = useMemo(() => {
    let v = patients;
    if (filter === "pendentes") v = v.filter(p => p.status !== "laudado");
    else if (filter === "criticos") v = v.filter(p => p.priority === "critico" && p.status !== "laudado");
    const q = query.trim().toLowerCase();
    if (q) v = v.filter(p => (p.name + p.id + p.mrn).toLowerCase().includes(q));
    return v;
  }, [patients, filter, query]);

  const open = patients.find(p => p.id === openId) || null;

  const handleSimulate = useCallback(() => {
    const base = window.INCOMING_CASE;
    setPatients(prev => {
      const n = prev.filter(p => p.id.startsWith(base.id)).length;
      const id = n ? base.id + "-" + n : base.id;
      return [{ ...base, id, wait: 1 }, ...prev];
    });
    setFilter("pendentes");
    setFlashId(base.id);
    setTimeout(() => setFlashId(null), 2300);
    pushToast("Novo exame crítico recebido do tomógrafo — confiança da IA 98%. Posicionado no topo da fila.", { kind: "critico", caseId: base.id, ttl: 7000 });
  }, [pushToast]);

  const handlePacs = useCallback((p) => {
    setPatients(prev => prev.map(x => x.id === p.id && x.status === "pendente" ? { ...x, status: "em_laudo" } : x));
    setOpenId(null);
    pushToast(`Abrindo ${p.id} no PACS Carestream para laudo… status → Em laudo.`);
  }, [pushToast]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onSimulate={handleSimulate} />
      <Kpis patients={patients} />
      <main className="mx-auto max-w-[1200px] px-6 py-6">
        <Queue patients={view} onOpen={setOpenId} query={query} setQuery={setQuery} flashId={flashId} filter={filter} setFilter={setFilter} counts={counts} />
      </main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-3 text-xs text-muted-foreground">
          <span><strong className="text-santacasa-escuro">Aviso clínico:</strong> ferramenta de triagem e priorização. Não substitui o laudo médico.</span>
          <span className="font-mono">Modelo: NeuroCT-Triage v2.3</span>
        </div>
      </footer>
      {open && <CasoModal p={open} onClose={() => setOpenId(null)} onPacs={handlePacs} />}
      <Toasts items={toasts} onClick={(id) => { setFilter("pendentes"); setOpenId(id); }} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
