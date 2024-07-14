"use client";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { RiseLoader } from "react-spinners";

const LinkRedirect = () => {
  const { id: shortCode } = useParams();
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchLink = async () => {
    // Assuming 'firestore' is your initialized Firestore instance
    const docRef = doc(firestore, "links", shortCode as string);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let { longUrl } = docSnap.data();
      // console.log("Document data:", link);
      if (!/^https?:\/\//i.test(longUrl)) {
        // If not, prepend http:// to the URL
        longUrl = `http://${longUrl}`;
      }
      router.push(longUrl);
    } else {
      console.log("No such document!");
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchLink();
  }, []);

  return (
    <main>
      {initialLoad ? (
        <div className="min-h-screen flex items-center justify-center">
          <RiseLoader color="#56B7BA" />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          Invalid Link
        </div>
      )}
    </main>
  );
};

export default LinkRedirect;
