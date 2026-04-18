import Link from "next/link";

export default function PaginaNoEncontrada() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <span className="material-symbols-outlined text-8xl text-outline/30 mb-6 block">
        search_off
      </span>
      <h1 className="font-headline text-6xl font-black text-on-surface mb-4">404</h1>
      <p className="font-body text-on-surface-variant text-lg mb-8">
        La página que buscas no existe.
      </p>
      <Link
        href="/es"
        className="inline-flex items-center gap-2 bg-linear-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-label font-bold text-sm uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Volver al inicio
      </Link>
    </div>
  );
}
