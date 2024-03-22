import { Media } from "../Media";

export interface Announcement {
  id: number;
  title: string;
  body: string;
  date: string;
  created_at: string;
  updated_at: string;
  first_gallery_media?: Media;
}
