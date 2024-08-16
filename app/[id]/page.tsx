"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import Image from "next/image";

const Redirect = () => {
  const router = useRouter();
  const { id: shortCode } = useParams();
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchLinkDoc = async (): Promise<void> => {
    console.log("try0");
    if (typeof shortCode === "string") {
      console.log("try1");
      try {
        const linkDocRef = doc(firestore, "links", shortCode);
        const linkDoc = await getDoc(linkDocRef);
        console.log(linkDoc);
        if (linkDoc.exists()) {
          console.log("try2");

          const data = linkDoc.data();
          console.log({ data });
          if (data) {
            console.log("try3");
            const { longUrl, linkID, userUid } = data;
            console.log("data", longUrl, linkID, userUid);
            const userLinkDocRef = doc(
              firestore,
              "users",
              userUid,
              "links",
              linkID
            );
            try {
              console.log("try4");
              await updateDoc(userLinkDocRef, {
                totalClicks: increment(1),
              });

              router.push(longUrl);
            } catch (updateError) {
              console.error("Error updating document:", updateError);
            }
          }
          // console.log({ shortCode });
        } else {
          setInitialLoad(false);
          console.log("failed1");
        }
      } catch (error) {
        console.log("failed2");
        // console.log({ shortCode });
        console.error("Error fetching link document:", error);
        setInitialLoad(false);
      }
    } else {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    // if (typeof shortCode !== "string") {
    fetchLinkDoc();
    console.log("shorty", typeof shortCode);
    // }
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
