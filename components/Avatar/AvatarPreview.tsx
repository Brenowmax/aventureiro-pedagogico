"use client";

import Image from "next/image";

type AvatarPreviewProps = {
  bodySrc?: string;
  headSrc?: string;
  outfitSrc?: string;
  buddySrc?: string;
  className?: string;
};

export default function AvatarPreview({
  bodySrc = "/avatar/body1.png",
  headSrc,
  outfitSrc,
  buddySrc,
  className = "",
}: AvatarPreviewProps) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
    >
      {/* CORPO BASE */}
      <div className="absolute inset-0 z-10">
        <Image
          src={bodySrc}
          alt="Personagem do aventureiro"
          fill
          priority
          className="object-contain"
          sizes="(max-width: 640px) 70vw, 320px"
        />
      </div>

      {/* HEAD */}
      {headSrc && (
        <div className="absolute inset-0 z-20">
          <Image
            src={headSrc}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 70vw, 320px"
          />
        </div>
      )}

      {/* SKIN */}
      {outfitSrc && (
        <div className="absolute inset-0 z-30">
          <Image
            src={outfitSrc}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 70vw, 320px"
          />
        </div>
      )}

{/* BUDDY */}
{buddySrc && (
  <div className="absolute inset-0 z-40">
    <div className="absolute bottom-[-2%] right-[-6%] h-[58%] w-[58%]">
      <Image
        src={buddySrc}
        alt="Companheiro do aventureiro"
        fill
        className="object-contain"
        sizes="200px"
      />
    </div>
  </div>
)}
    </div>
  );
}