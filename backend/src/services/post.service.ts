import { prisma } from "../config/database";
import { AppError } from "../middlewares/errorHandler.middleware";
import { CreatePostDTO, UpdatePostDTO } from "../validators/post.validator";

// Genera un slug a partir de un título, añadiéndole una marca de tiempo para garantizar unicidad
const generarSlug = (titulo: string): string => {
  const base = titulo
    .toLowerCase()
    .normalize("NFD")
    // Elimina los acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `${base}-${Date.now()}`;
};

export const postService = {
  // Devuelve todos los registros de más reciente a más antiguo
  async findAll() {
    return prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  // Busca una publicación por ID; lanza error 404 si no existe
  async findById(id: number) {
    const publicacion = await prisma.post.findUnique({ where: { id } });
    if (!publicacion) throw new AppError(404, `Post con id ${id} no encontrado`);
    return publicacion;
  },

  // Busca una publicación por slug (usado en la vista pública de detalle)
  async findBySlug(slug: string) {
    const publicacion = await prisma.post.findUnique({ where: { slug } });
    if (!publicacion) throw new AppError(404, `Post con slug "${slug}" no encontrado`);
    return publicacion;
  },

  // Crea una nueva publicación y genera su slug automáticamente a partir del título
  async create(data: CreatePostDTO) {
    const slug = generarSlug(data.title);
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        slug,
      },
    });
  },

  // Actualiza una publicación existente; si cambia el título, regenera el slug
  async update(id: number, data: UpdatePostDTO) {
    // Verifica que la publicación exista antes de actualizar
    await postService.findById(id);

    const datosActualizacion: typeof data & { slug?: string } = { ...data };
    if (data.title) {
      datosActualizacion.slug = generarSlug(data.title);
    }

    return prisma.post.update({
      where: { id },
      data: datosActualizacion,
    });
  },

  // Elimina una publicación por ID
  async delete(id: number) {
    // Verifica que la publicación exista antes de eliminar
    await postService.findById(id);
    return prisma.post.delete({ where: { id } });
  },
};
