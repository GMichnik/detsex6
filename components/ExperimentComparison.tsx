import React from 'react';
import { ExperimentState } from '../types';
import { Schematic } from './Schematic';
import { X, ArrowRightLeft, Dna, Scissors, Activity, Syringe } from 'lucide-react';

interface ExperimentComparisonProps {
  exp1: ExperimentState;
  exp2: ExperimentState;
  onClose: () => void;
}

export const ExperimentComparison: React.FC<ExperimentComparisonProps> = ({ exp1, exp2, onClose }) => {
  
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
     return i === 'none' ? 'Aucun' : i;
  };

  const renderExperimentCard = (exp: ExperimentState, label: string) => (
    <div className="flex-1 flex flex-col min-w-[300px]">
      <div className="bg-teal-50 border-b border-teal-100 p-4 text-center rounded-t-xl">
        <h3 className="font-bold text-teal-900">{label}</h3>
        <p className="text-xs text-teal-600 font-mono">{new Date(exp.timestamp).toLocaleTimeString()}</p>
      </div>
      
      <div className="p-4 border-x border-slate-200 bg-white space-y-4 flex-1">
        {/* Parameters */}
        <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm">
          <h4 className="font-semibold text-slate-700 border-b border-slate-200 pb-1 mb-2">Paramètres</h4>
          <div className="flex justify-between">
            <span className="text-slate-500 flex items-center gap-1"><Dna className="w-3 h-3"/> Génotype</span>
            <span className={`font-bold ${exp.genotype === 'XX' ? 'text-emerald-600' : 'text-orange-600'}`}>{exp.genotype}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 flex items-center gap-1"><Scissors className="w-3 h-3"/> Chirurgie</span>
            <span className={`font-medium ${exp.ablation ? 'text-red-600' : 'text-slate-800'}`}>
              {exp.ablation ? 'Castration' : 'Aucune'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 flex items-center gap-1"><Activity className="w-3 h-3"/> Greffe</span>
            <span className="font-medium text-slate-800">{getGraftLabel(exp.graft)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 flex items-center gap-1"><Syringe className="w-3 h-3"/> Implant</span>
            <span className="font-medium text-slate-800">{getImplantLabel(exp.implant)}</span>
          </div>
        </div>

        {/* Schematic - Fixed Aspect Ratio and Sizing */}
        <div className="w-full aspect-[2/3] max-w-[240px] mx-auto">
          <Schematic result={exp.result} stage="final" genotype={exp.genotype} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-teal-700">
            <ArrowRightLeft className="w-5 h-5" />
            <h2 className="font-bold text-lg">Comparaison d'Expériences</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
            {renderExperimentCard(exp1, "Expérience A")}
            
            {/* Divider / VS */}
            <div className="hidden md:flex flex-col items-center justify-center">
              <div className="h-full w-px bg-slate-200 absolute"></div>
              <div className="z-10 bg-white p-2 rounded-full border border-slate-200 text-slate-400 font-bold text-xs">VS</div>
            </div>
            
            {renderExperimentCard(exp2, "Expérience B")}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm shadow-teal-200"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};