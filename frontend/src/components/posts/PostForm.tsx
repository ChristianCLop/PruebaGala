"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Post } from "@/lib/api";

interface PropiedadesFormulario {
  datosIniciales?: Post;
  alEnviar: (data: { title: string; content: string; imageUrl: string }) => Promise<void>;
  estaCargando: boolean;
  idioma: string;
}

export default function FormularioPost({
  datosIniciales,
  alEnviar,
  estaCargando,
  idioma,
}: PropiedadesFormulario) {
  const t = useTranslations("formularioPost");
  const [titulo, setTitulo] = useState(datosIniciales?.title ?? "");
  const [contenido, setContenido] = useState(datosIniciales?.content ?? "");
  const [urlImagen, setUrlImagen] = useState(datosIniciales?.imageUrl ?? "");
  const [errorVistaPrevia, setErrorVistaPrevia] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contadorPalabras = contenido.trim() ? contenido.trim().split(/\s+/).length : 0;

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await alEnviar({ title: titulo, content: contenido, imageUrl: urlImagen });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* ── Formulario ────────────────────────────────────── */}
      <div className="lg:col-span-7">
        <div className="bg-surface-container-lowest p-10 rounded-xl">
          <form onSubmit={manejarEnvio} className="space-y-10">
            {error && (
              <div className="bg-error-container/30 border-b border-error text-on-error-container px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Título */}
            <div className="space-y-2">
              <label className="font-sans font-bold uppercase tracking-widest text-[10px] text-primary">
                {t("etiquetaTitulo")}
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder={t("marcadorTitulo")}
                required
                className="w-full bg-transparent border-b border-outline-variant/20 focus:border-primary px-0 py-3 font-headline text-3xl placeholder:text-surface-dim transition-all outline-none"
              />
            </div>

            {/* URL de imagen */}
            <div className="space-y-2">
              <label
                className={`font-sans font-bold uppercase tracking-widest text-[10px] ${urlImagen && errorVistaPrevia ? "text-error" : "text-primary"
                  }`}
              >
                {t("etiquetaImagen")}
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={urlImagen}
                  onChange={(e) => { setUrlImagen(e.target.value); setErrorVistaPrevia(false); }}
                  required
                  placeholder={t("marcadorImagen")}
                  className={`w-full border-b px-0 py-3 font-sans text-sm transition-all outline-none ${urlImagen && errorVistaPrevia
                      ? "bg-error-container/30 border-error placeholder:text-on-error-container/50"
                      : "bg-transparent border-outline-variant/20 focus:border-primary"
                    }`}
                />
                {urlImagen && errorVistaPrevia && (
                  <span className="material-symbols-outlined absolute right-0 top-3 text-error text-sm">
                    error
                  </span>
                )}
              </div>
              <p className="text-[10px] font-sans text-outline uppercase tracking-tight">
                {t("sugerenciaImagen")}
              </p>
            </div>

            {/* Contenido */}
            <div className="space-y-2">
              <label className="font-sans font-bold uppercase tracking-widest text-[10px] text-primary">
                {t("etiquetaContenido")}
              </label>
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder={t("marcadorContenido")}
                required
                rows={12}
                className="w-full bg-surface-container-low/30 border-none rounded-lg p-6 font-sans text-base leading-relaxed text-on-surface focus:ring-1 focus:ring-primary/20 outline-none resize-y"
              />
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-6 pt-4">
              <button
                type="submit"
                disabled={estaCargando}
                className="bg-linear-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-lg font-sans font-bold text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {estaCargando ? "..." : datosIniciales ? t("guardar") : t("publicar")}
              </button>
              <a
                href={`/${idioma}/admin`}
                className="text-secondary font-sans font-bold text-xs uppercase tracking-widest px-4 py-3 hover:bg-surface-variant transition-all rounded-lg"
              >
                {t("cancelar")}
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* ── Panel de vista previa ─────────────────────────── */}
      <aside className="lg:col-span-5">
        <div className="sticky top-28 space-y-6">
          {/* Vista previa visual */}
          <div className="bg-surface-container-low p-1 rounded-xl overflow-hidden">
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-sans font-black uppercase tracking-tighter text-sm">
                  {t("vistaPrevia")}
                </h3>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {datosIniciales ? t("publicado") : t("borrador")}
                </span>
              </div>

              {/* Vista previa de imagen */}
              <div className="relative group aspect-16/10 bg-surface-variant rounded-lg overflow-hidden mb-6">
                {urlImagen && !errorVistaPrevia ? (
                  <>
                    <img
                      src={urlImagen}
                      alt="vista previa"
                      className="w-full h-full object-cover"
                      onError={() => setErrorVistaPrevia(true)}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                    <div className="absolute bottom-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-widest">
                        {t("imagenCargada")}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-outline/30">
                      image
                    </span>
                  </div>
                )}
              </div>

              {/* Texto esquemático */}
              <div className="space-y-4">
                {titulo ? (
                  <p className="font-headline text-lg text-on-surface leading-tight line-clamp-2">
                    {titulo}
                  </p>
                ) : (
                  <div className="h-5 w-3/4 bg-surface-container-highest/50 rounded" />
                )}
                <div className="space-y-2">
                  <div className="h-2 w-full bg-surface-container-high rounded" />
                  <div className="h-2 w-full bg-surface-container-high rounded" />
                  <div className="h-2 w-2/3 bg-surface-container-high rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Metadatos */}
          <div className="bg-surface-container-highest/30 p-8 rounded-xl space-y-6">
            <h4 className="font-sans font-bold uppercase tracking-widest text-[10px] text-secondary">
              {t("detallesPublicacion")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-outline uppercase font-bold tracking-tight">
                  {t("contadorPalabras")}
                </p>
                <p className="text-xs font-medium">{contadorPalabras} {t("palabras")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-outline uppercase font-bold tracking-tight">
                  {t("ultimaEdicion")}
                </p>
                <p className="text-xs font-medium">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
