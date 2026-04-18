import { z } from "zod";

// Esquemas Zod para la validación del cuerpo de la solicitud

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
  imageUrl: z
    .string()
    .url("imageUrl must be a valid URL"),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters")
    .optional(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .optional(),
  imageUrl: z
    .string()
    .url("imageUrl must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
