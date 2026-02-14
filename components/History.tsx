import React from 'react';
import { ExperimentState } from '../types';
import { Trash2, RotateCcw, FileText, ArrowRightLeft } from 'lucide-react';

interface HistoryProps {
  history: ExperimentState[];
  onLoad: (exp: ExperimentState) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onCompare: () => void;
}

export const History: React.FC<HistoryProps> = ({ 
  history, 
  onLoad, 
  onDelete, 
  onClear,
  selectedIds,
  onToggleSelection,
  onCompare
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center p-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p>Aucune expérience enregistrée.</p>
        <p className="text-sm mt-1">Lancez une simulation pour sauvegarder.</p>
      </div>
    );
  }

  const getGraftLabel = (g: string) => {
    switch (g) {
      case 'none': return 'Aucune';
      case 'testis': return 'Testicule';
      case 'ovary': return 'Ovaire';
      default: return g;
    }
  };

  const getImplantLabel = (i: string) => {
     if (i === 'testosterone') return 'Testostérone';
     if (i === 'amh') return 'AMH';
     if (i === 'both') return 'Testostérone + AMH';
     return i;
  };

  const isCompareReady = selectedIds.length === 2;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Journal de Bord ({history.length})
          </h3>
          <button 
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded"
          >
            Effacer tout
          </button>
        </div>
        
        {/* Comparison Action Bar */}
        <div className={`transition-all duration-300 overflow-hidden ${history.length < 2 ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
          <button
            onClick={onCompare}
            disabled={!isCompareReady}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              isCompareReady 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200 hover:bg-teal-700' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            {isCompareReady ? 'Comparer la sélection' : `Sélectionner 2 expériences (${selectedIds.length}/2)`}
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 min-h-[300px]">
        {history.slice().reverse().map((exp) => {
          const isSelected = selectedIds.includes(exp.id);
          return (
            <div 
              key={exp.id} 
              className={`p-4 border-b border-slate-100 transition-colors group relative ${isSelected ? 'bg-teal-50/50' : 'hover:bg-slate-50'}`}
            >
              {/* Checkbox for selection */}
              <div className="absolute top-4 right-4">
                 <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelection(exp.id)}
                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
                 />
              </div>

              <div className="flex justify-between items-start mb-2 pr-8">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${exp.genotype === 'XX' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                  Sujet : {exp.genotype}
                </span>
              </div>
              
              <div className="text-sm text-slate-600 mb-3 space-y-1 pr-6 cursor-pointer" onClick={() => onToggleSelection(exp.id)}>
                 {exp.ablation && <div className="flex items-center gap-2 text-red-600"><span>• Castration</span></div>}
                 {exp.graft !== 'none' && <div className="flex items-center gap-2 text-teal-600"><span>• Greffe : {getGraftLabel(exp.graft)}</span></div>}
                 {exp.implant !== 'none' && <div className="flex items-center gap-2 text-blue-600"><span>• Implant : {getImplantLabel(exp.implant)}</span></div>}
                 {!exp.ablation && exp.graft === 'none' && exp.implant === 'none' && <div className="text-slate-400 italic">• Groupe Témoin</div>}
                 <div className="text-xs text-slate-400 mt-1">
                   {new Date(exp.timestamp).toLocaleTimeString()}
                 </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onLoad(exp)}
                  className="flex-1 text-xs bg-white border border-slate-200 text-slate-700 py-1.5 rounded hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Restaurer
                </button>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="px-3 text-xs bg-white border border-slate-200 text-slate-400 py-1.5 rounded hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};