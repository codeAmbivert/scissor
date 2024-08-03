"use client";

import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { RiseLoader } from "react-spinners";

const Redirect = () => {
  const router = useRouter();
  const { id: shortCode } = useParams();
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchLink = async () => {
    if (typeof shortCode === "string") {
      const docRef = doc(firestore, "links", shortCode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let { longUrl, linkId } = docSnap.data();
        console.log({ longUrl });

        // Query to find all documents with the same longUrl
        const linksQuery = query(
          collection(firestore, "links"),
          where("longUrl", "==", longUrl)
        );
        const linksQuerySnapshot = await getDocs(linksQuery);

        // Create an array of promises to update each document
        const updatePromises = linksQuerySnapshot.docs.map((doc) =>
          updateDoc(doc.ref, {
            totalClicks: increment(1),
          })
        );

        if (auth.currentUser) {
          const userDocRef = doc(
            firestore,
            "users",
            auth.currentUser.uid,
            "links",
            linkId
          );
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            await updateDoc(userDocRef, {
              totalClicks: increment(1),
            });
          } else {
            console.log("error");
          }
        }

        // Wait for all update operations to complete
        await Promise.all(updatePromises);

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

export default Redirect;
