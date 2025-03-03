"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ResetPassword from "@/components/Auth/ResetPassword";

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="pb-[110px] pt-[150px] lg:pt-[220px]">
        <div className="container overflow-hidden lg:max-w-[1250px]">
          <div className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-[#F8FAFB] px-6 py-10 shadow-card dark:bg-[#15182A] dark:shadow-card-dark sm:p-[50px]">
            <div className="text-center">
              <h3 className="mb-[10px] text-2xl font-bold text-black dark:text-white sm:text-[28px]">
                Error
              </h3>
              <p className="mb-11 text-base text-body">
                No se proporcionó un token válido para restablecer la contraseña
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ResetPassword token={token} />;
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage; 