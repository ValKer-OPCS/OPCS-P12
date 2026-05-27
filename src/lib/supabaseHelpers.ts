import { supabase } from "@/lib/supabase";

const BUCKET = "portfolio";

export const uploadFile = async (path: string, buffer: Buffer) => {
  return supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: "image/webp",
      upsert: false,
    });
};

export const getUrl = (path: string) => {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
};

export const removeFiles = async (paths: string[]) => {
  return supabase.storage.from(BUCKET).remove(paths);
};