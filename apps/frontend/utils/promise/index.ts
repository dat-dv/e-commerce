export async function allSafe<T extends readonly unknown[] | []>(
  promises: T,
): Promise<{ [K in keyof T]: T[K] extends Promise<infer U> ? U | null : T[K] }> {
  const results = await Promise.allSettled(promises);

  return results.map((result) =>
    result.status === 'fulfilled' ? (result as PromiseFulfilledResult<unknown>).value : null,
  ) as { [K in keyof T]: T[K] extends Promise<infer U> ? U | null : T[K] };
}

export async function safe<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}
