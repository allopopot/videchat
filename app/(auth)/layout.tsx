import { AuthUserProvider } from "@/context/AuthUserContext";
import { SupabaseProvider } from "@/context/SupabaseContext";
import "../globals.css";
export const metadata = {
  title: "VideChat",
  description: "VideChat",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden w-full h-screen grid grid-rows-[3.5rem_1fr] bg-green-500 text-white">
        <SupabaseProvider>
          <AuthUserProvider>
            <Navbar></Navbar>
            {children}
          </AuthUserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
