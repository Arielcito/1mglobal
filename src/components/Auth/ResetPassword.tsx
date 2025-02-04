"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import api from "@/app/libs/axios";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/password-reset/validate/${token}`);
        setIsValidToken(res.data.valid);
      } catch (error) {
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.newPassword || !data.confirmPassword) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await api.post("/api/password-reset/reset", {
        token,
        newPassword: data.newPassword,
      });

      toast.success("Contraseña actualizada exitosamente");
      setData({ newPassword: "", confirmPassword: "" });
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-body">Validando token...</p>
        </div>
      </div>
    );
  }

  if (!token || !isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">
            Enlace Inválido
          </h3>
          <p className="text-body">
            El enlace de restablecimiento es inválido o ha expirado.
            <br />
            Por favor, solicita un nuevo enlace.
          </p>
        </div>
      </div>
    );
  }

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
                placeholder="Ingresa tu nueva contraseña"
                value={data.newPassword}
                onChange={(e) =>
                  setData({ ...data, newPassword: e.target.value })
                }
                className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
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
                placeholder="Confirma tu nueva contraseña"
                value={data.confirmPassword}
                onChange={(e) =>
                  setData({ ...data, confirmPassword: e.target.value })
                }
                className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary p-3 text-base font-medium text-white hover:bg-opacity-90"
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;