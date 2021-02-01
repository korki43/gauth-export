export function readImageFromFile(file: File): Promise<ImageData> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.addEventListener('load', () => {
      const c = document.createElement('canvas');
      c.height = img.height;
      c.width = img.width;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    });
  });
}
