"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { firestore } from "../firebase";
import {
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";

const Redirect = () => {
  const router = useRouter();
  const { id: shortCode } = useParams();
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchLinkDoc = async (): Promise<void> => {
    if (typeof shortCode !== "string") {
      setInitialLoad(false);
      return;
    }

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
          await updateDoc(userLinkDocRef, {
            totalClicks: increment(1),
          });
          window.open(new URL(longUrl).toString(), "_blank");
          router.back();
        }
      } else {
        setInitialLoad(false);
      }
    } catch (error) {
      console.error("Error fetching link document:", error);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (shortCode) {
      fetchLinkDoc();
    }
  }, [shortCode]);

  return (
    <main>
      {initialLoad ? (
        <div className="bg-primary min-h-screen flex flex-col items-center justify-center">
          <Image src="/spinner.gif" alt="spinner" width={100} height={100} />
          <p className="text-white font-medium mt-5">Redirecting...</p>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center gap-10">
          <Image src="not_found.svg" width={200} height={200} alt="Not found" />
          Link is not valid
        </div>
      )}
    </main>
  );
};

export default Redirect;
