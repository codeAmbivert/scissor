import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // for the toBeInTheDocument matcher
import Home from "@/app/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("next/font/google", () => ({
  Poppins: jest.fn(() => ({
    className: 'mock-class',
  })),
}));

describe("Home component", () => {
  it("should have Login/Signup text", () => {
    // Mock the router object
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      prefetch: jest.fn(),
    });

    render(<Home />); // ARRANGE

    const myElement = screen.getByText(/Login\/Signup/i); // ACT
    expect(myElement).toBeInTheDocument(); // ASSERT
  });

  it("should have welcome text", () => {
    // Mock the router object
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      prefetch: jest.fn(),
    });

    render(<Home />); // ARRANGE

    const myElement = screen.getByText(/welcome/i); // case-insensitive regex
    expect(myElement).toBeInTheDocument(); // ASSERT
  });
});