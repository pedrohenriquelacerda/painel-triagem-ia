;(function () {
/* Visualizador de TC (mock): cérebro estilizado + região sinalizada pela IA (ROI),
   controle de corte e atalho para o corte de referência. Cor da ROI = severidade. */
const { useState, useEffect } = React;

function Viewer({ p }) {
  const { SEV } = window.T;
  const [slice, setSlice] = useState(p.sliceFocus);
  useEffect(() => { setSlice(p.sliceFocus); }, [p.id]);
  const onFocus = slice === p.sliceFocus;
  const s = SEV[p.priority];
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#05070d]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 52%, #2d3340 0%, #1a1f29 35%, #0a0d13 70%, #05070d 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-[58%] rounded-[48%] border border-white/15"
            style={{ background: "radial-gradient(circle, rgba(120,135,160,.18) 0%, rgba(60,68,86,.35) 60%, rgba(20,24,32,.55) 100%)", boxShadow: "inset 0 0 60px rgba(0,0,0,.6)" }} />
        </div>
        {p.roi && onFocus && (
          <div className={"absolute rounded-sm border-2 " + (p.priority === "critico" ? "animate-[critpulse_1.8s_ease-in-out_infinite]" : "")}
            style={{ top: p.roi.top + "%", left: p.roi.left + "%", width: p.roi.w + "%", height: p.roi.h + "%", borderColor: s.hex, boxShadow: "0 0 0 2px rgba(0,0,0,0.5)" }}>
            <span className="absolute -top-6 left-0 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-white" style={{ background: s.hex }}>{p.roi.label}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 p-4 font-mono text-[10px] text-white/70">
          <div className="flex justify-between">
            <div className="space-y-0.5"><div>{p.name.toUpperCase()}</div><div className="text-white/50">{p.mrn}</div></div>
            <div className="space-y-0.5 text-right"><div>{p.equipment}</div><div className="text-white/50">{p.protocol}</div></div>
          </div>
          <div className="absolute bottom-4 left-4 space-y-0.5"><div>SLICE {slice} / {p.slices}</div><div className="text-white/50">SERIES {p.series}</div></div>
          <div className="absolute bottom-4 right-4 space-y-0.5 text-right"><div>WW 80 / WL 40</div><div className="text-white/50">NeuroCT-Triage v2.3</div></div>
        </div>
        {p.roi && (
          <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/50 px-2 py-1 font-mono text-[10px] text-white/80 backdrop-blur">
            <span className="mr-1 inline-block size-1.5 rounded-full align-middle" style={{ background: s.hex }} />Região sinalizada
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 border-t border-border bg-secondary/40 px-4 py-2.5">
        <span className="font-mono text-[11px] text-muted-foreground">corte {slice}/{p.slices}</span>
        <input type="range" min="1" max={p.slices} value={slice} onChange={e => setSlice(+e.target.value)} className="flex-1 accent-santacasa" aria-label="Navegar cortes" />
        <button onClick={() => setSlice(p.sliceFocus)} className="whitespace-nowrap font-mono text-[11px] text-santacasa hover:text-santacasa-escuro">↺ região da IA</button>
      </div>
    </div>
  );
}

window.T.Viewer = Viewer;
})();
