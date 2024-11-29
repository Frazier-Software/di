export const unknownProvider = (obj: unknown) =>
  Error(`[di] unknown provider: ${String(obj)}`);

export const invalidProvider = (obj: unknown) =>
  Error(`[di] invalid provider: ${String(obj)}`);
