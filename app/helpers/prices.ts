export const createUserCacheKey = (userId: string, request: Request) => {
  const url = new URL(`/${encodeURIComponent(userId)}`, request.url);
  return new Request(url);
};
