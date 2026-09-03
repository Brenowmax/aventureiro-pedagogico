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
      {/* =====================================================
          CORPO BASE
      ===================================================== */}
      <div className="absolute inset-0">
        <Image
          src={bodySrc}
          alt="Personagem do aventureiro"
          fill
          priority
          className="object-contain"
          sizes="(max-width: 640px) 70vw, 320px"
        />
      </div>

      {/* =====================================================
          CABEÇA
          Futuramente:
          cabelos, gorros, capacetes, capuzes etc.
      ===================================================== */}
      {headSrc && (
        <div className="absolute inset-0">
          <Image
            src={headSrc}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 70vw, 320px"
          />
        </div>
      )}

      {/* =====================================================
          CORPO COMPLETO
          Uma única peça:
          roupa, fantasia ou armadura.
      ===================================================== */}
      {outfitSrc && (
        <div className="absolute inset-0">
          <Image
            src={outfitSrc}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 70vw, 320px"
          />
        </div>
      )}

      {/* =====================================================
          BUDDY
          Companheiro do aventureiro.
      ===================================================== */}
      {buddySrc && (
        <div className="absolute inset-0">
          <Image
            src={buddySrc}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 70vw, 320px"
          />
        </div>
      )}
    </div>
  );
}