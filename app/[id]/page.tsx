"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import Image from "next/image";

const Redirect = () => {
  const router = useRouter();
  const { id: shortCode } = useParams();
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchLink = async () => {
    try {
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
              console.log("User document does not exist");
            }
          } else {
            console.log("User is not authenticated");
          }

          // Wait for all update operations to complete
          await Promise.all(updatePromises);

          router.push(longUrl);
        } else {
          console.log("Document does not exist");
        }
      }
    } catch (error: any) {
      console.error("Error fetching document: ", error);
      if (error.code === "permission-denied") {
        console.log("Missing or insufficient permissions");
      }
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchLink();
  }, [shortCode]);

  // if (initialLoad) {
  //   return <RiseLoader />;
  // }

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
