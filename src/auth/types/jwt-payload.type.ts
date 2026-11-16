
export type JwtPayload = {
  sub: number;
  email: string;
  role: string;
};

export type AuthUser = {
  userId: number;
  email: string;
  role: string;
};