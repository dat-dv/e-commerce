export interface QueueItem {
  resolve: () => void;
  reject: (error: unknown) => void;
}

export const refreshState = {
  isRefreshing: false,
  failedQueue: [] as QueueItem[],
};

export const processQueue = (error: unknown) => {
  refreshState.failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  refreshState.failedQueue = [];
};
