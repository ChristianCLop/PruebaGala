"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

interface PropiedadesNavbar {
  locale: string;
}

export default function Navbar({ locale: idioma }: PropiedadesNavbar) {
  const t = useTranslations("nav");
  const router = useRouter();
  const rutaActual = usePathname();

  const esAdmin = rutaActual.includes("/admin");

  const cambiarIdioma = (nuevoIdioma: string) => {
    const segmentos = rutaActual.split("/");
    segmentos[1] = nuevoIdioma;
    router.push(segmentos.join("/"));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffffff]/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(26,28,30,0.06)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-360 mx-auto">

        {/* Marca */}
        <Link
          href={`/${idioma}`}
          className="font-headline text-2xl font-black text-[#111111] uppercase tracking-tighter"
        >
          {t("marca")}
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={`/${idioma}`}
            className={`font-sans uppercase tracking-wider text-xs font-bold transition-colors ${!esAdmin
              ? "text-primary border-b-2 border-primary"
              : "text-[#111111] hover:text-primary"
              }`}
          >
            {t("publicaciones")}
          </Link>
          <Link
            href={`/${idioma}/admin`}
            className={`font-sans uppercase tracking-wider text-xs font-bold transition-colors ${esAdmin
              ? "text-primary border-b-2 border-primary"
              : "text-[#111111] hover:text-primary"
              }`}
          >
            {t("admin")}
          </Link>
        </nav>

        {/* Acciones a la derecha */}
        <div className="flex items-center gap-2">
          {/* Selector de idioma */}
          <div className="flex gap-1 text-xs font-bold uppercase">
            <button
              onClick={() => cambiarIdioma("es")}
              className={`px-2 py-1 rounded transition-colors ${idioma === "es"
                ? "bg-[#111111] text-white"
                : "text-[#111111]/50 hover:text-[#111111]"
                }`}
            >
              ES
            </button>
            <button
              onClick={() => cambiarIdioma("en")}
              className={`px-2 py-1 rounded transition-colors ${idioma === "en"
                ? "bg-[#111111] text-white"
                : "text-[#111111]/50 hover:text-[#111111]"
                }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
