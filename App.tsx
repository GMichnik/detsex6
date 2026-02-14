import React, { useState, useEffect } from 'react';
import { LabControls } from './components/LabControls';
import { Schematic } from './components/Schematic';
import { History } from './components/History';
import { ExperimentComparison } from './components/ExperimentComparison';
import { SimulationConfig, ExperimentState, SimulationResult } from './types';
import { runSimulation } from './services/simulation';
import { APP_TITLE, GUIDE_STEPS, GLOSSARY } from './constants';
import { Microscope, Info, X, HelpCircle, BookOpen, MousePointerClick, Play, List } from 'lucide-react';

const STORAGE_KEY = 'biosim_history_v1';

const DEFAULT_CONFIG: SimulationConfig = {
  stage: 'embryo',
  genotype: 'XX',
  ablation: false,
  graft: 'none',
  implant: 'none',
};

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<ExperimentState[]>([]);
  
  // Modals State
  const [showInfo, setShowInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState<'guide' | 'glossary'>('guide');
  
  // Comparison State
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleRunSimulation = () => {
    const result = runSimulation(config);
    setCurrentResult(result);

    const newExperiment: ExperimentState = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...config,
      result,
    };

    setHistory((prev) => [...prev, newExperiment]);
  };

  const loadExperiment = (exp: ExperimentState) => {
    setConfig({
      stage: 'embryo', // Default to embryo when restoring for editing
      genotype: exp.genotype,
      ablation: exp.ablation,
      graft: exp.graft,
      implant: exp.implant,
    });
    setCurrentResult(exp.result);
  };

  const deleteExperiment = (id: string) => {
    setHistory((prev) => prev.filter((exp) => exp.id !== id));
    // Also remove from selection if deleted
    setSelectedHistoryIds((prev) => prev.filter((sid) => sid !== id));
  };

  const clearHistory = () => {
    if (confirm("Voulez-vous vraiment effacer tout l'historique ?")) {
      setHistory([]);
      setSelectedHistoryIds([]);
    }
  };

  const resetLab = () => {
    setConfig(DEFAULT_CONFIG);
    setCurrentResult(null);
  };

  // Selection Logic
  const handleToggleSelection = (id: string) => {
    setSelectedHistoryIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 2) {
          // If 2 already selected, remove the first one (FIFO) to allow the new one
          return [prev[1], id];
        }
        return [...prev, id];
      }
    });
  };

  const handleStartComparison = () => {
    if (selectedHistoryIds.length === 2) {
      setIsComparing(true);
    }
  };

  // Prepare comparison data
  const exp1 = history.find(h => h.id === selectedHistoryIds[0]);
  const exp2 = history.find(h => h.id === selectedHistoryIds[1]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* Comparison Modal */}
      {isComparing && exp1 && exp2 && (
        <ExperimentComparison 
          exp1={exp1} 
          exp2={exp2} 
          onClose={() => setIsComparing(false)} 
        />
      )}

      {/* Help & Glossary Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Aide & Glossaire</h2>
               </div>
               <button 
                 onClick={() => setShowHelp(false)}
                 className="text-slate-400 hover:text-slate-600 transition-colors"
               >
                  <X className="w-6 h-6" />
               </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setHelpTab('guide')}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${helpTab === 'guide' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <MousePointerClick className="w-4 h-4" /> Mode d'emploi
              </button>
              <button 
                onClick={() => setHelpTab('glossary')}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${helpTab === 'glossary' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <BookOpen className="w-4 h-4" /> Glossaire
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
               {helpTab === 'guide' ? (
                 <div className="space-y-6">
                    <div className="grid gap-4">
                      {GUIDE_STEPS.map((step, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex gap-4">
                          <div className="bg-teal-100 text-teal-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800">{step.title}</h3>
                            <p className="text-slate-600 text-sm mt-1">{step.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800">
                      <p><strong>Astuce :</strong> Le simulateur ne conserve pas les données si vous fermez le navigateur. Utilisez le bouton "Comparer" pour analyser deux résultats côte à côte.</p>
                    </div>
                 </div>
               ) : (
                 <div className="grid gap-4">
                   {GLOSSARY.map((item, idx) => (
                     <div key={idx} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                       <h3 className={`font-bold text-lg mb-1 ${item.color || 'text-slate-800'}`}>{item.term}</h3>
                       <p className="text-slate-600 text-sm leading-relaxed">{item.def}</p>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
               <button 
                 onClick={() => setShowHelp(false)}
                 className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold transition-colors"
               >
                  Fermer
               </button>
            </div>
          </div>
        </div>
      )}

      {/* About Info Modal (Existing) */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
                    <Info className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Crédits</h2>
               </div>
               <button 
                 onClick={() => setShowInfo(false)}
                 className="text-slate-400 hover:text-slate-600 transition-colors"
               >
                  <X className="w-6 h-6" />
               </button>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col items-center gap-6">
               <img 
                 src="https://nuage02.apps.education.fr/index.php/s/iWJnGZtoNjM7fp8/download" 
                 alt="DetSex Logo"
                 className="h-16 w-auto object-contain"
               />
               <p className="text-slate-600 font-medium text-lg">Détermination du phénotype sexuel</p>

               <div className="w-full space-y-3 mt-2">
                  <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3 text-slate-600">
                     <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0"></span>
                     <span className="text-sm"><span className="font-bold">Version 4.1 (Windows)</span> — Jean-Marc Moullet</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3 text-slate-600">
                     <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0"></span>
                     <span className="text-sm"><span className="font-bold">Version 5 (HTML5)</span> — DEBROCK Remi (19/04/2015)</span>
                  </div>
                  <div className="bg-teal-50 border border-teal-100 p-4 rounded-lg flex items-center gap-3 text-teal-800 shadow-sm">
                     <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0"></span>
                     <span className="text-sm"><span className="font-bold">Version 6</span> — Gregory Michnik (2026)</span>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
               <button 
                 onClick={() => setShowInfo(false)}
                 className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm shadow-teal-200"
               >
                  Fermer
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://nuage02.apps.education.fr/index.php/s/iWJnGZtoNjM7fp8/download" 
              alt="DetSex Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all font-medium text-sm border border-transparent hover:border-teal-100"
              title="Aide & Glossaire"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Aide</span>
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <button 
              onClick={() => setShowInfo(true)}
              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
              title="Crédits"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Controls & History */}
          <div className="lg:col-span-4 space-y-6">
            <LabControls 
              config={config} 
              onChange={setConfig} 
              onRun={handleRunSimulation} 
              isRunDisabled={false}
            />
            
            <div className="hidden lg:block lg:h-[calc(100vh-400px)] min-h-[400px]">
              <History 
                history={history} 
                onLoad={loadExperiment} 
                onDelete={deleteExperiment}
                onClear={clearHistory}
                selectedIds={selectedHistoryIds}
                onToggleSelection={handleToggleSelection}
                onCompare={handleStartComparison}
              />
            </div>
          </div>

          {/* RIGHT: Visualization Bench */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Visualizer Container */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-teal-600" />
                  Fenêtre d'Observation
                </h2>
                {currentResult && (
                  <button 
                    onClick={resetLab}
                    className="text-xs font-medium text-slate-500 hover:text-teal-600 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="p-8 min-h-[500px] flex flex-col md:flex-row gap-8 items-center justify-center bg-slate-50/30">
                
                {/* Before View */}
                <div className="flex-1 flex flex-col items-center gap-4 w-full">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {config.stage === 'embryo' ? 'Stade Indifférencié' : 'Stade Adulte'}
                  </span>
                  <div className="w-full aspect-[2/3] max-w-[240px] bg-white rounded-xl shadow-sm border border-slate-200 p-2">
                    <Schematic 
                      result={config.stage === 'adult' ? runSimulation(config) : null} 
                      stage={config.stage === 'adult' ? 'final' : 'initial'} 
                      genotype={config.genotype} 
                    />
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-slate-300">
                  <svg className="w-8 h-8 md:w-12 md:h-12 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                {/* Result View */}
                <div className="flex-1 flex flex-col items-center gap-4 w-full">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                     {config.stage === 'embryo' ? 'Résultat à la Naissance' : 'Observation'}
                  </span>
                  <div className={`w-full aspect-[2/3] max-w-[240px] bg-white rounded-xl shadow-md border-2 p-2 relative transition-all duration-500 ${currentResult ? 'border-teal-100 shadow-teal-100 ring-4 ring-teal-50' : 'border-dashed border-slate-200 opacity-50'}`}>
                    {currentResult ? (
                       <Schematic result={currentResult} stage="final" genotype={config.genotype} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm font-medium">
                        {config.stage === 'embryo' ? 'En attente...' : 'Cliquez sur Observer'}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Mobile History */}
            <div className="lg:hidden">
              <History 
                history={history} 
                onLoad={loadExperiment} 
                onDelete={deleteExperiment}
                onClear={clearHistory}
                selectedIds={selectedHistoryIds}
                onToggleSelection={handleToggleSelection}
                onCompare={handleStartComparison}
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;