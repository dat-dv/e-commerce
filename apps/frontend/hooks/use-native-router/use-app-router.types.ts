export type QueryPrimitive = string | number | boolean | object;

export type QueryValue = QueryPrimitive | null | undefined | QueryPrimitive[];

export type QueryParams = Record<string, QueryValue>;

export type ParamsObject = Record<string, string | string[]>;

export type NavigateParams = {
  pathname?: string;
} & QueryParams;

export type UseAppRouterOptions<T extends Record<string, unknown>> = {
  isSyncWithSearchParams?: boolean;

  /**
   * Default state for router state
   */
  extendParams?: Partial<T>;
};
