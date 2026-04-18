"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Post } from "@/lib/api";

interface PostCardProps {
  post: Post;
  locale: string;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function PostCard({
  post,
  locale,
  onDelete,
  isDeleting,
}: PostCardProps) {
  const t = useTranslations("home");
  const [imgError, setImgError] = useState(false);

  const handleDelete = () => {
    if (window.confirm(t("confirmDelete"))) {
      onDelete(post.id);
    }
  };

  const showImage = post.imageUrl && !imgError;

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {showImage && (
        <div className="h-48 w-full overflow-hidden">
          {/* Manejo de URLs externas */}
          <img
            src={post.imageUrl!}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
          {post.content}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link
            href={`/${locale}/posts/${post.slug}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {t("readMore")} →
          </Link>

          <div className="flex gap-2">
            <Link
              href={`/${locale}/posts/${post.id}/edit`}
              className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {t("edit")}
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm px-3 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "..." : t("delete")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
