export interface SubCategory {
    updated_by: string;
    created_by: string;
    _id: string;
    id?: string;
    name?: string;
    designation?: string;
    designation_fr?: string;
    slug: string;
    categorie_id?: string;
    category?: string | {
      id: string;
      _id: string;
      name?: string;
      designation?: string;
      designation_fr?: string;
      slug?: string;
    };
    products?: string[];
    cover?: string;
    alt_cover?: string;
    description_cove?: string;
    meta?: string;
    content_seo?: string;
    description_fr?: string;
    review?: string;
    aggregateRating?: string;
    nutrition_values?: string;
    questions?: string;
    more_details?: string;
    zone1?: string;
    zone2?: string;
    zone3?: string;
    zone4?: string;
    createdAt?: string;
    updatedAt?: string;
  }