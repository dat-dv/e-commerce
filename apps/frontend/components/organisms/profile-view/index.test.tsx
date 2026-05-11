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
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
            avatar_url: "",
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
