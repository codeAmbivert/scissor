import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ShortenUrlModal from '../app/components/ShortenUrlModal';

// Mock Firebase and other modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: { uid: 'test-uid' },
  })),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  Timestamp: { now: vi.fn(() => new Date()) },
  doc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'test-id' }),
}));

vi.mock('react-toastify', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react-toastify');
  return {
    ...actual,
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
    ToastContainer: () => null,
  };
});

test('should call refresh and onClose on form submission', async () => {
  const refresh = vi.fn();
  const onClose = vi.fn();
  const { getByLabelText, getByText } = render(
    <ShortenUrlModal open={true} onClose={onClose} refresh={refresh} />
  );

  // Simulate user input
  fireEvent.change(getByLabelText(/Name/i), { target: { value: 'ShortName' } });
  fireEvent.change(getByLabelText(/Destination/i), { target: { value: 'https://example.com' } });

  // Ensure the button is rendered and can be clicked
  const button = getByText('Submit');
  expect(button).toBeInTheDocument();

  // Simulate button click
  fireEvent.click(button);

  // Wait for asynchronous actions to complete
  await waitFor(() => {
    expect(refresh).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
