export type Difficulty = "easy" | "medium" | "hard";

export interface Coordinates {
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export interface RatingSource {
  rating: number;
  reviews: number;
}

export interface TrailRoute {
  name: string;
  distance_miles: number;
  difficulty: Difficulty;
  elevation_gain_ft: number;
  type: string;
  description: string;
}

export interface Trail {
  id: string;
  name: string;
  town: string;
  county?: string;
  state: string;
  coordinates: Coordinates;
  length_miles: number;
  elevation_gain_ft: number;
  highest_elevation_ft?: number;
  difficulty: Difficulty;
  elevation_difficulty?: string;
  route_type?: string;
  description: string;
  features?: string[];
  best_season?: string;
  ratings: {
    google?: RatingSource;
    alltrails?: RatingSource;
  };
  routes: TrailRoute[];
  combined_rating?: number;
}

export type HousingType = "lodge" | "cabin" | "campground" | "hotel";

export interface Housing {
  id: string;
  name: string;
  type: HousingType;
  town: string;
  county?: string;
  state: string;
  coordinates: Coordinates;
  price_per_night: number;
  rating: number;
  reviews?: number;
  amenities: string[];
  nearby_trail_ids: string[];
  description: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  saved_trails: string[];
  saved_housing: string[];
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
