import React from "react";
import ResetPassword from "@/components/Auth/ResetPassword";

const ResetPasswordPage = ({ params }: { params: { token: string } }) => {
  return <ResetPassword/>;
};

export default ResetPasswordPage;
