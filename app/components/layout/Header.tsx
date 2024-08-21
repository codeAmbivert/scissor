import { useEffect, useState } from "react";
import SignIn from "../SignIn";
import { Nunito } from "next/font/google";
import { auth } from "../../firebase";
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import ChangePasswordModal from "../ChangePasswordModal";
import Link from "next/link";

const nunito = Nunito({
  subsets: ["latin"],
  // weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const Header = () => {
  const [openSignIn, setOpenSignIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [openUser, setOpenUser] = useState<boolean>(false);
  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  return (
    <nav className={`${nunito.className} p-5 py-8 z-[200]`}>
      <div className={` max-w-7xl mx-auto flex items-center justify-between`}>
        <Link href="/" className="text-3xl font-bold">
          Cutt.live
        </Link>
        {user ? (
          <div>
            <FaRegCircleUser
              size={30}
              className="cursor-pointer"
              onClick={() => setOpenUser(true)}
            />

            <div
              className={`fixed top-0 left-0 h-full w-full p-5 ${
                openUser ? "block" : "hidden"
              }`}
              onClick={() => setOpenUser(false)}
            >
              <div className="flex justify-end pt-12">
                <div className="w-52 bg-white p-2 rounded-xl border flex flex-col">
                  <button
                    className="text-black text-start p-3 hover:bg-indigo-400 rounded-lg hover:text-white flex gap-1 items-center"
                    onClick={() => setOpenChangePassword(true)}
                  >
                    Change Password
                  </button>
                  <button
                    className="text-black text-start p-3 hover:bg-indigo-400 rounded-lg hover:text-white flex gap-1 items-center"
                    onClick={() => auth.signOut()}
                  >
                    Logout <IoLogOutOutline size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="font-medium py-3 px-8 rounded-md text-white bg-primary"
            onClick={() => setOpenSignIn(true)}
          >
            Login
          </button>
        )}
      </div>
      <SignIn open={openSignIn} onClose={setOpenSignIn} />
      <ChangePasswordModal
        open={openChangePassword}
        onClose={setOpenChangePassword}
      />
    </nav>
  );
};

export default Header;
