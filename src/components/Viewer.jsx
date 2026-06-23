;(function () {
/* Visualizador de TC (mock): cérebro estilizado + região sinalizada pela IA (ROI),
   controle de corte e atalho para o corte de referência. Cor da ROI = severidade. */
const { useState, useEffect } = React;

/* Colormap "jet": t 0→1 percorre azul → verde → amarelo → laranja → vermelho.
   A confiança da IA define a cor do pico (alta = vermelho; baixa = amarelo/verde/azul). */
const JET = [[0, [45, 110, 230]], [0.4, [70, 210, 110]], [0.68, [255, 224, 45]], [0.86, [255, 140, 30]], [1, [235, 45, 45]]];
const jet = (t) => {
  t = Math.max(0, Math.min(1, t));
  for (let i = 1; i < JET.length; i++) {
    if (t <= JET[i][0]) {
      const [a, ca] = JET[i - 1], [b, cb] = JET[i], f = (t - a) / (b - a);
      return ca.map((v, j) => Math.round(v + (cb[j] - v) * f));
    }
  }
  return JET[JET.length - 1][1];
};
const rgbaArr = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

function Viewer({ p }) {
  const { SEV } = window.T;
  const [slice, setSlice] = useState(p.sliceFocus);
  useEffect(() => { setSlice(p.sliceFocus); }, [p.id]);
  const onFocus = slice === p.sliceFocus;
  const s = SEV[p.priority];
  // Mapa de calor: pequeno, centrado na ROI. A confiança (probability) define a cor
  // do pico; rumo à borda esfria, fica mais transparente e se dispersa.
  const heat = p.roi && {
    cx: p.roi.left + p.roi.w / 2,
    cy: p.roi.top + p.roi.h / 2,
    d: Math.max(p.roi.w, p.roi.h) * 0.8, // diâmetro (% da largura) → círculo via aspect-ratio
  };
  const prob = p.probability;
  const cPeak = jet(prob), cMid = jet(prob * 0.6), cCold = jet(prob * 0.3);
  const heatGradient = p.roi && `radial-gradient(circle, rgba(255,255,255,${(0.3 + 0.5 * prob).toFixed(2)}) 0%, ${rgbaArr(cPeak, 0.9)} 14%, ${rgbaArr(cMid, 0.5)} 44%, ${rgbaArr(cCold, 0.2)} 72%, ${rgbaArr(cCold, 0)} 100%)`;
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#05070d]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 52%, #2d3340 0%, #1a1f29 35%, #0a0d13 70%, #05070d 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-[58%] rounded-[48%] border border-white/15"
            style={{ background: "radial-gradient(circle, rgba(120,135,160,.18) 0%, rgba(60,68,86,.35) 60%, rgba(20,24,32,.55) 100%)", boxShadow: "inset 0 0 60px rgba(0,0,0,.6)" }} />
        </div>
        {p.roi && onFocus && (
          <>
            {/* Mapa de calor circular da ativação da IA (substitui o retângulo) */}
            <div className={"pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full " + (p.priority === "critico" ? "animate-[heatpulse_1.9s_ease-in-out_infinite]" : "")}
              style={{ top: heat.cy + "%", left: heat.cx + "%", width: heat.d + "%", aspectRatio: "1 / 1", background: heatGradient, filter: "blur(4px)", mixBlendMode: "screen" }} />
            <span className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-white shadow-[0_0_0_1px_rgba(0,0,0,.4)]"
              style={{ left: heat.cx + "%", top: (p.roi.top - 1) + "%", background: s.hex }}>{p.roi.label}</span>
          </>
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
