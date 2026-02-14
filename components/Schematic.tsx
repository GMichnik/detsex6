import React from 'react';
import { SimulationResult, Genotype } from '../types';
import { COLORS } from '../constants';

interface SchematicProps {
  result: SimulationResult | null;
  stage: 'initial' | 'final';
  genotype: Genotype;
}

export const Schematic: React.FC<SchematicProps> = ({ result, stage, genotype }) => {
  const isInitial = stage === 'initial';
  
  // Default states for initial view
  const showWolffian = isInitial || result?.wolffian === 'persists';
  const showMullerian = isInitial || result?.mullerian === 'persists';
  
  // Gonad Visualization Logic
  const gonadColor = isInitial ? '#cbd5e1' : COLORS.gonad; // Grey initially, Yellow finally
  const gonadShape = isInitial 
    ? 'neutral' 
    : (result?.gonads === 'testes' ? 'testis' : result?.gonads === 'ovaries' ? 'ovary' : result?.gonads === 'mixed' ? 'mixed' : 'none');

  // Helper to draw dotted lines for regressed ducts
  const wolffianOpacity = showWolffian ? 1 : 0.1;
  const mullerianOpacity = showMullerian ? 1 : 0.1;
  const wolffianDash = showWolffian ? "0" : "4 4";
  const mullerianDash = showMullerian ? "0" : "4 4";

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 bg-white rounded-xl shadow-inner border border-slate-100">
      <svg viewBox="0 0 200 300" className="w-full h-full max-w-[300px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- ANATOMY BASE --- */}
        
        {/* Kidneys (Reference) */}
        <ellipse cx="60" cy="50" rx="15" ry="20" fill={COLORS.kidney} opacity="0.5" />
        <ellipse cx="140" cy="50" rx="15" ry="20" fill={COLORS.kidney} opacity="0.5" />

        {/* Urogenital Sinus (Base) */}
        <path d="M 80 250 Q 100 280 120 250 L 120 220 L 80 220 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        <text x="100" y="275" fontSize="8" textAnchor="middle" fill="#64748b">Sinus</text>

        {/* --- DUCTS --- */}

        {/* Müllerian Ducts (Lateral - Pink) */}
        {/* Left */}
        <path 
          d="M 45 60 Q 30 100 40 150 T 85 220" 
          fill="none" 
          stroke={COLORS.mullerian} 
          strokeWidth={showMullerian ? "4" : "2"}
          strokeDasharray={mullerianDash}
          opacity={showMullerian ? 1 : 0.2}
        />
        {/* Funnel */}
        <path d="M 45 60 L 35 50 L 55 50 Z" fill={showMullerian ? COLORS.mullerian : "none"} stroke={COLORS.mullerian} opacity={showMullerian ? 1 : 0.2} />

        {/* Right */}
        <path 
          d="M 155 60 Q 170 100 160 150 T 115 220" 
          fill="none" 
          stroke={COLORS.mullerian} 
          strokeWidth={showMullerian ? "4" : "2"}
          strokeDasharray={mullerianDash}
          opacity={showMullerian ? 1 : 0.2}
        />
        {/* Funnel */}
        <path d="M 155 60 L 145 50 L 165 50 Z" fill={showMullerian ? COLORS.mullerian : "none"} stroke={COLORS.mullerian} opacity={showMullerian ? 1 : 0.2} />


        {/* Wolffian Ducts (Medial - Blue) */}
        {/* Left */}
        <path 
          d="M 60 70 L 60 150 L 85 220" 
          fill="none" 
          stroke={COLORS.wolffian} 
          strokeWidth={showWolffian ? "4" : "2"} 
          strokeDasharray={wolffianDash}
          opacity={showWolffian ? 1 : 0.2}
        />
        {/* Right */}
        <path 
          d="M 140 70 L 140 150 L 115 220" 
          fill="none" 
          stroke={COLORS.wolffian} 
          strokeWidth={showWolffian ? "4" : "2"} 
          strokeDasharray={wolffianDash}
          opacity={showWolffian ? 1 : 0.2}
        />

        {/* --- GONADS --- */}
        {/* Left Gonad */}
        {gonadShape !== 'none' && (
          <g transform="translate(60, 80)">
             {/* If neutral or testis, draw somewhat round */}
             {(gonadShape === 'neutral' || gonadShape === 'testis' || gonadShape === 'mixed') && (
                <circle cx="0" cy="0" r="12" fill={gonadColor} stroke="#b45309" strokeWidth="1" />
             )}
             {/* If ovary or mixed, draw oval */}
             {(gonadShape === 'ovary') && (
                <ellipse cx="0" cy="0" rx="10" ry="14" fill={gonadColor} stroke="#b45309" strokeWidth="1" />
             )}
             <text x="-20" y="-15" fontSize="10" fill="#475569">
                {isInitial ? 'Indiff.' : gonadShape === 'mixed' ? 'Mixte' : gonadShape === 'testis' ? 'Testicule' : gonadShape === 'ovary' ? 'Ovaire' : ''}
             </text>
          </g>
        )}

        {/* Right Gonad */}
        {gonadShape !== 'none' && (
          <g transform="translate(140, 80)">
             {(gonadShape === 'neutral' || gonadShape === 'testis' || gonadShape === 'mixed') && (
                <circle cx="0" cy="0" r="12" fill={gonadColor} stroke="#b45309" strokeWidth="1" />
             )}
             {(gonadShape === 'ovary') && (
                <ellipse cx="0" cy="0" rx="10" ry="14" fill={gonadColor} stroke="#b45309" strokeWidth="1" />
             )}
          </g>
        )}

        {/* Legend/Labels within SVG */}
        <text x="10" y="20" fontSize="10" fill={COLORS.wolffian} fontWeight="bold">Wolff (M)</text>
        <text x="10" y="35" fontSize="10" fill={COLORS.mullerian} fontWeight="bold">Müller (F)</text>

      </svg>
      
      {/* Overlay Status */}
      <div className="absolute bottom-2 left-2 text-xs font-mono text-slate-400">
        Stade : {isInitial ? "Indifférencié" : "Différencié"}
      </div>
    </div>
  );
};