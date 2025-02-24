"use client";

import Link from "next/link";
import { HiChartSquareBar } from "react-icons/hi";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, firestore } from "../firebase";
import ShortenUrlModal from "../components/ShortenUrlModal";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
} from "firebase/firestore";
import Image from "next/image";
import { toast } from "react-toastify";
import { LuCopy } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import UpdateShortCode from "../components/UpdateShortCode";
import Loading from "../components/Loading";
import Layout from "../components/layout/Layout";


interface Link {
  id: string;
  name: string;
  longUrl: string;
  createdAt: Timestamp;
  shortCode: string;
  totalClicks: number;
}

const Account = () => {
  const router = useRouter();
  const [createNew, setCreateNew] = useState<boolean>(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [qrOverlay, setQrOverlay] = useState<boolean>(false);
  const [qrId, setQrId] = useState<string>("");
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState({
    name: "",
    id: "",
    currentCode: "",
  });

  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => !user && router.push("/"));
  // }, [auth]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const fetchLinks = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const linksCollectionRef = collection(userDocRef, "links");
      const q = query(linksCollectionRef);

      try {
        const querySnapshot = await getDocs(q);
        const links: Link[] = [];
        querySnapshot.forEach((doc) => {
          const linkData = doc.data();
          const link: Link = {
            id: doc.id,
            name: linkData.name, // Assuming doc.data() contains a 'name' property
            longUrl: linkData.longUrl, // Assuming doc.data() contains a 'longUrl' property
            createdAt: linkData.createdAt, // Assuming doc.data() contains a 'createdAt' property
            shortCode: linkData.shortCode, // Assuming doc.data() contains a 'shortCode' property
            totalClicks: linkData.totalClicks, // Assuming doc.data() contains a 'totalClicks' property
          };
          links.push(link);
        });
        setLinks(links);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    } else {
      console.error("User not logged in");
      // Handle the case when the user is not logged in, e.g., set links to an empty array or show a message
    }
  };

  const handleDelete = async (linkId: string, linkName: string) => {
    if (window.confirm(`Are you sure you want to delete ${linkName}`)) {
      if (auth.currentUser) {
        const userDocRef = doc(firestore, "users", auth.currentUser.uid);
        const linkDocRef = doc(userDocRef, "links", linkId);
        deleteDoc(linkDocRef)
          .then((docRef) => {
            toast.success("Link deleted successfully");
            setTimeout(() => {
              fetchLinks();
            }, 1000);
          })
          .catch((error) => {
            console.error("Error deleting document: ", error);
          });
      }
    }
  };

  const downloadImage = async (url: string, name: string) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = response.data;
      const objectUrl = URL.createObjectURL(blob);

      // Trigger the download
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${name} qr code`; // Set the name of the downloaded file
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading image: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      } else {
        fetchLinks();
        setLoading(false); // Set loading to false when a user is found
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [auth, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="max-w-7xl w-full mx-auto py-10 px-5 sm:px-10 mt-20 shadow-xl min-h-screen">
        <div className="flex gap-3 items-center">
          <p className="text-2xl font-semibold text-secondary">Links</p>
          <button
            onClick={() => setCreateNew(true)}
            className="bg-primary text-white py-2 px-3 font-medium rounded "
          >
            Create new
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-5 sm:gap-10 h-full">
          {links.length > 0 ? (
            links
              .sort(
                (prvLink, nxtLink) =>
                  nxtLink.createdAt.toDate().getTime() -
                  prvLink.createdAt.toDate().getTime()
              )
              .map((item, i) => (
                <div key={item?.id} className={`p-5 rounded-xl bg-[#F7F9FB]`}>
                  <div className="flex items-center justify-between flex-wrap">
                    <div>
                      <p className="text-gray-500 text-[0.65rem] font-semibold uppercase">
                        CREATED AT{" "}
                        {format(item?.createdAt.toDate(), "d MMM, HH:mm")}
                      </p>
                      <p className="text-xl font-semibold text-secondary mt-2 capitalize">
                        {item?.name}
                      </p>
                      <div className="flex gap-5">
                        <p className="font-light max-w-[16rem] overflow-hidden overflow-ellipsis">
                          {item?.longUrl}
                        </p>
                      </div>

                      <div className="flex gap-5 items-center mt-3">
                        <Link
                          href={`/${item?.shortCode}`}
                          target="_blank"
                          className="text-primary"
                        >
                          {window.location.host}/{item?.shortCode}
                        </Link>
                        <button
                          title="Copy"
                          className="border-2 border-primary font-medium rounded-md text-primary py-1 px-2"
                          onClick={() =>
                            copyText(
                              `${window.location.host}/${item?.shortCode}`
                            )
                          }
                        >
                          <LuCopy size={10} />
                        </button>
                        <button
                          title="Copy"
                          className="border-2 border-blue-500 font-medium rounded-md text-blue-500 py-1 px-2"
                          onClick={() => {
                            setOpenEdit(true);
                            setEditData({
                              name: item?.name,
                              id: item?.id,
                              currentCode: item?.shortCode,
                            });
                          }}
                        >
                          <MdOutlineEdit size={10} />
                        </button>
                      </div>
                    </div>
                    <div className="flex sm:flex-col sm:items-center gap-5 mt-3 sm:mt-0 sm:gap-0">
                      <div
                        onClick={() =>
                          downloadImage(
                            `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${window.location.host}/${item?.shortCode}`,
                            item?.name
                          )
                        }
                        title="Click to download"
                        className="cursor-pointer overflow-hidden relative"
                        onMouseEnter={() => {
                          setQrId(item?.id);
                          setQrOverlay(true);
                        }}
                        onMouseLeave={() => {
                          setQrId("");
                          setQrOverlay(false);
                        }}
                      >
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.host}/${item?.shortCode}`}
                          alt="QR Code"
                          height={100}
                          width={100}
                        />
                        <div
                          className={`absolute bg-primary bg-opacity-75 top-0 left-0 h-full w-full flex justify-center items-center transform duration-75 ${
                            qrOverlay && qrId == item?.id
                              ? "translate-y-0"
                              : "-translate-y-full"
                          }`}
                        >
                          <IoCloudDownloadOutline size={40} color="#fff" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-secondary mt-3">
                          <p className="font-medium">{item?.totalClicks}</p>
                          <HiChartSquareBar size={22} />
                          <button
                            title="Delete"
                            className="border-2 border-red-700 font-medium rounded-md text-red-700 py-1 px-2 ml-auto"
                            onClick={() => handleDelete(item?.id, item?.name)}
                          >
                            <FaRegTrashAlt size={10} />
                          </button>
                        </div>
                        <p className="text-xs font-medium mb-2">TOTAL CLICKS</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center">
              <Image src="/empty.svg" alt="Empty" width={200} height={200} />
              <p className="mt-10 text-xl font-semibold">No Links Yet</p>
            </div>
          )}
        </div>
      </div>

      <ShortenUrlModal
        open={createNew}
        onClose={setCreateNew}
        refresh={fetchLinks}
      />
      <UpdateShortCode
        open={openEdit}
        onClose={setOpenEdit}
        name={editData?.name}
        id={editData?.id}
        currentCode={editData?.currentCode}
        refresh={fetchLinks}
      />
    </Layout>
  );
};

export default Account;
