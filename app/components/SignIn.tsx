import { IoClose, IoEyeOutline } from "react-icons/io5";
import InputField from "./InputField";
import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { LuEyeOff } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";

interface SignInProps {
  open: boolean;
  onClose: (value: boolean) => void;
}

const SignIn = ({ open, onClose }: SignInProps) => {
  const router = useRouter();
  const [signIn, setSignIn] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [pwrdVisible, setPwrdVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({});
  };

  const handleSignIn = async () => {
    let newErrors: { email?: string; password?: string } = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return null;

    if (signIn) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = auth.currentUser;
        if (user) {
          toast.success("Signed in successfully");
        }
        router.push("/account");
      } catch (err) {
        if (err instanceof Error) {
          // Type guard to narrow down the type
          toast.error(err.message);
          // console.log(err);
        } else {
          // Handle the case where the error is not an instance of Error
          console.log("An unexpected error occurred", err);
        }
        setLoading(false);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: "Passwords do not match" });
        return null;
      }
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = auth.currentUser;
        if (user) {
          toast.success("User created successfully");
        }
        router.push("/account");
      } catch (err) {
        if (err instanceof Error) {
          // Type guard to narrow down the type
          toast.error(err.message);
          // console.log(err);
        } else {
          // Handle the case where the error is not an instance of Error
          console.log("An unexpected error occurred", err);
        }
        setLoading(false);
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
            onClick={() => {
              setFormData({ email: "", password: "", confirmPassword: "" });
              onClose(false);
            }}
          />
        </div>

        <InputField
          name="email"
          label="Email"
          placeholder="use@example.com"
          value={formData.email}
          error={errors.email}
          onChange={handleInput}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="********"
          type={pwrdVisible ? "text" : "password"}
          endIcon={
            !pwrdVisible ? (
              <button onClick={() => setPwrdVisible(true)}>
                <IoEyeOutline />
              </button>
            ) : (
              <button onClick={() => setPwrdVisible(false)}>
                <LuEyeOff />
              </button>
            )
          }
          value={formData.password}
          error={errors.password}
          onChange={handleInput}
        />
        {/* {signIn && (
          <Link href="/forgot-password" className="underline text-start w-fit">
            Forgot password?
          </Link>
        )} */}

        {!signIn && (
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="********"
            type={pwrdVisible ? "text" : "password"}
            endIcon={
              !pwrdVisible ? (
                <button onClick={() => setPwrdVisible(true)}>
                  <IoEyeOutline />
                </button>
              ) : (
                <button onClick={() => setPwrdVisible(false)}>
                  <LuEyeOff />
                </button>
              )
            }
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleInput}
          />
        )}
        <div className="flex justify-between items-end">
          <div className="text-black text-sm">
            {signIn && (
              <div className="cursor-pointer" onClick={() => setSignIn(false)}>
                Don&apos;t have an account?{" "}
                <span className="font-medium text-primary text-start whitespace-nowrap">
                  Sign up
                </span>
              </div>
            )}
            {!signIn && (
              <div className="cursor-pointer" onClick={() => setSignIn(true)}>
                Already have an account?{" "}
                <span className="font-medium text-primary text-start whitespace-nowrap">
                  Sign in
                </span>
              </div>
            )}
          </div>

          <div>
            {signIn && (
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="py-2 px-3 bg-primary rounded font-medium text-sm text-white"
              >
                {loading ? (
                  <Image
                    alt="loading"
                    src="/spinner.gif"
                    height={20}
                    width={20}
                  />
                ) : (
                  "Sign in"
                )}
              </button>
            )}
            {!signIn && (
              <button
                disabled={loading}
                onClick={handleSignIn}
                className="py-2 px-3 bg-primary rounded font-medium text-sm text-white"
              >
                {loading ? (
                  <Image
                    alt="loading"
                    src="/spinner.gif"
                    height={20}
                    width={20}
                  />
                ) : (
                  "Sign up"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
