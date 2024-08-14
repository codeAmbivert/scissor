import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loading from "../app/components/Loading"; // Adjust the import path as necessary
import "@testing-library/jest-dom"; // Ensure this is correctly imported

describe("Loading Component", () => {
  it("renders the loading spinner and text correctly", () => {
    render(<Loading />);

    const spinnerImage = screen.getByAltText("spinner");

    // Get the src attribute
    const src = spinnerImage.getAttribute("src");

    // Check if the src contains '/spinner.gif'
    expect(src).toContain("/_next/image?url=%2Fspinner.gif&w=256&q=75");

    expect(spinnerImage).toBeInTheDocument();
    expect(spinnerImage).toHaveAttribute("width", "100");
    expect(spinnerImage).toHaveAttribute("height", "100");

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass("text-white");
    expect(loadingText).toHaveClass("font-medium");
    expect(loadingText).toHaveClass("mt-5");
  });
});
