"use client";
import Link from "next/link";
import { HiChartSquareBar } from "react-icons/hi";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import ShortenUrlModal from "../components/ShortenUrlModal";

const Account = () => {
  const router = useRouter();
  const [createNew, setCreateNew] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => !user && router.push("/"));
  }, []);

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/");
  //   }
  // }, [user]);

  const dummyData = [
    {
      id: "iiwudqwkjcn",
      createdAt: new Date(),
      name: "My website",
      longUrl: "https://www.google.com",
      shortCode: "masdc",
      totalClicks: 313,
    },
    {
      id: "iiwudqwkjcn",
      createdAt: new Date(),
      name: "My website",
      longUrl: "https://www.google.com",
      shortCode: "masdc",
      totalClicks: 313,
    },
    {
      id: "iiwudqwkjcn",
      createdAt: new Date(),
      name: "My website",
      longUrl: "https://www.google.com",
      shortCode: "masdc",
      totalClicks: 313,
    },
    {
      id: "iiwudqwkjcn",
      createdAt: new Date(),
      name: "My website",
      longUrl: "https://www.google.com",
      shortCode: "masdc",
      totalClicks: 313,
    },
  ];

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <main>
      <nav className="p-5 flex justify-between items-center bg-secondary text-white fixed w-full top-0 left-0">
        <p className="text-2xl font-bold">Scissor</p>
        <div>
          <button onClick={() => auth.signOut()}>Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl w-full mx-auto py-10 px-5 mt-20">
        <div className="flex gap-3 items-center">
          <p className="text-xl font-semibold text-secondary">Links</p>
          <button
            onClick={() => setCreateNew(true)}
            className="bg-primary text-white py-2 px-3 font-medium rounded text-sm"
          >
            Create new
          </button>
        </div>

        <div className="mt-10">
          {dummyData.length > 0 &&
            dummyData.map((item, i) => (
              <div
                key={item?.id}
                className={`py-5 flex items-center justify-between ${
                  dummyData.length - 1 !== i && "border-b-2"
                } border-gray-200 gap-10 flex-wrap`}
              >
                <div>
                  <p className="text-gray-500 text-xs uppercase">
                    CREATED AT {format(item?.createdAt, "PPP")}
                  </p>
                  <p className="text-lg font-medium text-secondary mt-2">
                    {item?.name}
                  </p>
                  <Link href={"#"} className="text-sm">
                    {item?.longUrl}
                  </Link>

                  <div className="flex gap-5 items-center mt-3">
                    <p className="text-primary text-sm">
                      {window.location.host}/{item?.shortCode}
                    </p>
                    <button
                      className="border-2 border-primary text-[0.6rem] font-medium rounded-md text-primary py-1 px-3"
                      onClick={() => copyText("mywebsite.com")}
                    >
                      COPY
                    </button>
                    <button
                      className="border-2 border-red-500 text-[0.6rem] font-medium rounded-md text-red-500 py-1 px-3"
                      // onClick={() => copyText("mywebsite.com")}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-secondary">
                      {item?.totalClicks}
                    </p>
                    <HiChartSquareBar size={22} className="text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-xs font-medium">
                    TOTAL CLICKS
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <ShortenUrlModal open={createNew} onClose={setCreateNew} />
    </main>
  );
};

export default Account;
