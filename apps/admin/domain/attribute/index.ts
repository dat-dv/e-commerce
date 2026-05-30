import { AdminAttributeRepository } from "./infrastructure/attribute.repository";
import { GetAttributesUseCase } from "./use-cases/get-attributes.use-case";

export * from "./infrastructure/attribute.repository";
export * from "./types/attribute.repository";
export * from "./use-cases/get-attributes.use-case";

const attributeRepository = new AdminAttributeRepository();

export const adminAttributeUseCase = {
  getAttributes: new GetAttributesUseCase(attributeRepository),
};
