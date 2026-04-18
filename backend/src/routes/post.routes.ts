import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createPostSchema,
  updatePostSchema,
} from "../validators/post.validator";

const router = Router();

// Nota: para evitar error la ruta del slug debe venir, despues del :id para evitar conflictos
router.get("/slug/:slug", getPostBySlug);

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", validate(createPostSchema), createPost);
router.put("/:id", validate(updatePostSchema), updatePost);
router.delete("/:id", deletePost);

export default router;
