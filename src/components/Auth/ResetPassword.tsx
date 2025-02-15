"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import api from "@/app/libs/axios";
import { useRouter } from "next/navigation";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword = ({ token }: ResetPasswordProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!data.newPassword || !data.confirmPassword) {
      toast.error("Por favor, complete todos los campos.");
      setIsLoading(false);
      return;
    }

    if (data.newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      setIsLoading(false);
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/api/users/password/reset", {
        token,
        newPassword: data.newPassword,
      });

      toast.success("Contraseña actualizada exitosamente");
      setData({ newPassword: "", confirmPassword: "" });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("El enlace ha expirado o no es válido. Por favor, solicita uno nuevo.");
        } else if (error.response?.status === 500) {
          toast.error("Error al actualizar la contraseña. Por favor, intenta más tarde.");
        } else {
          toast.error(error.response?.data?.message || "Error al procesar la solicitud");
        }
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pb-[110px] pt-[150px] lg:pt-[220px]">
      <div className="container overflow-hidden lg:max-w-[1250px]">
        <div className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-[#F8FAFB] px-6 py-10 shadow-card dark:bg-[#15182A] dark:shadow-card-dark sm:p-[50px]">
          <div className="text-center">
            <h3 className="mb-[10px] text-2xl font-bold text-black dark:text-white sm:text-[28px]">
              Restablecer Contraseña
            </h3>
            <p className="mb-11 text-base text-body">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="newPassword"
                className="mb-[10px] block text-sm text-black dark:text-white"
              >
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Ingresa tu nueva contraseña"
                value={data.newPassword}
                onChange={(e) =>
                  setData({ ...data, newPassword: e.target.value })
                }
                className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="confirmPassword"
                className="mb-[10px] block text-sm text-black dark:text-white"
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirma tu nueva contraseña"
                value={data.confirmPassword}
                onChange={(e) =>
                  setData({ ...data, confirmPassword: e.target.value })
                }
                className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-primary p-3 text-base font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;