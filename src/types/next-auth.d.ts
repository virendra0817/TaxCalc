declare module "next-auth" {
  interface Session {
    user: {
      id: string;       // ← this is what was missing
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}