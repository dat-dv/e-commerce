import { AlertTriangle } from 'lucide-react';

export const MermaidViewer = () => {
  return (
    <div className="group relative w-full my-8 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 shadow-lg flex flex-col items-center gap-4 text-center overflow-hidden transition-all hover:bg-amber-500/10 hover:border-amber-500/30">
      {/* Background Warning Icon */}
      <AlertTriangle className="absolute -top-10 -right-10 w-40 h-40 text-amber-500/5 rotate-12" />

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="w-8 h-8 text-amber-500" />
      </div>

      <div className="space-y-2 relative z-10">
        <h3 className="text-lg font-black tracking-tight text-amber-500 uppercase">
          Mermaid is Deprecated
        </h3>
        <div className="max-w-md text-sm text-amber-500/70 leading-relaxed">
          <p> Static Mermaid diagrams are no longer supported.</p>
          <p>
            Please migrate this diagram to the
            <span className="font-bold text-amber-500 px-1">FlowViewer</span>
            component
            <br /> for a high-fidelity interactive experience.
          </p>
        </div>
      </div>

      <div className="mt-4 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/10 text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">
        Support Ended: Mar 2026
      </div>
    </div>
  );
};
