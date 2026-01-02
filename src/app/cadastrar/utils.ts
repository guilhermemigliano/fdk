export function applyMask(value: string, mask: string) {
  let i = 0;
  return mask.replace(/9/g, () => value[i++] ?? '');
}

export async function compressImage(
  file: File,
  maxSizeMB = 1,
  maxWidth = 800,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(maxWidth / img.width, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.8;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        while (
          (base64.length * 3) / 4 / 1024 / 1024 > maxSizeMB &&
          quality > 0.4
        ) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(base64);
      };
    };

    reader.onerror = reject;
  });
}
