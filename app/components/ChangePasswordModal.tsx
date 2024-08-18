import { error } from "console";
import { useState } from "react";
import { IoClose, IoEyeOutline } from "react-icons/io5";
import InputField from "./InputField";
import { auth } from "../firebase";
import {
  confirmPasswordReset,
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
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    onClose(false);
  };

  const handleChangePassword = async () => {
    const newErrors = { newPassword: "", confirmPassword: "" };
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match ";
    }
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return null;

    setLoading(true);
    try {
      await reauthenticateUser(formData.currentPassword);
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, formData.newPassword);
        toast.success("Password updated successfully");
        setTimeout(() => {
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setLoading(false);
        }, 2000);
      }
    } catch (error: any) {
      if (error) {
        toast.error(error?.message);
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
            error={errors.newPassword}
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
            error={errors.confirmPassword}
          />
          <button
            disabled={loading}
            onClick={handleChangePassword}
            className="py-2 px-3 bg-primary text-white rounded-lg mt-5"
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
