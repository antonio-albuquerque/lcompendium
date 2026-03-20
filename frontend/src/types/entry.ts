export interface Entry {
  id: string;
  species_name: string;
  description: string;
  photo_url: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface EntryListResponse {
  entries: Entry[];
  total: number;
  page: number;
  per_page: number;
}
