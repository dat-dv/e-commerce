import "client-only";

export function mergeSearchParams(next: Record<string, unknown>) {
  const params = new URLSearchParams(window.location.search);

  Object.entries(next).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      params.delete(key);
      return;
    }

    if (Array.isArray(value)) {
      params.delete(key);

      value.forEach((item) => {
        params.append(key, String(item));
      });

      return;
    }

    params.set(key, String(value));
  });

  return params;
}

export function getNewUrlBySearchParams(searchParams: Record<string, unknown>) {
  const pathname = window.location.pathname;
  const params = mergeSearchParams(searchParams);
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}
