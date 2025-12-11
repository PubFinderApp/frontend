export type User = {
  accountId: number;
  username: string;
  token: string;
  tokenExpiresAt?: number | null;
};
