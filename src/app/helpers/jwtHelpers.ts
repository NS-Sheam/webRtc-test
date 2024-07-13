import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: Secret, expiresIn:string) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export const JwtHelpers = {
  createToken,
  verifyToken,
};
