"use client";
import { useParams, useRouter } from "next/navigation"; // Corrected import
import { useEffect, useState } from "react";
import { firestore } from "../firebase"; // Removed unused import 'auth'
import {
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { RiseLoader } from "react-spinners";
// Removed unused import 'toast' from "react-toastify";

const LinkRedirect = () => {
  const router = useRouter();
  const {id:shortCode} = useParams(); // Corrected way to access dynamic route parameter
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchLink = async () => {
    if (typeof shortCode === "string") { // Ensure shortCode is a string
      const docRef = doc(firestore, "links", shortCode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let { longUrl, linkId, userUid } = docSnap.data();

        const userDocRef = doc(firestore, "users", userUid);
        const linkDocRef = doc(userDocRef, "links", linkId);
        await updateDoc(linkDocRef, {
          totalClicks: increment(1), // Assuming you want to increment by 1
        });

        router.push(longUrl);
      } else {
        console.log("No such document!");
        setInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    if (shortCode) {
      fetchLink();
    }
  }, [shortCode]);

  return (
    <main>
      {initialLoad ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <RiseLoader color="#56B7BA" />
          <p className="text-secondary mt-5">Redirecting</p>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          Link is invalid
        </div>
      )}
    </main>
  );
};

export default LinkRedirect;