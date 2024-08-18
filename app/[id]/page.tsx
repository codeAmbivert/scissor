"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import Image from "next/image";
import Layout from "../components/layout/Layout";

const Redirect = () => {
  const router = useRouter();
  const { id: shortCode } = useParams();
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchLinkDoc = async (): Promise<void> => {
    if (typeof shortCode === "string") {
      try {
        const linkDocRef = doc(firestore, "links", shortCode);
        const linkDoc = await getDoc(linkDocRef);
        if (linkDoc.exists()) {

          const data = linkDoc.data();
          if (data) {
            const { longUrl, linkID, userUid } = data;
            const userLinkDocRef = doc(
              firestore,
              "users",
              userUid,
              "links",
              linkID
            );
            try {
              await updateDoc(userLinkDocRef, {
                totalClicks: increment(1),
              });

              router.push(longUrl);
            } catch (updateError) {
              console.error("Error updating document:", updateError);
            }
          }
        } else {
          setInitialLoad(false);
        }
      } catch (error) {
        console.error("Error fetching link document:", error);
        setInitialLoad(false);
      }
    } else {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchLinkDoc();
  }, [shortCode]);

  if (initialLoad) {
    return (
      <div className="bg-primary min-h-screen flex flex-col items-center justify-center">
        <Image src="/spinner.gif" alt="spinner" width={100} height={100} />
        <p className="text-white font-medium mt-5">Redirecting...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-10">
        <Image src="not_found.svg" width={200} height={200} alt="Not found" />
        Link is either not available or not valid.
      </div>
    </Layout>
  );
};

export default Redirect;
