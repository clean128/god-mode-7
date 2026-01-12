import { Loader2 } from 'lucide-react';

export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="glass-panel p-8 flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <div className="text-center">
          <p className="text-xl font-bold text-white">Loading...</p>
          <p className="text-sm text-gray-400 mt-1">Fetching data from L2</p>
        </div>
      </div>
    </div>
  );
}
