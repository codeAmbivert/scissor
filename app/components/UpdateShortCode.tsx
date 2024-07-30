import { Input } from "postcss";
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
  updateDoc,
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
  name: string;
  id: string;
  refresh: () => void;
}

const UpdateShortCode = ({
  open,
  onClose,
  name,
  id,
  refresh,
}: ShortenUrlProps) => {
  const auth = getAuth();
  const firestore = getFirestore();
  const [newCode, setNewCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCode(e.target.value);
    setErrors("");
  };
  console.log("nanoid", nanoid(5));

  const handleClose = () => {
    setNewCode("");
    setErrors("");
    onClose(false);
  };

  const handleSubmit = async () => {
    let newErrors: { name?: string; longUrl?: string } = {};

    if (auth.currentUser) {
      setLoading(true);

      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const linksCollectionRef = collection(userDocRef, "links");

      try {
        const linkDocRef = doc(linksCollectionRef, id);
        await updateDoc(linkDocRef, {
          shortCode: newCode.replace(/\s+/g, ""),
        });
        toast.success("Short Code updated successfully");
        refresh();
        handleClose();
      } catch (error) {
        toast.error("Error updating short code");
      } finally {
        setLoading(false);
      }
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
          <p className="text-black text-lg font-medium">
            Update {name}&apos;s short URL
          </p>
          <IoClose
            size={20}
            className="ml-auto cursor-pointer text-black"
            onClick={handleClose}
          />
        </div>

        {/* <InputField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleInput}
          error={errors.name}
        /> */}
        <InputField
          name="longUrl"
          label="Short URL"
          value={newCode}
          onChange={handleInput}
          error={errors}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="py-2 px-3 bg-primary rounded font-medium text-sm text-white"
          >
            {loading ? (
              <RiseLoader size={5} color="#FFFFFF" />
            ) : (
              "Update short URL"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateShortCode;
