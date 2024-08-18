"use client";
import Image from "next/image";
import SignIn from "./components/SignIn";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";
import { Revalia } from "next/font/google";
import Loading from "./components/Loading";
import Layout from "./components/layout/Layout";

const revalia = Revalia({
  subsets: ["latin"],
  weight: ["400"],
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
  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="p-5 max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
            <div className="flex flex-col my-auto max-w-2xl ">
              <h1 className={`${revalia.className} text-4xl font-extrabold`}>
                Strengthen your digital connection with cutt.live
              </h1>
              <p className="my-3 text-semibold ">
                Utilize our URL shortener and QR Codes to engage your audience
                and direct them to the right information. Create, edit, and
                monitor all your links seamlessly within the Cutt.live
                Connections Platform
              </p>
              <button
                onClick={() => setOpenSignIn(true)}
                className="bg-slate-100 font-semibold rounded-md text-primary px-5 py-2 w-fit mt-5"
              >
                Get Started
              </button>
            </div>
            <Image
              src="/short-try.svg"
              width={500}
              height={500}
              alt="Barber"
              className="hidden md:block mx-auto"
            />
          </div>
        </div>
      </div>
      <SignIn open={openSignIn} onClose={setOpenSignIn} />
    </Layout>
  );
}
