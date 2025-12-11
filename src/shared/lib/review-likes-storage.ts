const STORAGE_KEY = "pubfinder.reviewLikes";

type LikeStorage = Record<string, Record<string, boolean>>;

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

const readStorage = (): LikeStorage => {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || !parsed) {
      return {};
    }
    return parsed as LikeStorage;
  } catch (error) {
    console.warn("Failed to read stored review likes", error);
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
};

const writeStorage = (value: LikeStorage) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

const userKey = (userId: number | string) => String(userId);
const reviewKey = (reviewId: number | string) => String(reviewId);

export type ReviewLikesMap = Record<number, boolean>;

export const getStoredReviewLikes = (
  userId?: number | null
): ReviewLikesMap => {
  if (!userId || !isBrowser()) {
    return {};
  }
  const storage = readStorage();
  const likes = storage[userKey(userId)];
  if (!likes) {
    return {};
  }

  return Object.entries(likes).reduce<ReviewLikesMap>((acc, [id, liked]) => {
    acc[Number(id)] = Boolean(liked);
    return acc;
  }, {});
};

export const setStoredReviewLike = (
  userId: number | null | undefined,
  reviewId: number,
  liked: boolean
) => {
  if (!userId || !isBrowser()) {
    return;
  }

  const storage = readStorage();
  const currentLikes = storage[userKey(userId)] ?? {};

  if (liked) {
    currentLikes[reviewKey(reviewId)] = true;
    storage[userKey(userId)] = currentLikes;
  } else {
    delete currentLikes[reviewKey(reviewId)];
    if (Object.keys(currentLikes).length > 0) {
      storage[userKey(userId)] = currentLikes;
    } else {
      delete storage[userKey(userId)];
    }
  }

  writeStorage(storage);
};
