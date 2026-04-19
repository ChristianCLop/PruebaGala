const DEEPL_URL = "https://api-free.deepl.com/v2/translate";

// Traduce un array de textos al idioma destino usando DeepL.
// Devuelve los textos originales si la clave no está configurada o si la llamada falla.
export async function traducir(textos: string[], idiomaDestino: string): Promise<string[]> {
  const clave = process.env.DEEPL_API_KEY;
  if (!clave) return textos;

  try {
    const respuesta = await fetch(DEEPL_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${clave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: textos,
        target_lang: idiomaDestino.toUpperCase(),
      }),
    });

    if (!respuesta.ok) return textos;

    const datos = await respuesta.json() as { translations: { text: string }[] };
    return datos.translations.map((t) => t.text);
  } catch {
    return textos;
  }
}
