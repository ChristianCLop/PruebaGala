"use client";

import { useEffect, useState, useMemo } from "react";
import { use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { api, Post } from "@/lib/api";

const ITEMS_POR_PAGINA = 5;

interface Props {
  params: Promise<{ locale: string }>;
}

export default function PaginaAdmin({ params }: Props) {
  const { locale: idioma } = use(params);
  const t = useTranslations("admin");
  const tErr = useTranslations("errores");

  const [publicaciones, setPublicaciones] = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  useEffect(() => {
    api
      .getAllPosts()
      .then(setPublicaciones)
      .catch(() => setError(tErr("errorCarga")))
      .finally(() => setCargando(false));
  }, [tErr]);

  const filtradas = useMemo(
    () =>
      publicaciones.filter((p) =>
        p.title.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [publicaciones, busqueda]
  );

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITEMS_POR_PAGINA));
  const paginadas = filtradas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  const manejarEliminar = async (id: number) => {
    if (!window.confirm(t("confirmarEliminar"))) return;
    setEliminandoId(id);
    try {
      await api.deletePost(id);
      setPublicaciones((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert(tErr("errorEliminar"));
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-semibold">
            {t("etiqueta")}
          </span>
          <h1 className="font-headline text-5xl font-medium text-on-surface tracking-tight">
            {t("titulo")}
          </h1>
        </div>
        <Link
          href={`/${idioma}/posts/new`}
          className="inline-flex items-center gap-2 bg-linear-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-opacity font-label text-sm font-semibold uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          {t("crearNuevo")}
        </Link>
      </div>

      {/* Tabla */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_32px_rgba(26,28,30,0.04)] overflow-hidden">
        {/* Controles */}
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low/30">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
            </span>
            <input
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              placeholder={t("marcadorBusqueda")}
              className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-outline-variant/20 focus:border-primary focus:outline-none transition-colors placeholder:text-outline/50 font-body text-sm"
            />
          </div>
        </div>

        {/* Contenido de la tabla */}
        {error ? (
          <div className="px-8 py-12 text-center text-on-error-container bg-error-container/30 text-sm">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  {(["columnaTitulo", "columnaFecha", "columnaAcciones"] as const).map(
                    (col) => (
                      <th
                        key={col}
                        className={`px-8 py-4 font-label text-[10px] uppercase tracking-[0.15em] text-outline font-bold ${col === "columnaAcciones" ? "text-right" : ""}`}
                      >
                        {t(col)}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {cargando
                  ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-surface-container-high animate-pulse shrink-0" />
                          <div className="space-y-2">
                            <div className="h-4 w-48 bg-surface-container-high rounded animate-pulse" />
                            <div className="h-3 w-24 bg-surface-container-high rounded animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6"><div className="h-3 w-24 bg-surface-container-high rounded animate-pulse" /></td>
                      <td className="px-8 py-6" />
                    </tr>
                  ))
                  : paginadas.length === 0
                    ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-16 text-center text-outline text-sm">
                          {t("sinResultados")}
                        </td>
                      </tr>
                    )
                    : paginadas.map((publicacion) => (
                      <tr
                        key={publicacion.id}
                        className="hover:bg-surface-container-low/20 transition-colors group"
                      >
                        {/* Título + miniatura */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0">
                              {publicacion.imageUrl ? (
                                <img
                                  src={publicacion.imageUrl}
                                  alt={publicacion.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) =>
                                    ((e.target as HTMLImageElement).style.display = "none")
                                  }
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="material-symbols-outlined text-sm text-outline/40">
                                    image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-headline text-base font-medium text-on-surface leading-tight mb-0.5">
                                {publicacion.title}
                              </div>
                              <div className="text-xs text-outline font-body italic truncate max-w-50">
                                /{publicacion.slug.split("-").slice(0, 4).join("-")}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Fecha */}
                        <td className="px-8 py-6">
                          <div className="text-sm font-body text-secondary">
                            {new Date(publicacion.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/${idioma}/posts/${publicacion.id}/edit`}
                              className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-xl">edit_square</span>
                            </Link>
                            <button
                              onClick={() => manejarEliminar(publicacion.id)}
                              disabled={eliminandoId === publicacion.id}
                              className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors disabled:opacity-50"
                              title="Eliminar"
                            >
                              <span className="material-symbols-outlined text-xl">
                                {eliminandoId === publicacion.id ? "hourglass_empty" : "delete"}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        <div className="px-8 py-6 border-t border-surface-container-low flex items-center justify-between">
          <div className="text-sm text-outline font-body">
            {t("mostrando")}{" "}
            <span className="font-bold text-on-surface">
              {filtradas.length === 0 ? 0 : (pagina - 1) * ITEMS_POR_PAGINA + 1}–
              {Math.min(pagina * ITEMS_POR_PAGINA, filtradas.length)}
            </span>{" "}
            {t("de")}{" "}
            <span className="font-bold text-on-surface">{filtradas.length}</span>{" "}
            {t("entradas")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 text-outline hover:bg-surface-container-low transition-colors disabled:opacity-40"
            >
            </button>
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPagina(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-colors ${p === pagina
                    ? "bg-primary text-on-primary font-bold"
                    : "text-on-surface hover:bg-surface-container-low"
                    }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 text-outline hover:bg-surface-container-low transition-colors disabled:opacity-40"
            >
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
