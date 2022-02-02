export interface SearchApiResult {
  cards: Card[];
  page: Page;
  aggregation: Aggregation;
  taxonomies: any[];
  querySuggestions: any[];
}

export interface Aggregation {
  properties: Brand[];
  brands: Brand[];
  taxonomies: AggregationTaxonomy[];
  prices: PriceElement[];
}

export interface Brand {
  name?: string;
  count: number;
  id: string;
  label: string;
  attributes?: Attributes;
}

export interface Attributes {
  icon: string;
}

export interface PriceElement {
  count: number;
  min: number;
  max: number;
  label: string;
}

export interface AggregationTaxonomy {
  count: number;
  id: number;
  shown: boolean;
  level: number;
  parentIds: number[];
  rank: number;
  relevant: boolean;
  label: string;
}

export interface Card {
  type: Type;
  id: number;
  products: Product[];
}

export interface Product {
  id: number;
  control: Control;
  title: string;
  link: string;
  availableOnline: boolean;
  orderable: boolean;
  propertyIcons: PropertyIcon[];
  images: ProductImage[];
  price: ProductPrice;
  itemCatalogId: number;
  brand: string;
  category: string;
  theme: Theme;
  hqId: number;
  gtins: number[];
  summary: string;
  descriptionFull: string;
  taxonomyId: number;
  taxonomies: ProductTaxonomy[];
  contributionMargin?: number;
  properties: Properties;
  smartLabel?: Shield;
  shield?: Shield;
  discount?: Discount;
  availabilityLabel?: Label;
  interactionLabel?: Label;
}

export interface Label {
  text: string;
}

export interface Control {
  theme: Theme;
  type: Type;
}

export enum Theme {
  Ah = "ah",
  Bonus = "bonus",
}

export enum Type {
  Default = "default",
}

export interface Discount {
  bonusType: string;
  segmentType: string;
  theme: Theme;
  startDate: Date;
  endDate: Date;
  subtitle?: string;
  tieredOffer: any[];
}

export interface ProductImage {
  height: number;
  width: number;
  title: string;
  url: string;
  ratio: Ratio;
}

export enum Ratio {
  The11 = "1-1",
}

export interface ProductPrice {
  now: number;
  unitSize: string;
  unitInfo?: UnitInfo;
  theme?: Theme;
  was?: number;
}

export interface UnitInfo {
  price: number;
  description: Description;
}

export enum Description {
  Kg = "KG",
  Lt = "LT",
}

export interface Properties {
  lifestyle: string[];
}

export interface PropertyIcon {
  name: string;
  title: string;
}

export interface Shield {
  theme: Theme;
  text: string;
}

export interface ProductTaxonomy {
  id: number;
  name: string;
  imageSiteTarget?: string;
  images: TaxonomyImage[];
  shown: boolean;
  level: number;
  sortSequence: number;
  parentIds: number[];
}

export interface TaxonomyImage {
  height: number;
  width: number;
  url: string;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
