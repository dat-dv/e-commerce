import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "@/components/molecules/providers/auth-provider";

import { ProfileView } from "./index";

describe("ProfileView Organism", () => {
  it("should render ProfileForm with user data", () => {
    render(
      <AuthProvider
        initState={{
          user: {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            avatarUrl: "",
          },
        }}
      >
        <ProfileView />
      </AuthProvider>,
    );

    expect(screen.getByTestId("profile-form")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
});
