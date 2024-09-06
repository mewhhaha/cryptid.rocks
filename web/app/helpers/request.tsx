export const abortable = (f: (signal: AbortSignal) => void | Promise<void>) => {
  const controller = new AbortController();

  f(controller.signal);

  return () => {
    controller.abort();
  };
};
