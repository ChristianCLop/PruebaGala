import { Request, Response, NextFunction } from "express";

// Clase personalizada de errores para asociarlos con codigos de estados HTTP
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Manejador de errores global: debe tener 4 parámetros para que Express lo reconozca como middleware de error
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Error inesperado
  console.error("[Error no manejado]", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
