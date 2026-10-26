export interface SubcategoryComparisonRow {
  dimension: string;
  commonMistake: string;
  technicalMechanism: string;
  impactMagnitude: string;
  recommendedStrategy: string;
}

export interface SubcategoryFaq {
  question: string;
  answer: string;
}

export interface SubcategoryFirstPrinciple {
  title: string;
  content: string;
}

export interface SubcategoryData {
  catSlug: string;
  subSlug: string;
  title: string;
  tagline: string;
  firstPrinciples: SubcategoryFirstPrinciple[];
  topologyTitle: string;
  topologyAscii: string;
  topologyExplanation: string;
  clusterDetails: Record<string, {
    scenarioPainPoint: string;
    engineeringSolution: string;
    takeaway: string;
  }>;
  comparisonTable: SubcategoryComparisonRow[];
  auditChecklist: string[];
  faqs: SubcategoryFaq[];
  targetPath: string;
  campaign: string;
  ctaTitle: string;
  ctaText: string;
}
