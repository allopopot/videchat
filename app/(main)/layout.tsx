import "../globals.css";
import { AuthUserProvider } from "@/context/AuthUserContext";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { PeerProvider } from "@/context/PeerContext";
import ContactList from "@/components/ContactList";


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
            <PeerProvider>
              <Navbar></Navbar>
              <div className="w-full h-full overflow-hidden">
                <ContactList></ContactList>
                {children}
              </div>
            </PeerProvider>
          </AuthUserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
