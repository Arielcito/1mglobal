import type { Metadata } from "next";
import Signin from "@/components/Auth/Signin";
export const metadata: Metadata = {
  title: "1MomentGlobal",
  description: "1MomentGlobal is a platform for creating and sharing moments with your friends and family.",
};
export default function Home() {
  return (
    <>
      <Signin />
    </>
  );
}
