import Image from "next/image";
import React from "react";

export default function ApiImage({ src, width, height, alt, className }) {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
    ></Image>
  );
}
