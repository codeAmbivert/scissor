"use client";
import Image from "next/image";
import SignIn from "./components/SignIn";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { RiseLoader } from "react-spinners";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [openSignIn, setOpenSignIn] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/account");
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <main
      className={`$${poppins.className} bg-primary h-screen p-5 text-white`}
    >
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <RiseLoader color="#fff" />
        </div>
      ) : (
        <>
          <nav className="flex items-center justify-between">
            <p className="text-2xl font-bold">Scissor</p>
            <button className="font-medium" onClick={() => setOpenSignIn(true)}>
              Login/Signup
            </button>
          </nav>
          <div className="flex justify-between items-center h-full">
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col my-auto">
                <h1 className="text-4xl font-semibold">Welcome to Scissor</h1>
                <p className="my-3 text-semibold">
                  Shorten your links and track them with ease
                </p>
                <button
                  onClick={() => setOpenSignIn(true)}
                  className="bg-slate-100 font-semibold rounded-md text-primary px-5 py-2 w-fit mt-5"
                >
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
          </div>

          <SignIn open={openSignIn} onClose={setOpenSignIn} />
        </>
      )}
    </main>
  );
}
