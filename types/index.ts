export type LocationType = 'city' | 'airport' | 'attraction' | 'nearby';

export type PickupProduct = {
  gid: string;
  title: string;
  partner: string;
  status: 'onsale' | 'ready';
};

export type City = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  emoji: string;
  description: string;
  type: LocationType;
  parentCityId?: string;
  pickupProducts?: PickupProduct[];
};

export type TravelStyle = 'sightseeing' | 'food' | 'package' | 'activity';

export type PlannerState = {
  step: 1 | 2 | 3 | 4;
  selectedCities: string[];
  nights: Record<string, number>;
  style: TravelStyle | null;
};

export type ProductCategory = 'pickup' | 'tour' | 'activity' | 'package' | 'food';

export type Product = {
  id: string;
  cityId: string;
  category: ProductCategory;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  mrtUrl: string;
};
