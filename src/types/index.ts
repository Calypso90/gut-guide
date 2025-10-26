/**
 * Shared TypeScript interfaces used across the app.
 */

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface Review {
  id: string;
  authorId?: string;
  rating: number; // 1-5
  text?: string;
  createdAt: string; // ISO date
}

export interface Location {
  id: string; // internal id (can be place_id)
  placeId?: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  types?: string[];
  rating?: number;
  userRatingsTotal?: number;
  phone?: string;
  website?: string;
  openingHours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  vicinity?: string;
  // Distance from a reference point in meters (client-calculated)
  distanceMeters?: number;
}

export type PlaceApiResult = any; // we accept raw results from Google and normalize them
