export interface WallpaperType {
  imageuri: string;
  title: string;
  id: string;
  color?: string;
  blur_hash?: string;
}

export interface MonsterAPIStatusResponse {
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED" | "IN_QUEUE";
  result?: {
    output: string[];
  };
  process_id?: string;
}
