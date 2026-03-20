import axios from "axios";
import type { Entry, EntryListResponse } from "../types/entry";

const client = axios.create({
  baseURL: "/api",
});

export async function fetchEntries(
  page: number = 1,
  perPage: number = 12,
): Promise<EntryListResponse> {
  const response = await client.get<EntryListResponse>("/entries", {
    params: { page, per_page: perPage },
  });
  return response.data;
}

export async function fetchEntry(id: string): Promise<Entry> {
  const response = await client.get<Entry>(`/entries/${id}`);
  return response.data;
}

export async function createEntry(
  file: File,
  latitude?: number,
  longitude?: number,
): Promise<Entry> {
  const formData = new FormData();
  formData.append("file", file);
  if (latitude !== undefined && longitude !== undefined) {
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
  }
  const response = await client.post<Entry>("/entries", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteEntry(id: string): Promise<void> {
  await client.delete(`/entries/${id}`);
}
