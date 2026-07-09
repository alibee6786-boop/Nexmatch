import { render, screen } from "@testing-library/react";
import Navbar from "../../components/Navbar";
import React from "react";

describe("Navbar", () => {
  it("renders brand and links", () => {
    render(<Navbar />);
    expect(screen.getByText("NexMatch")).toBeInTheDocument();
    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });
});
