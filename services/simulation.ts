import { SimulationConfig, SimulationResult } from '../types';

/**
 * Calculates the biological outcome based on inputs.
 * Based on classic Jost experiments principles:
 * 1. Testes -> Produce Testosterone (T) + Anti-Müllerian Hormone (AMH).
 * 2. T -> Maintains Wolffian ducts.
 * 3. AMH -> Regresses Müllerian ducts.
 * 4. Absence of T -> Wolffian ducts regress.
 * 5. Absence of AMH -> Müllerian ducts persist (Default program).
 */
export const runSimulation = (config: SimulationConfig): SimulationResult => {
  const { genotype, ablation, graft, implant, stage } = config;

  // 1. Determine Hormone Sources (Valid for both stages regarding physical presence)
  
  // Endogenous source (Original gonads)
  const hasOriginalTestes = genotype === 'XY' && !ablation;
  const hasOriginalOvaries = genotype === 'XX' && !ablation;

  // Exogenous source (Grafts)
  const hasGraftTestis = graft === 'testis';
  
  // 2. Determine Hormone Levels
  // 'both' implies both T and AMH are provided by the implant
  const hasTestosterone = hasOriginalTestes || hasGraftTestis || implant === 'testosterone' || implant === 'both';
  const hasAMH = hasOriginalTestes || hasGraftTestis || implant === 'amh' || implant === 'both';

  // 3. Determine Final Gonad Status for Visualization
  // This physically represents what is in the body, regardless of stage.
  let gonads: SimulationResult['gonads'] = 'none';
  if (hasOriginalTestes && hasGraftTestis) gonads = 'testes'; 
  else if (hasOriginalTestes) gonads = 'testes';
  else if (hasOriginalOvaries && hasGraftTestis) gonads = 'mixed'; 
  else if (hasOriginalOvaries) gonads = 'ovaries';
  else if (hasGraftTestis) gonads = 'testes'; 
  else if (graft === 'ovary') gonads = 'ovaries'; 

  // --- ADULT STAGE LOGIC (Post-Critical Period) ---
  if (stage === 'adult') {
    // Differentiation is already complete. It depends ONLY on the Genotype (assuming normal development).
    // Interventions on adults do not change the formed ducts.
    
    const wolffian = genotype === 'XY' ? 'persists' : 'regresses';
    const mullerian = genotype === 'XX' ? 'persists' : 'regresses';
    
    // Phenotype matches the ducts
    const phenotype = genotype === 'XY' ? 'male' : 'female';

    // Description explains the lack of change
    let description = `Stade Adulte (${genotype}) : `;
    
    const hasIntervention = ablation || graft !== 'none' || implant !== 'none';

    if (hasIntervention) {
      description += "Les voies génitales sont déjà différenciées (Période critique dépassée). ";
      if (ablation) description += "La castration retire les gonades mais ne fait pas régresser les canaux formés. ";
      if (graft !== 'none' || implant !== 'none') description += "L'ajout d'hormones n'a plus d'effet morphologique sur l'organisation des canaux.";
    } else {
      description += genotype === 'XY' 
        ? "Organisation masculine typique (Canaux de Wolff maintenus, Müller régressés)."
        : "Organisation féminine typique (Canaux de Müller maintenus, Wolff régressés).";
    }

    return {
      wolffian,
      mullerian,
      gonads,
      phenotype,
      description
    };
  }

  // --- EMBRYO STAGE LOGIC (Differentiation Active) ---

  // 4. Determine Duct Fate based on Hormones
  const wolffian = hasTestosterone ? 'persists' : 'regresses';
  const mullerian = hasAMH ? 'regresses' : 'persists';
  
  // 5. Determine Phenotype Label
  let phenotype: SimulationResult['phenotype'] = 'female';
  if (wolffian === 'persists' && mullerian === 'regresses') {
    phenotype = 'male';
  } else if (wolffian === 'persists' && mullerian === 'persists') {
    phenotype = 'mixed'; // Double set of ducts
  } else if (wolffian === 'regresses' && mullerian === 'regresses') {
    phenotype = 'female'; // External genitalia would be female without T, but internally "empty"
  }

  // 6. Generate Description
  let description = "";
  if (genotype === 'XX' && !ablation && graft === 'none' && implant === 'none') {
    description = "Témoin Femelle (XX) : Les ovaires se développent. L'absence de Testostérone (T) entraîne la régression des canaux de Wolff. L'absence d'AMH permet la persistance des canaux de Müller.";
  } else if (genotype === 'XY' && !ablation && graft === 'none' && implant === 'none') {
    description = "Témoin Mâle (XY) : Les testicules se développent. La T maintient les canaux de Wolff. L'AMH provoque la régression des canaux de Müller.";
  } else if (ablation && graft === 'none' && implant === 'none') {
    description = "Castration (Gonadectomie) : Le retrait des gonades supprime les sources hormonales. Le phénotype féminin par défaut se développe (persistance des canaux de Müller).";
  } else if (genotype === 'XX' && graft === 'testis') {
    description = "XX + Greffe de Testicule : Le greffon sécrète T et AMH. Les canaux de Wolff sont maintenus, Müller régresse. Une masculinisation du tractus se produit.";
  } else if (genotype === 'XX' && implant === 'testosterone') {
    description = "XX + Testostérone : La T maintient les canaux de Wolff. L'absence de tissu testiculaire (donc d'AMH) signifie que les canaux de Müller persistent AUSSI. Résultat : double tractus.";
  } else if (genotype === 'XX' && implant === 'amh') {
    description = "XX + AMH : L'absence de T entraîne la régression des canaux de Wolff. L'implant d'AMH provoque la régression des canaux de Müller. Il ne reste aucun des deux canaux (Canaux 'vides').";
  } else if ((genotype === 'XX' || ablation) && implant === 'both') {
    description = "Implant T + AMH : La combinaison des deux hormones mime parfaitement l'action endocrine du testicule. La T maintient Wolff et l'AMH fait régresser Müller, conduisant à une différenciation masculine des voies génitales.";
  } else {
    // Generic generator
    const wText = wolffian === 'persists' ? "Canaux de Wolff maintenus (T présente)." : "Régression des canaux de Wolff (Pas de T).";
    const mText = mullerian === 'persists' ? "Canaux de Müller persistants (Pas d'AMH)." : "Régression des canaux de Müller (AMH présente).";
    description = `${wText} ${mText}`;
  }

  return {
    wolffian,
    mullerian,
    gonads,
    phenotype,
    description
  };
};