import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import UpdateShortCode from "../app/components/UpdateShortCode";

// Mock Firebase and other modules
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: { uid: "test-uid" },
  })),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  Timestamp: { now: vi.fn(() => new Date()) },
  doc: vi.fn(),
  collection: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue({}),
}));

vi.mock("react-toastify", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import("react-toastify");
  return {
    ...actual,
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
    ToastContainer: () => null,
  };
});

describe("UpdateShortCode Component", () => {
  test("should render modal when open is true", () => {
    render(
      <UpdateShortCode
        open={true}
        onClose={vi.fn()}
        name="Test"
        id="test-id"
        refresh={vi.fn()}
      />
    );
    expect(screen.getByText("Update Test's short URL")).toBeInTheDocument();
  });

  test("should not render modal when open is false", () => {
    render(
      <UpdateShortCode
        open={false}
        onClose={vi.fn()}
        name="Test"
        id="test-id"
        refresh={vi.fn()}
      />
    );
    expect(
      screen.queryByText("Update Test's short URL")
    ).not.toBeInTheDocument();
  });

  test("should handle input field changes", () => {
    render(
      <UpdateShortCode
        open={true}
        onClose={vi.fn()}
        name="Test"
        id="test-id"
        refresh={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/Short URL/i), {
      target: { value: "new-short-code" },
    });

    expect(screen.getByLabelText(/Short URL/i)).toHaveValue("new-short-code");
  });

  test("should call handleClose when clicking outside the modal", async () => {
    const onClose = vi.fn();

    render(
      <UpdateShortCode
        open={true}
        onClose={onClose}
        name="Test"
        id="test-id"
        refresh={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTitle("modal")); // Clicks the overlay to close
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("should handle close button click", async () => {
    const onClose = vi.fn();

    render(
      <UpdateShortCode
        open={true}
        onClose={onClose}
        name="Test"
        id="test-id"
        refresh={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTitle("close")); // Clicks the close button
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
