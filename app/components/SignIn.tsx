import { Input } from "postcss";
import { IoClose } from "react-icons/io5";
import InputField from "./InputField";
import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

interface SignInProps {
  open: boolean;
  onClose: (value: boolean) => void;
}

const SignIn = ({ open, onClose }: SignInProps) => {
  const router = useRouter();
  const [signIn, setSignIn] = useState<boolean>(true);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = auth.currentUser;
      if (user) {
        toast.success("Signed in successfully");
        console.log(user);
      }
      router.push("/account");
    } catch (err) {
      if (err instanceof Error) {
        // Type guard to narrow down the type
        toast.error(err.message);
        console.log(err);
      } else {
        // Handle the case where the error is not an instance of Error
        console.log("An unexpected error occurred", err);
      }
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = auth.currentUser;
      if (user) {
        toast.success("User created successfully");
        console.log(user);
        localStorage.setItem("scissorUser", JSON.stringify(user));
      }
    } catch (err) {
      if (err instanceof Error) {
        // Type guard to narrow down the type
        toast.error(err.message);
        console.log(err);
      } else {
        // Handle the case where the error is not an instance of Error
        console.log("An unexpected error occurred", err);
      }
    }
  };

  if (!open) return null;
  return (
    <div className="fixed h-full w-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-20 p-5">
      <ToastContainer />
      <div className="max-w-md w-full flex flex-col gap-5 bg-white p-5 rounded">
        <div className="flex justify-between">
          <p className="text-black text-lg font-medium">
            {signIn ? "Sign in" : "Sign up"}
          </p>
          <IoClose
            size={20}
            className="ml-auto cursor-pointer text-black"
            onClick={() => onClose(false)}
          />
        </div>

        <InputField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleInput}
        />
        <InputField
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleInput}
        />
        <div className="flex justify-between items-end ">
          <div className="text-black text-sm">
            {signIn && (
              <button onClick={() => setSignIn(false)}>
                Don&apos;t have an account?
              </button>
            )}
            {!signIn && (
              <button onClick={() => setSignIn(true)}>
                Already have an account?
              </button>
            )}
          </div>

          <div>
            {signIn && (
              <button
                onClick={handleSignIn}
                className="py-2 px-3 bg-primary rounded font-medium text-sm"
              >
                Sign in
              </button>
            )}
            {!signIn && (
              <button
                onClick={handleSignUp}
                className="py-2 px-3 bg-primary rounded font-medium text-sm"
              >
                Sign up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
