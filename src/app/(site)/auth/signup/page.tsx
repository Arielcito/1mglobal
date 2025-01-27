import Signup from "@/components/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "One Movement Global - Registro",
  description: "Registro de usuario para One Movement Global",
  // other metadata
};

export default function Register() {
  return (
    <>
      <Signup />
    </>
  );
}
