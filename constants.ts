export const APP_TITLE = "DETSEX 6";
export const APP_SUBTITLE = "Simulateur d'expériences sur la différenciation sexuelle";

export const DESCRIPTIONS = {
  intro: "Explorez le contrôle hormonal de la différenciation sexuelle chez les mammifères. Modifiez les conditions embryonnaires pour observer le développement de l'appareil reproducteur.",
  controls: "Configurez les paramètres de l'expérience ci-dessous.",
};

export const COLORS = {
  wolffian: "#f97316", // Orange-500 (Neutral, distinct from UI Teal)
  mullerian: "#10b981", // Emerald-500 (Neutral, matches logo green tones)
  gonad: "#eab308", // Yellow-500
  kidney: "#94a3b8", // Slate-400
};

export const GUIDE_STEPS = [
  {
    title: "Configurer",
    text: "Choisissez le sexe génétique (XX/XY) et le stade de développement.",
  },
  {
    title: "Expérimenter",
    text: "Appliquez des modifications : castration, greffes ou implants hormonaux.",
  },
  {
    title: "Observer",
    text: "Lancez la simulation pour voir le devenir des canaux de Wolff et Müller.",
  },
  {
    title: "Comparer",
    text: "Sélectionnez deux expériences dans l'historique pour analyser les différences.",
  }
];

export const GLOSSARY = [
  {
    term: "Canaux de Wolff",
    def: "Structures embryonnaires qui se différencient en voies génitales mâles (épididyme, canal déférent) sous l'action de la Testostérone. Ils régressent en son absence.",
    color: "text-orange-600"
  },
  {
    term: "Canaux de Müller",
    def: "Structures embryonnaires qui se différencient en voies génitales femelles (oviducte, utérus) par défaut. Ils régressent en présence d'AMH.",
    color: "text-emerald-600"
  },
  {
    term: "Gonades indifférenciées",
    def: "Organes reproducteurs primaires présents chez l'embryon, capables de devenir soit des testicules, soit des ovaires selon le patrimoine génétique.",
    color: "text-yellow-600"
  },
  {
    term: "Testostérone",
    def: "Hormone sexuelle produite par les cellules de Leydig du testicule. Elle stimule le maintien et le développement des canaux de Wolff.",
    color: "text-blue-600"
  },
  {
    term: "AMH (Hormone Anti-Müllérienne)",
    def: "Hormone glycoprotéique produite par les cellules de Sertoli du testicule. Elle provoque la disparition des canaux de Müller.",
    color: "text-slate-600"
  },
  {
    term: "Castration",
    def: "Ablation chirurgicale des gonades (testicules ou ovaires), supprimant ainsi la source principale d'hormones sexuelles endogènes.",
    color: "text-red-600"
  }
];