export default function createSuccessResponse<T>(data: T) {
  return {
    status: 'success',
    data,
    message: null,
    timestamp: new Date().toISOString(),
  };
}
