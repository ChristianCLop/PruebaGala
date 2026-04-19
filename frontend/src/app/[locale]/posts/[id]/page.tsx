"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api, Post } from "@/lib/api";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default function PaginaDetallePublicacion({ params }: Props) {
  const { locale: idioma, id } = use(params);
  const t = useTranslations("detallePublicacion");
  const tErr = useTranslations("errores");
  const tAdmin = useTranslations("admin");
  const router = useRouter();

  const [publicacion, setPublicacion] = useState<Post | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorImagen, setErrorImagen] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    // [id] contiene el slug al navegar desde las tarjetas del inicio
    api
      .getPostBySlug(id, idioma)
      .then(setPublicacion)
      .catch(() => setError(tErr("noEncontrado")))
      .finally(() => setCargando(false));
  }, [id, tErr]);

  const manejarEliminar = async () => {
    if (!publicacion) return;
    if (!window.confirm(tAdmin("confirmarEliminar"))) return;
    setEliminando(true);
    try {
      await api.deletePost(publicacion.id);
      router.push(`/${idioma}`);
    } catch {
      alert(tErr("errorEliminar"));
      setEliminando(false);
    }
  };

  if (cargando) {
    return (
      <div className="max-w-360 mx-auto px-8 py-12 animate-pulse">
        <div className="h-4 w-32 bg-surface-container-high rounded mb-12" />
        <div className="h-72 w-full rounded-xl bg-surface-container-high mb-8" />
        <div className="h-12 w-3/4 bg-surface-container-high rounded mb-4" />
        <div className="h-3 w-40 bg-surface-container-high rounded mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-full bg-surface-container-high rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !publicacion) {
    return (
      <div className="max-w-360 mx-auto px-8 py-20 text-center">
        <p className="text-on-surface-variant text-lg mb-6">{error ?? tErr("noEncontrado")}</p>
        <Link href={`/${idioma}`} className="text-primary hover:underline text-sm">
          ← {t("volverInicio")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Imagen de portada */}
      {publicacion.imageUrl && !errorImagen && (
        <div className="w-full h-[60vh] overflow-hidden">
          <img
            src={publicacion.imageUrl}
            alt={publicacion.title}
            className="w-full h-full object-cover"
            onError={() => setErrorImagen(true)}
          />
        </div>
      )}

      <div className="max-w-180 mx-auto px-8 py-12">
        {/* Enlace para volver */}
        <Link
          href={`/${idioma}`}
          className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-label uppercase tracking-wider font-bold mb-10"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          {t("volverInicio")}
        </Link>

        {/* Metadatos */}
        <span className="block font-label text-xs uppercase tracking-[0.2em] text-primary mb-4 font-bold">
          {t("publicadoEl")}{" "}
          {new Date(publicacion.createdAt).toLocaleDateString(
            idioma === "es" ? "es-ES" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </span>

        {/* Título */}
        <h1 className="font-headline text-5xl lg:text-6xl text-on-background leading-[0.95] tracking-tight mb-10">
          {publicacion.title}
        </h1>

        {/* Contenido */}
        <div className="font-body text-on-surface-variant text-lg leading-relaxed whitespace-pre-line mb-12">
          {publicacion.content}
        </div>

        {/* Acciones */}
        <div className="pt-8 border-t border-outline-variant/20 flex items-center gap-3">
          <Link
            href={`/${idioma}/posts/${publicacion.id}/edit`}
            className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low font-label font-bold uppercase tracking-wider transition-colors text-secondary"
          >
            <span className="material-symbols-outlined text-lg">edit_square</span>
            {t("editar")}
          </Link>

          <button
            onClick={manejarEliminar}
            disabled={eliminando}
            className="inline-flex items-center gap-2 text-sm px-6 py-3 rounded-lg border border-error/30 hover:bg-error/10 font-label font-bold uppercase tracking-wider transition-colors text-error disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">
              {eliminando ? "hourglass_empty" : "delete"}
            </span>
            {t("eliminar")}
          </button>
        </div>
      </div>
    </div>
  );
}
