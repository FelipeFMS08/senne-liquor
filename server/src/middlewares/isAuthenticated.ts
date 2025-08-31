import { fromNodeHeaders } from "better-auth/node";
import { type NextFunction, type Request, type Response } from "express";
import { auth } from "src/lib/auth";


export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: "Acesso não autorizado."});
  }

  return next();
}