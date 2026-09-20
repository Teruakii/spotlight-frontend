import { ImageOff } from "lucide-react";

function Frame({ src, alt, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-zinc-100 ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}

export default function ImageGallery({ images = [], alt }) {
  if (!images.length) {
    return (
      <div className="mb-6 flex h-72 items-center justify-center rounded-xl bg-zinc-100 text-zinc-300">
        <ImageOff className="h-10 w-10" />
      </div>
    );
  }

  if (images.length === 1) {
    return <Frame src={images[0].imageUrl} alt={alt} className="mb-6 h-72" />;
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-5">
      <Frame src={images[0].imageUrl} alt={alt} className="h-72 md:col-span-3" />
      <div className="grid h-72 grid-rows-2 gap-3 md:col-span-2">
        {images.slice(1, 3).map((img) => (
          <Frame key={img.id} src={img.imageUrl} alt={alt} className="min-h-0" />
        ))}
      </div>
    </div>
  );
}
