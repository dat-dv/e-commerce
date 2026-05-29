import { type ElementType } from "react";

export interface IAccessDeniedLabels {
  title?: string;
  highlight?: string;
  description?: string;
  signIn?: string;
  createAccount?: string;
}

export interface IAccessDeniedProps {
  signInHref?: string;
  signUpHref?: string;
  linkComponent?: ElementType;
  labels?: IAccessDeniedLabels;
}
