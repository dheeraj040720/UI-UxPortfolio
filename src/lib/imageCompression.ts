import { supabase } from './supabase';

const BUCKET = 'portfolio-assets';

/**
 * Resizes an image to maxWidth (preserving aspect ratio) and encodes as WebP
 * to keep storage small and public page loads fast.
 */
export async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Image compression failed'))),
      'image/webp',
      quality
    );
  });
}

/**
 * Compresses and uploads an image to Supabase Storage, returning its public URL.
 */
export async function uploadProjectImage(file: File, folder: string): Promise<string> {
  const compressed = await compressImage(file);
  const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
  const filePath = `${folder}/${Date.now()}-${safeName}.webp`;

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, compressed, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
