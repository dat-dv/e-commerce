export interface IUseCase<TRequest, TResponse> {
  execute(request: TRequest): TResponse;
}

export abstract class UseCase<TRequest, TResponse> implements IUseCase<
  TRequest,
  TResponse
> {
  constructor() {}
  abstract execute(request: TRequest): TResponse;
}
