// import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });
const nunito = Nunito({
  subsets: ["latin"],
  // weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// export const metadata: Metadata = {
//   title: "Cutt.live",
//   description: "Shorten your url links with ease",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Cutt.live</title>
        <meta name="description" content="Shorten your url links with ease" />
      </head>
      <body className={`${nunito.className} font-medium`}>{children}</body>
    </html>
  );
}
