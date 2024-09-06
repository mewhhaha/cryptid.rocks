export const createPricesCacheKey = (userId: string, request: Request) => {
  return new Request(
    new URL(`/${encodeURIComponent(userId)}/prices`, request.url),
  );
};
