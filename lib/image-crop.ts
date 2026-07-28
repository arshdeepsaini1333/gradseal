// Client-side canvas cropping — takes the data URL shown in the crop modal
// plus the pixel crop rect react-easy-crop reports, and rasterizes it down
// to a fixed-size square JPEG ready to upload.

export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Could not load image")));
    image.src = url;
  });
}

export async function getCroppedImageBlob(
  imageSrc: string,
  crop: CroppedAreaPixels,
  outputSize = 512
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not generate cropped image"))),
      "image/jpeg",
      0.92
    );
  });
}
