"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api, Post } from "@/lib/api";
import FormularioPost from "@/components/posts/PostForm";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default function PaginaEditarPublicacion({ params }: Props) {
  const { locale: idioma, id } = use(params);
  const t = useTranslations("editarPublicacion");
  const tErr = useTranslations("errores");
  const router = useRouter();

  const [publicacion, setPublicacion] = useState<Post | null>(null);
  const [cargando, setCargando] = useState(true);
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPostById(Number(id))
      .then(setPublicacion)
      .catch(() => setError(tErr("noEncontrado")))
      .finally(() => setCargando(false));
  }, [id, tErr]);

  const manejarEnvio = async (data: {
    title: string;
    content: string;
    imageUrl: string;
  }) => {
    setEstaEnviando(true);
    try {
      await api.updatePost(Number(id), data);
      router.push(`/${idioma}/admin`);
    } catch {
      throw new Error(tErr("errorGuardar"));
    } finally {
      setEstaEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-12 animate-pulse space-y-3">
          <div className="h-14 w-72 bg-surface-container-high rounded" />
          <div className="h-3 w-40 bg-surface-container-high rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-10 space-y-10 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-2 w-24 bg-surface-container-high rounded" />
                <div className="h-10 w-full bg-surface-container-high rounded" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-5 bg-surface-container-low rounded-xl h-72 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !publicacion) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-20 text-center">
        <p className="text-on-error-container bg-error-container/30 rounded-xl px-6 py-4 text-sm inline-block">
          {error ?? tErr("noEncontrado")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-black text-on-surface mb-2">
          {t("titulo")}
        </h1>
      </div>
      <FormularioPost
        datosIniciales={publicacion}
        alEnviar={manejarEnvio}
        estaCargando={estaEnviando}
        idioma={idioma}
      />
    </div>
  );
}
