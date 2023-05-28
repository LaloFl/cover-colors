import Image from "next/image";

import { getTopAlbumsByColor } from "@/utils/lastfm";
import ApiImage from "@/components/ApiImage";

export default async function Home() {
  const imagesColor = await getTopAlbumsByColor("lalofl", "overall", 100);

  return (
    <div className="flex flex-wrap w-full bg-black p-8 h-auto gap-4">
      {imagesColor.map((img, index) => {
        const rgbaString = `rgba(${img.color.r}, ${img.color.g}, ${img.color.b}, ${img.color.a})`;
        return (
          <div
            key={index}
            className="flex-initial w-30"
            style={{ boxShadow: `0 0 12px 8px ${rgbaString}` }}
          >
            <ApiImage
              src={img.imgUrl}
              width={64}
              height={64}
              alt="album cover"
            />
          </div>
        );
      })}
    </div>
  );
}
