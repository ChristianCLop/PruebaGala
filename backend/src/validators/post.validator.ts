import { z } from "zod";

// Esquemas Zod para la validación del cuerpo de la solicitud

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Titulo debe tener al menos 3 caracteres")
    .max(255, "Titulo no debe exceder los 255 caracteres"),
  content: z
    .string()
    .min(10, "Contenido debe tener al menos 10 caracteres"),
  imageUrl: z
    .string()
    .url("imageUrl debe ser una URL válida"),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, "Titulo debe tener al menos 3 caracteres")
    .max(255, "Titulo no debe exceder los 255 caracteres")
    .optional(),
  content: z
    .string()
    .min(10, "Contenido debe tener al menos 10 caracteres")
    .optional(),
  imageUrl: z
    .string()
    .url("imageUrl debe ser una URL válida")
    .optional()
    .or(z.literal("")),
});

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
