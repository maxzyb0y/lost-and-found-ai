export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface FoundItem {
  id: number;
  uploader_id: number;
  uploader_username: string;
  image_url: string;
  object_name: string | null;
  category: string | null;
  color: string | null;
  brand: string | null;
  features: string[];
  confidence_score: number | null;
  location_found: string;
  notes: string | null;
  created_at: string;
}

export interface LostPost {
  id: number;
  owner_id: number;
  owner_username: string;
  item_name: string;
  category: string;
  color: string;
  location_lost: string;
  date_lost: string;
  description: string;
  image_url: string | null;
  brand: string | null;
  features: string[];
  created_at: string;
}

export interface LostPostList {
  items: LostPost[];
  total: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface FoundItemList {
  items: FoundItem[];
  total: number;
}

export interface ExtractedFilters {
  object: string | null;
  color: string | null;
  location: string | null;
  category: string | null;
}

export interface SearchResponse {
  extracted: ExtractedFilters;
  results: FoundItem[];
  total: number;
}

export const CATEGORIES = [
  "Electronics",
  "Bags",
  "Keys",
  "Bottles",
  "Stationery",
  "Clothing",
] as const;
