;(function () {
/* Notificações flutuantes: chegada de novo exame crítico, abertura no PACS, etc. */
function Toasts({ items, onClick }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2" role="status" aria-live="polite">
      {items.map(t => (
        <div key={t.id} className="flex items-center gap-3 rounded-lg bg-santacasa-profundo px-4 py-3 text-sm font-medium text-white shadow-xl animate-[toastin_.35s_cubic-bezier(.2,.8,.2,1)]">
          <span className={"size-2 rounded-full " + (t.kind === "critico" ? "bg-crit shadow-[0_0_0_3px_rgba(220,38,38,.35)]" : "bg-rotina")} />
          <span className="max-w-[460px]">{t.text}</span>
          {t.caseId && <button onClick={() => onClick(t.caseId)} className="font-semibold text-santacasa-100 underline-offset-2 hover:underline">Ver caso →</button>}
        </div>
      ))}
    </div>
  );
}

window.T.Toasts = Toasts;
})();
