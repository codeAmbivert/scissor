"use client";
import Image from "next/image";
import SignIn from "../components/SignIn";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { Nunito, Revalia } from "next/font/google";
import {
  fetchSignInMethodsForEmail,
  getAuth,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import InputField from "../components/InputField";

const revalia = Revalia({
  subsets: ["latin"],
  weight: ["400"],
});
const nunito = Nunito({
  subsets: ["latin"],
  // weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const forgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, formData.email);
      console.log("Password reset email sent successfully.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({});
  };

  const checkUserExists = async (email: string) => {
    try {
      await fetchSignInMethodsForEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const sendResetEmail = async () => {
    try {
      const userExists = await checkUserExists(formData.email);
      if (!userExists) {
        setErrors({ email: "User does not exist" });
        return;
      }
      await sendPasswordResetEmail(auth, formData.email);
      console.log("Password reset email sent successfully.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const handleSendEmail = async () => {
    let newError: { email?: string } = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      newError.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newError.email = "Email is not valid";
    }
    setErrors(newError);

    if (Object.keys(newError).length === 0) {
      sendResetEmail();
    }
  };

  return (
    <main className={`${nunito.className} min-h-screen p-5`}>
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between">
          <p className="text-3xl font-bold">Cutt.live</p>
          {/* <button
            className="font-medium py-3 px-8 rounded-md text-white bg-primary"
            onClick={() => setOpenSignIn(true)}
          >
            Login
          </button> */}
        </nav>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="max-w-xl w-full p-5 sm:p-10 border rounded-lg flex flex-col gap-5">
            <p className="text-2xl">Forgot Password</p>
            <InputField
              label="Enter Email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              error={errors.email}
            />
            <button
              onClick={handleSendEmail}
              disabled={loading}
              className="py-2 px-3 bg-primary rounded font-medium text-sm text-white"
            >
              Send Code
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
