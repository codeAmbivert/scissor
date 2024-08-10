import { render, fireEvent, waitFor } from "@testing-library/react";
import UpdateShortCode from "@/app/components/UpdateShortCode";
import { getAuth } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import "@testing-library/jest-dom";

jest.mock("firebase/auth");
jest.mock("firebase/firestore");
jest.mock("nanoid", () => {
  return {
    nanoid: jest.fn(() => "mocked-id"),
  };
});

describe("UpdateShortCode", () => {
  it("should call updateDoc on form submit", async () => {
    (getAuth as jest.Mock).mockReturnValue({ currentUser: { uid: "123" } });
    const mockUpdateDoc = updateDoc as jest.Mock;

    const { getByLabelText, getByText } = render(
      <UpdateShortCode
        open={true}
        onClose={jest.fn()}
        name="test"
        id="1"
        refresh={jest.fn()}
      />
    );

    const input = getByLabelText("Short URL");
    fireEvent.change(input, { target: { value: "newCode" } });

    const submitButton = getByText("Update short URL");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });
});