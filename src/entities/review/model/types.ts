export type Review = {
  id: number;
  userId: number;
  username: string;
  pubId: number;
  pubTitle: string;
  content: string;
  rate: number;
  likeCount: number;
  likedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt: string;
};
