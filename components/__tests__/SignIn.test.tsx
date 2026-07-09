import { render, screen } from "@testing-library/react";
import SignInPage from "../../app/sign-in/page";
import React from "react";

describe("SignInPage", () => {
  it("renders social sign-in buttons and credential form", () => {
    render(<SignInPage />);

    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });
});
