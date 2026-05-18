type SafeValue = object | string | number | boolean | null | undefined;
type SafeItem = Promise<SafeValue> | SafeValue;

export async function allSafe<T extends readonly SafeItem[] | []>(
  promises: T,
): Promise<{
  [K in keyof T]: T[K] extends Promise<infer U> ? U | null : T[K];
}> {
  const results = await Promise.allSettled(promises);

  return results.map((result) =>
    result.status === "fulfilled" ? result.value : null,
  ) as { [K in keyof T]: T[K] extends Promise<infer U> ? U | null : T[K] };
}

export async function safe<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}
