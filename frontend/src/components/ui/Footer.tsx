"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-surface-container-low w-full py-12 px-8">
      <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="font-headline italic text-lg text-[#111111] mb-2">
            Gala Post
          </div>
          <p className="font-sans text-sm text-[#111111]/60">{t("derechosReservados")}</p>
        </div>
      </div>
    </footer>
  );
}
