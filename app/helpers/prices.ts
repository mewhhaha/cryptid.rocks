export const createPricesCacheKey = (userId: string, request: Request) => {
  const url = new URL(`/${encodeURIComponent(userId)}/prices`, request.url);
  return new Request(url);
};
