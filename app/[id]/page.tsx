// Mark the component as a client component
import { firestore } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import Redirect from "../components/Redirect";

// export async function generateStaticParams() {
//   const linksCollectionRef = collection(firestore, "links");
//   const snapshot = await getDocs(linksCollectionRef);
//   console.log(snapshot.docs);

//   const paths = snapshot.docs.map((doc) => ({
//     params: { id: doc.id },
//   }));

//   console.log(paths);
// }

const LinkRedirect = () => {
  return <Redirect />;
};

export default LinkRedirect;
