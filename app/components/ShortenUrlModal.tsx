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
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { firestore } from "../firebase";
import { getAuth } from "firebase/auth";
import axios from "axios";
import Image from "next/image";

interface ShortenUrlProps {
  open: boolean;
  onClose: (value: boolean) => void;
  refresh: () => void;
}

const ShortenUrlModal = ({ open, onClose, refresh }: ShortenUrlProps) => {
  const [formData, setFormData] = useState({ name: "", longUrl: "" });
  const firestore = getFirestore();
  const [img, setImg] = useState<string | null>(null);
  const auth = getAuth();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log("nanoid", nanoid(5));

  const handleClose = () => {
    setFormData({ name: "", longUrl: "" });
    onClose(false);
  };

  const handleSubmit = async () => {
    let link = {
      name: formData.name,
      longUrl:
        formData.longUrl.includes("http://") ||
        formData.longUrl.includes("https://")
          ? formData.longUrl
          : `http://${formData.longUrl}`,
      createdAt: Timestamp.now(),
      shortCode: nanoid(5),
      totalClicks: 0,
    };

    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const linksCollectionRef = collection(userDocRef, "links");

      addDoc(linksCollectionRef, link)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          refresh();
          handleClose();
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }

    // const resp = await firestore.collection("links").add(link);
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
          onChange={handleInput}
        />
        <InputField
          name="longUrl"
          label="Long URL"
          value={formData.longUrl}
          onChange={handleInput}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="py-2 px-3 bg-primary rounded font-medium text-sm text-white"
          >
            Create short URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortenUrlModal;
