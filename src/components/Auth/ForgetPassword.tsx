"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import validateEmail from "@/app/libs/validate";
import api from "@/app/libs/axios";

const ForgetPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!data.email) {
      toast.error("Por favor, ingrese su correo electrónico.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(data.email)) {
      toast.error("Por favor, ingrese un correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/users/password/request-reset", {
        email: data.email
      });

      toast.success("Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña.");
      setData({ email: "" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("No existe una cuenta con este correo electrónico.");
        } else if (error.response?.status === 500) {
          toast.error("Error al enviar el correo electrónico. Por favor, intenta más tarde.");
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
    <>
      {/* <!-- ===== Formulario de Inicio de Sesión Start ===== --> */}
      <section className="pb-[110px] pt-[150px] lg:pt-[220px]">
        <div className="container overflow-hidden lg:max-w-[1250px]">
          <div
            className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-[#F8FAFB] px-6 py-10 shadow-card dark:bg-[#15182A] dark:shadow-card-dark sm:p-[50px]"
            data-wow-delay=".2s"
          >
            <div className="text-center">
              <h3 className="mb-[10px] text-2xl font-bold text-black dark:text-white sm:text-[28px]">
                ¿Olvidaste tu Contraseña?
              </h3>

              <p className="mb-11 text-base text-body">
                Ingresa el correo electrónico asociado a tu cuenta y
                te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-[10px] block text-sm text-black dark:text-white"
                >
                  Tu Correo Electrónico
                </label>

                <input
                  type="email"
                  id="email"
                  placeholder="Ingresa tu correo electrónico"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-primary p-3 text-base font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Enviando..." : "Enviar Enlace de Restablecimiento"}
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* <!-- ===== Formulario de Inicio de Sesión End ===== --> */}
    </>
  );
};

export default ForgetPassword;
