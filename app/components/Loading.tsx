import Image from "next/image";
import { RiseLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="bg-primary min-h-screen flex flex-col items-center justify-center">
      <Image src="/spinner.gif" alt="spinner" width={100} height={100} />
      <p className="text-white font-medium mt-5">Loading...</p>
    </div>
  );
};

export default Loading;
