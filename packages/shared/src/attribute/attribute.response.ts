import type { Attribute, AttributeValue } from "../generate/browser";

export interface IAttributeResponse extends Attribute {
  values?: AttributeValue[];
}

export type IAttributeListResponse = IAttributeResponse[];
