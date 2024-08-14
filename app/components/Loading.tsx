import Image from "next/image";

const Loading = () => {
  return (
    <div className="bg-primary min-h-screen flex flex-col items-center justify-center">
      <Image src="/spinner.gif" alt="spinner" className="hello" width={100} height={100} />
      <p className="text-white font-medium mt-5">Loading...</p>
    </div>
  );
};

export default Loading;
