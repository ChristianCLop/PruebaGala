import { Request, Response, NextFunction } from "express";
import { postService } from "../services/post.service";

// GET /api/posts
export const getAllPosts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicaciones = await postService.findAll();
    res.json({ status: "success", data: publicaciones });
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/:id
export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const publicacion = await postService.findById(id);
    res.json({ status: "success", data: publicacion });
  } catch (error) {
    next(error);
  }
};

// GET /api/posts/slug/:slug
export const getPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacion = await postService.findBySlug(req.params.slug as string);
    res.json({ status: "success", data: publicacion });
  } catch (error) {
    next(error);
  }
};

// POST /api/posts
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const publicacion = await postService.create(req.body);
    res.status(201).json({ status: "success", data: publicacion });
  } catch (error) {
    next(error);
  }
};

// PUT /api/posts/:id
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const publicacion = await postService.update(id, req.body);
    res.json({ status: "success", data: publicacion });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/posts/:id
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await postService.delete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
