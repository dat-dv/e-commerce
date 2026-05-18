export interface QueueItem {
  resolve: () => void;
  reject: (error: Error) => void;
}

export const refreshState = {
  isRefreshing: false,
  failedQueue: [] as QueueItem[],
};

export const processQueue = (error: Error | null): void => {
  refreshState.failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  refreshState.failedQueue = [];
};
