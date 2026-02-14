import React from 'react';
import { SimulationConfig, Genotype, GraftType, ImplantType, DevelopmentStage } from '../types';
import { Scissors, Syringe, TestTube, Dna, Activity, Clock, Microscope } from 'lucide-react';

interface LabControlsProps {
  config: SimulationConfig;
  onChange: (newConfig: SimulationConfig) => void;
  onRun: () => void;
  isRunDisabled: boolean;
}

export const LabControls: React.FC<LabControlsProps> = ({ config, onChange, onRun, isRunDisabled }) => {
  
  const updateConfig = (key: keyof SimulationConfig, value: any) => {
    // If switching to Adult, we reset strictly to avoid confusion, but user can now edit
    if (key === 'stage' && value === 'adult') {
      onChange({ 
        ...config, 
        stage: 'adult',
        ablation: false, 
        graft: 'none', 
        implant: 'none' 
      });
    } else {
      onChange({ ...config, [key]: value });
    }
  };

  const getGraftLabel = (g: GraftType) => {
    switch (g) {
      case 'none': return 'Aucune';
      case 'testis': return '+ Testicule';
      case 'ovary': return '+ Ovaire';
      default: return g;
    }
  };

  const isEmbryo = config.stage === 'embryo';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <Activity className="w-5 h-5 text-teal-600" />
        <h2 className="text-lg font-semibold text-slate-800">Configuration du Protocole</h2>
      </div>

      {/* 0. Development Stage */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Stade de Développement
        </label>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          {(['embryo', 'adult'] as DevelopmentStage[]).map((stage) => (
            <button
              key={stage}
              onClick={() => updateConfig('stage', stage)}
              className={`flex-1 py-2 text-sm rounded-md transition-all font-medium ${
                config.stage === stage
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {stage === 'embryo' ? 'Embryon (Indiff.)' : 'Adulte (Témoin)'}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Subject Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Dna className="w-4 h-4" />
          Génotype du Sujet
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => updateConfig('genotype', 'XX')}
            className={`flex-1 py-3 rounded-lg border-2 transition-all font-bold ${
              config.genotype === 'XX'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 hover:border-emerald-200 text-slate-500 hover:text-emerald-400'
            }`}
          >
            XX
          </button>
          <button
            onClick={() => updateConfig('genotype', 'XY')}
            className={`flex-1 py-3 rounded-lg border-2 transition-all font-bold ${
              config.genotype === 'XY'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-slate-200 hover:border-orange-200 text-slate-500 hover:text-orange-400'
            }`}
          >
            XY
          </button>
        </div>
      </div>

      {/* 2. Surgical Intervention */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Scissors className="w-4 h-4" />
          Intervention Chirurgicale
        </label>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => updateConfig('ablation', !config.ablation)}
            className={`w-full py-2 px-4 rounded-lg border transition-all text-left flex items-center justify-between ${
              config.ablation
                ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span>Castration (Retrait Gonades)</span>
            {config.ablation && <span className="text-xs bg-red-200 px-2 py-1 rounded">ACTIF</span>}
          </button>
        </div>
      </div>

      {/* 3. Grafts */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Greffe de Tissu
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['none', 'testis', 'ovary'] as GraftType[]).map((g) => (
            <button
              key={g}
              onClick={() => updateConfig('graft', g)}
              className={`py-2 px-2 text-sm rounded-lg border transition-all ${
                config.graft === g
                  ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              {getGraftLabel(g)}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Implants */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <Syringe className="w-4 h-4" />
          Implant Hormonal
        </label>
        <div className="grid grid-cols-1 gap-2">
           <select 
              value={config.implant} 
              onChange={(e) => updateConfig('implant', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none disabled:bg-slate-100"
           >
              <option value="none">Aucun</option>
              <option value="testosterone">Implant diffusant de Testostérone</option>
              <option value="amh">Implant diffusant d'AMH</option>
              <option value="both">Implant diffusant de Testostérone + AMH</option>
           </select>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 mt-auto">
        <button
          onClick={onRun}
          disabled={isRunDisabled}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-200 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isEmbryo ? <TestTube className="w-5 h-5" /> : <Microscope className="w-5 h-5" />}
          {isEmbryo ? "Lancer l'Expérience" : "Observer l'Adulte"}
        </button>
      </div>
    </div>
  );
};