"use client";
import Image from "next/image";
import SignIn from "./components/SignIn";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [openSignIn, setOpenSignIn] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user]);

  return  <main className="bg-primary min-h-screen p-5 text-white">
  <nav className="flex items-center justify-between">
    <p className="text-2xl font-bold">Scissor</p>
    <button className="font-medium" onClick={() => setOpenSignIn(true)}>
      Login/Signup
    </button>
  </nav>
  <div className="flex justify-between items-center h-full">
    <div className="flex flex-col">
      <h1 className="text-4xl font-medium text-center">
        Welcome to Scissor
      </h1>
      <p className="text-center my-3">
        Shorten your links and track them with ease
      </p>
      <button className="bg-white text-primary px-5 py-2 w-fit mt-5">
        Get Started
      </button>
    </div>
    <Image
      src="/barber.svg"
      width={500}
      height={500}
      alt="Barber"
      className="hidden md:block"
    />
  </div>

  <SignIn open={openSignIn} onClose={setOpenSignIn} />
</main> ;
}
