;(function () {
/* Cabeçalho: logotipo Santa Casa, título, status "ao vivo", relógio, simular exame. */
const { useState, useEffect } = React;

function Header({ onSimulate }) {
  const { I } = window.T;
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <header className="border-b border-white/10 bg-gradient-to-r from-santacasa-profundo via-santacasa-profundo to-santacasa-escuro text-white shadow-sm">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <img src="assets/exintime.png" alt="EXinTime" className="h-9 w-auto shrink-0 sm:h-11" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.45))" }} />
          <span className="hidden h-9 w-px bg-white/20 sm:block" />
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <span className="truncate text-base font-extrabold tracking-tight">EXin<span className="text-santacasa-100">Time</span></span>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-rotina/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                <span className="size-1.5 rounded-full bg-rotina animate-[livedot_1.4s_ease-in-out_infinite]" />ao vivo
              </span>
            </div>
            <div className="mt-0.5 truncate text-[11px] font-medium tracking-[0.04em] text-white/60">O Tempo Exato do Diagnóstico por Imagem</div>
          </div>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-4">
          <div className="hidden text-right font-mono text-xs text-white/70 md:block">
            <div>{now.toLocaleDateString("pt-BR")}</div>
            <div className="text-sm font-medium text-white tabular-nums">{now.toLocaleTimeString("pt-BR")}</div>
          </div>
          <button onClick={onSimulate} aria-label="Simular novo exame" className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-white px-3 py-2 text-xs font-semibold text-santacasa-profundo shadow-sm transition hover:bg-white/90 hover:shadow active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-santacasa-profundo">
            {I.bolt}<span className="hidden sm:inline">Simular novo exame</span><span className="sm:hidden">Simular</span>
          </button>
        </div>
      </div>
    </header>
  );
}

window.T.Header = Header;
})();
