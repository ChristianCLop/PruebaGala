"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { api, Post } from "@/lib/api";

interface Props {
  params: Promise<{ locale: string }>;
}

/* ── Tarjeta skeleton ────────────────────── */
function TarjetaSkeleton() {
  return (
    <div className="bg-surface-container-lowest p-6 flex flex-col animate-pulse">
      <div className="bg-surface-container-high rounded-lg aspect-4/3 mb-6" />
      <div className="h-2 w-24 bg-surface-container-high rounded mb-4" />
      <div className="h-6 w-full bg-surface-container-high rounded mb-2" />
      <div className="h-6 w-3/4 bg-surface-container-high rounded mb-6" />
      <div className="h-4 w-full bg-surface-container-high rounded mb-2" />
      <div className="h-4 w-full bg-surface-container-high rounded mb-2" />
      <div className="mt-auto pt-6 border-t border-outline-variant/10 flex justify-between">
        <div className="h-2 w-20 bg-surface-container-high rounded" />
        <div className="h-4 w-4 bg-surface-container-high rounded-full" />
      </div>
    </div>
  );
}

/* ── Tarjeta bento ─────────────────────────────────────────── */
function TarjetaPost({ post, idioma }: { post: Post; idioma: string }) {
  const [errorImagen, setErrorImagen] = useState(false);

  return (
    <div className="bg-surface-container-lowest p-6 flex flex-col group transition-all duration-300">
      {post.imageUrl && !errorImagen && (
        <div className="relative mb-6 overflow-hidden rounded-lg aspect-4/3">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={() => setErrorImagen(true)}
          />
        </div>
      )}
      {(!post.imageUrl || errorImagen) && (
        <div className="mb-6 overflow-hidden rounded-lg aspect-4/3 bg-surface-container flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-outline/40">image</span>
        </div>
      )}

      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-3">
        {new Date(post.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>

      <h3 className="text-2xl font-headline text-on-background leading-tight mb-4 group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      <p className="text-on-surface-variant text-sm font-body mb-6 grow line-clamp-3">
        {post.content}
      </p>

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/10">
        <Link
          href={`/${idioma}/posts/${post.slug}`}
          className="text-xs font-label text-on-surface/60 italic hover:text-primary transition-colors"
        >
          {post.slug.split("-").slice(0, 3).join(" ")}
        </Link>
        <Link href={`/${idioma}/posts/${post.slug}`}>
          <span className="material-symbols-outlined text-primary text-xl">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ── Post principal ─────────────────────────────────── */
function PostPrincipal({ post, idioma }: { post: Post; idioma: string }) {
  const t = useTranslations("inicio");
  const [errorImagen, setErrorImagen] = useState(false);

  return (
    <section className="max-w-360 mx-auto px-8 pt-12 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Imagen */}
        <div className="lg:col-span-7 group">
          <div className="relative overflow-hidden rounded-lg bg-surface-container-low aspect-video">
            {post.imageUrl && !errorImagen ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={() => setErrorImagen(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-outline/30">
                  article
                </span>
              </div>
            )}
            <div className="absolute top-6 left-6">
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold font-label uppercase tracking-widest">
                {t("destacado")}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-4 font-bold">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <h1 className="text-5xl lg:text-6xl font-headline text-on-background leading-[0.95] tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-body max-w-md line-clamp-4">
            {post.content}
          </p>
          <div>
            <Link
              href={`/${idioma}/posts/${post.slug}`}
              className="inline-block bg-linear-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-label font-bold text-sm uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {t("leerArticulo")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Página principal ──────────────────────────────────────── */
export default function PaginaInicio({ params }: Props) {
  const { locale: idioma } = use(params);
  const t = useTranslations("inicio");
  const tErr = useTranslations("errores");

  const [publicaciones, setPublicaciones] = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getAllPosts(idioma)
      .then(setPublicaciones)
      .catch(() => setError(tErr("errorCarga")))
      .finally(() => setCargando(false));
  }, [tErr]);

  /* Estado de carga */
  if (cargando) {
    return (
      <div>
        <div className="max-w-360 mx-auto px-8 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 animate-pulse">
              <div className="rounded-lg bg-surface-container-high aspect-video" />
            </div>
            <div className="lg:col-span-5 animate-pulse space-y-4 pt-4">
              <div className="h-3 w-32 bg-surface-container-high rounded" />
              <div className="h-16 w-full bg-surface-container-high rounded" />
              <div className="h-4 w-full bg-surface-container-high rounded" />
              <div className="h-4 w-3/4 bg-surface-container-high rounded" />
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low py-20">
          <div className="max-w-360 mx-auto px-8">
            <div className="h-8 w-48 bg-surface-container-high rounded animate-pulse mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => <TarjetaSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-360 mx-auto px-8 py-20">
        <div className="bg-error-container text-on-error-container rounded-xl px-6 py-4 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (publicaciones.length === 0) {
    return (
      <div className="max-w-360 mx-auto px-8 py-32 text-center">
        <span className="material-symbols-outlined text-6xl text-outline/30 mb-4 block">
          article
        </span>
        <p className="font-headline text-2xl text-on-surface-variant">{t("sinPublicaciones")}</p>
        <Link
          href={`/${idioma}/posts/new`}
          className="inline-block mt-8 bg-linear-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-label font-bold text-sm uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all"
        >
          {t("leerArticulo")}
        </Link>
      </div>
    );
  }

  const [principal, ...resto] = publicaciones;

  return (
    <div>
      {/* Post destacado */}
      <PostPrincipal post={principal} idioma={idioma} />

      {/* Cuadrícula bento */}
      {resto.length > 0 && (
        <section className="bg-surface-container-low py-20">
          <div className="max-w-360 mx-auto px-8">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-3xl font-headline italic">{t("publicacionesRecientes")}</h2>
              <div className="h-px grow mx-8 bg-outline-variant/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resto.map((publicacion) => (
                <TarjetaPost key={publicacion.id} post={publicacion} idioma={idioma} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
