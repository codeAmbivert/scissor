import { error } from "console";
import { useState } from "react";
import { IoClose, IoEyeOutline } from "react-icons/io5";
import InputField from "./InputField";
import { auth } from "../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import { LuEyeOff } from "react-icons/lu";

interface PasswoedModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
}

export const reauthenticateUser = (currentPassword: string) => {
  const user = auth.currentUser;
  if (user && user.email) {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return reauthenticateWithCredential(user, credential);
  }
  return Promise.reject(new Error("No user is currently signed in."));
};

const ChangePasswordModal = ({ open, onClose }: PasswoedModalProps) => {
  const [pwrdVisible, setPwrdVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name);
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors("");
  };

  const handleClose = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors("");
    onClose(false);
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await reauthenticateUser(formData.currentPassword);
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, formData.newPassword);
        toast.success("Password updated successfully");
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error:any) {
      console.log("code1", error?.code);
      if (error) {
        if (error?.code === "auth/wrong-password") {
          toast.error("Error updating password: Wrong password");
        } else {
          toast.error("Error updating password: Try again later");
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
  };

  if (!open) return null;
  return (
    <>
      <ToastContainer />
      <div
        onClick={handleClose}
        className="fixed h-full w-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-20 p-5"
      >
        <div
          className="max-w-md w-full flex flex-col gap-5 bg-white p-5 rounded relative z-20"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex justify-between">
            <p className="text-black text-lg font-medium">Change Password</p>
            <IoClose
              size={20}
              className="ml-auto cursor-pointer text-black"
              onClick={handleClose}
            />
          </div>

          <InputField
            name="currentPassword"
            label="Current Password"
            value={formData.currentPassword}
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
            onChange={handleInput}
          />
          <InputField
            name="newPassword"
            label="New Password"
            value={formData.newPassword}
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
            onChange={handleInput}
          />
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
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
            onChange={handleInput}
            error={errors}
          />
          <button
            disabled={loading}
            onClick={handleChangePassword}
            className="p-2 bg-primary text-white rounded-lg mt-5"
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
              "Change Password"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordModal;
