"use client";

import { useState } from "react";
import { use } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import FormularioPost from "@/components/posts/PostForm";

interface Props {
  params: Promise<{ locale: string }>;
}

export default function PaginaNuevaPublicacion({ params }: Props) {
  const { locale: idioma } = use(params);
  const t = useTranslations("nuevaPublicacion");
  const router = useRouter();
  const [estaCargando, setEstaCargando] = useState(false);

  const manejarEnvio = async (data: {
    title: string;
    content: string;
    imageUrl: string;
  }) => {
    setEstaCargando(true);
    try {
      await api.createPost(data);
      router.push(`/${idioma}`);
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-black text-on-surface mb-2">
          {t("titulo")}
        </h1>
      </div>
      <FormularioPost alEnviar={manejarEnvio} estaCargando={estaCargando} idioma={idioma} />
    </div>
  );
}
