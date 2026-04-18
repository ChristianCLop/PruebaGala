import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// Middleware que valida el contenido de la solicitud (req.body) por el esquema Zod
export const validate =
  (esquema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        req.body = esquema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: error.issues.map((problema) => ({
              field: problema.path.join("."),
              message: problema.message,
            })),
          });
          return;
        }
        next(error);
      }
    };
