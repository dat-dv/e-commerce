import { appRequest } from "@/utils/request/request";

import { OrderReturnsRepository } from "./infrastructure/order-returns.repository";
import { CreateOrderReturnUseCase } from "./use-cases/create-order-return.use-case";
import { UploadOrderReturnImageUseCase } from "./use-cases/upload-order-return-image.use-case";

const repository = new OrderReturnsRepository(appRequest);

export const orderReturnsUseCase = {
  uploadImage: new UploadOrderReturnImageUseCase(repository),
  create: new CreateOrderReturnUseCase(repository),
};
