"use client";

import React from "react";
import { AuthGuard } from "@/components/molecules/providers/auth-guard";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default Layout;
