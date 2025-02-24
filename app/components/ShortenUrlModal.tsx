import { IoClose } from "react-icons/io5";
import InputField from "./InputField";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import {
  getFirestore,
  Timestamp,
  doc,
  collection,
  addDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { firestore } from "../firebase";
import { getAuth } from "firebase/auth";
import axios from "axios";
import Image from "next/image";
import { RiseLoader } from "react-spinners";

interface ShortenUrlProps {
  open: boolean;
  onClose: (value: boolean) => void;
  refresh: () => void;
}

const ShortenUrlModal = ({ open, onClose, refresh }: ShortenUrlProps) => {
  const auth = getAuth();
  const firestore = getFirestore();
  const [formData, setFormData] = useState({ name: "", longUrl: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name?: string; longUrl?: string }>({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({ name: "", longUrl: "" });
    setErrors({});
    onClose(false);
  };

  const handleSubmit = async () => {
    let newErrors: { name?: string; longUrl?: string } = {};

    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (formData.name.trim().length < 1 || formData.name.trim().length > 15) {
      newErrors.name = "Name should be between 1 and 15 characters";
    }
    if (!urlRegex.test(formData.longUrl.trim().toLowerCase())) {
      newErrors.longUrl = "Enter a valid url";
    }
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return null;

    if (auth.currentUser) {
      const code = nanoid(5);
      setLoading(true);
      let link = {
        name: formData.name.trim(),
        longUrl:
          formData.longUrl.includes("http://") ||
          formData.longUrl.includes("https://")
            ? formData.longUrl
            : `http://${formData.longUrl.trim().toLowerCase()}`,
        createdAt: Timestamp.now(),
        previousCode: code,
        shortCode: code,
        totalClicks: 0,
      };

      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const linksCollectionRef = collection(userDocRef, "links");

      addDoc(linksCollectionRef, link)
        .then((docRef) => {
          refresh();
          handleClose();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
          setLoading(false);
        });
    }
  };

  if (!open) return null;
  return (
    <div
      onClick={handleClose}
      className="fixed h-full w-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-20 p-5"
    >
      <ToastContainer />
      <div
        className="max-w-md w-full flex flex-col gap-5 bg-white p-5 rounded relative z-20"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between">
          <p className="text-black text-lg font-medium">Create short URL</p>
          <IoClose
            size={20}
            className="ml-auto cursor-pointer text-black"
            onClick={handleClose}
          />
        </div>

        <InputField
          name="name"
          label="Name"
          value={formData.name}
          placeholder="Example"
          onChange={handleInput}
          error={errors.name}
        />
        <InputField
          name="longUrl"
          placeholder="https://example.com/my-long-url"
          label="Destination"
          value={formData.longUrl}
          onChange={handleInput}
          error={errors.longUrl}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="py-2 px-3 bg-primary rounded font-medium text-sm text-white"
          >
            {loading ? (
              <Image
                alt="loading"
                src="/spinner.gif"
                height={20}
                width={20}
                className="mx-auto"
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortenUrlModal;
