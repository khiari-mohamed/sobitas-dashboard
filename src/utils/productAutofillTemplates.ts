	// src/utils/productAutofillTemplates.ts

export type ProductAutofillTemplate = {
  match: (input: string) => boolean;
  fields: Partial<Record<string, string | number | boolean>>;
};

export const productAutofillTemplates: ProductAutofillTemplate[] = [
  {
    match: (input) => input.includes("citruargin"),
    fields: {
      designation_fr: "CitruArgin - 300 G",
      codeProduct: "CITRU-ARG300",
      description_fr: "<p>CitruArgin est un complément alimentaire conçu pour améliorer les performances sportives...</p>",
      meta_description_fr: "CitruArgin - Complément pour performance musculaire, oxygénation et récupération.",
      nutrition_values: "<ul><li>Arginine : 5g</li><li>Citrulline : 2.5g</li></ul>",
      questions: "<ul><li>Quand prendre CitruArgin ?</li><li>Quels sont les effets secondaires ?</li></ul>",
      schema_description: "<pre>{ \"@context\": \"https://schema.org\", \"@type\": \"Product\", ... }</pre>",
      review: "<p>Excellent produit pour la récupération !</p>",
      promo: 119,
      prix: 140,
      qte: 50,
      prixHt: 130,
      promoHt: 110,
      alt_cover: "CitruArgin prix pas cher en Tunisie",
      description_cover: "CitruArgin - booster de performance",
      meta: "title; CitruArgin prix Tunisie|description; CitruArgin complément nutritionnel pour la performance",
      zone1: "Description",
      zone2: "Avis client",
      zone3: "Valeurs nutritionnelles",
      zone4: "Questions",
      pack: "300g",
      newProduct: "true",
      bestSeller: "true",
      publier: "true",
    },
  },
  // Add more intelligent templates like for "whey", "creatine", etc.
  {
    match: () => true, // default fallback
    fields: {
      designation_fr: "Produit générique",
      codeProduct: "GEN-0001",
      description_fr: "Description générique du produit.",
      meta_description_fr: "Meta description générique.",
      nutrition_values: "Valeurs nutritionnelles génériques.",
      questions: "Questions génériques sur le produit.",
      schema_description: "<pre>{ \"@context\": \"https://schema.org\", \"@type\": \"Product\", ... }</pre>",
      review: "<p>Avis générique sur le produit.</p>",
      prix: 100,
      promo: 90,
      qte: 10,
      prixHt: 95,
      promoHt: 85,
      alt_cover: "Image produit générique",
      description_cover: "Image de couverture produit",
      meta: "title; Produit générique|description; Description générique pour référencement",
      zone1: "Description",
      zone2: "Avis",
      zone3: "Valeurs nutritionnelles",
      zone4: "Questions",
      pack: "Standard",
      newProduct: "false",
      bestSeller: "false",
      publier: "false",
    },
  },
];

export function getAutofillTemplate(input: string) {
  const normalized = input.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return productAutofillTemplates.find(t => t.match(normalized));
}

