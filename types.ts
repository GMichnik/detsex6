export type Genotype = 'XX' | 'XY';
export type GraftType = 'none' | 'testis' | 'ovary';
export type ImplantType = 'none' | 'testosterone' | 'amh' | 'both';
export type DevelopmentStage = 'embryo' | 'adult';

export interface ExperimentState {
  id: string;
  timestamp: number;
  genotype: Genotype;
  ablation: boolean; // Removal of original gonads
  graft: GraftType;
  implant: ImplantType;
  result: SimulationResult;
}

export interface SimulationResult {
  wolffian: 'persists' | 'regresses';
  mullerian: 'persists' | 'regresses';
  gonads: 'testes' | 'ovaries' | 'none' | 'mixed';
  phenotype: 'male' | 'female' | 'mixed';
  description: string;
}

export interface SimulationConfig {
  stage: DevelopmentStage;
  genotype: Genotype;
  ablation: boolean;
  graft: GraftType;
  implant: ImplantType;
}