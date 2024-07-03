import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/app/components/header';
import AppBar from '@/app/components/appBar/appBar';
import LogInLogOuButtons from "@/app/components/appBar/loginLogoutButtons";
import { getUser } from '@workos-inc/authkit-nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Registration",
  description: "Help organize the courses you need to register for.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const email = user.user?.email || "";
  return (
    <html lang="en">
      <body className="h-dvh w-full ">
        <AppBar email={email}>
          <LogInLogOuButtons />
        </AppBar>
          {children}
      </body>
    </html>
  );
}
