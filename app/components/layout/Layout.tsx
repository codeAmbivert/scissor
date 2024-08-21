import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Header from "./Header";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const bgClass = pathname === "/account" ? "bg-primary text-white" : "";

  return (
    <div>
      <ToastContainer />
      <div className={`${bgClass} fixed top-0 left-0 w-full z-[200]`}>
        <Header />
      </div>
      <main className="mt-28">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
