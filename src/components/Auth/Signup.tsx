"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import validateEmail from "@/app/libs/validate";
import { useRouter } from 'next/navigation';
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Eye, EyeOff } from 'lucide-react';
import api from "@/services/api";

const Signup = () => {
  const { user, isLoading: authLoading, login } = useAuth()
  const router = useRouter()
  const { toast } = useToast();

  if (authLoading) {
    return <div>Loading...</div>
  }

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { username, email, password, confirmPassword } = data;

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push("al menos 8 caracteres");
    if (!hasUpperCase) errors.push("una mayúscula");
    if (!hasLowerCase) errors.push("una minúscula");
    if (!hasNumbers) errors.push("un número");
    if (!hasSpecialChar) errors.push("un carácter especial");

    return errors;
  };

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos son requeridos"
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "El formato del email no es válido"
      });
      setIsLoading(false);
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: `La contraseña debe contener ${passwordErrors.join(", ")}`
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Las contraseñas no coinciden"
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/users", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        toast({
          title: "¡Registro exitoso!",
          description: "Usuario registrado correctamente"
        });
        
        try {
          await login(email, password);
          
          setData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente"
          });
          router.push('/dashboard');
        } catch (loginError) {
          console.error("Error al iniciar sesión:", loginError);
          toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: "Registro exitoso pero hubo un error al iniciar sesión"
          });
          router.push('/auth/signin');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error;
        
        switch (error.response?.status) {
          case 400:
            toast({
              variant: "destructive",
              title: "Error de validación",
              description: errorMessage || "Los datos proporcionados no son válidos"
            });
            break;
          case 409:
            toast({
              variant: "destructive",
              title: "Error de registro",
              description: errorMessage || "El usuario ya existe"
            });
            break;
          case 422:
            toast({
              variant: "destructive",
              title: "Error de validación",
              description: errorMessage || "Error de validación en los datos"
            });
            break;
          case 500:
            toast({
              variant: "destructive",
              title: "Error del servidor",
              description: errorMessage || "Error interno del servidor"
            });
            break;
          default:
            toast({
              variant: "destructive",
              title: "Error",
              description: errorMessage || "Ocurrió un error durante el registro"
            });
        }

        console.error("Error de registro:", {
          status: error.response?.status,
          message: errorMessage,
          data: error.response?.data
        });
      } else {
        console.error("Error inesperado:", error);
        toast({
          variant: "destructive",
          title: "Error inesperado",
          description: "Ocurrió un error inesperado durante el registro"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pb-[110px] pt-[100px] md:pt-[150px] lg:pt-[200px] bg-background">
      <div className="container overflow-hidden lg:max-w-[1250px]">
        <div className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-black px-6 py-10 shadow-card-dark sm:p-[10px] flex flex-col items-center">
          <Image src={"/images/logo/logo-white.png"} alt="Logo" width={173} height={34} />
          <Link
            href="https://1mglobal.net"
            className="mb-6 mt-4 inline-flex items-center gap-2 text-primary hover:underline"
            aria-label="Volver a la página principal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Volver a la página principal
          </Link>

          <div className="text-center">
            <h3 className="mb-[10px] text-2xl font-bold text-white sm:text-[28px]">
              Crea tu cuenta
            </h3>
            <p className="mb-11 text-base text-gray-400">
              Regístrate para acceder a la plataforma
            </p>
          </div>

          <form onSubmit={registerUser} className="w-full">
            <div className="mb-5">
              <label
                htmlFor="username"
                className="mb-[10px] block text-sm text-white"
              >
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Ingresa tu nombre de usuario"
                value={data.username}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                required
                className="w-full rounded-md border border-stroke-dark bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-[10px] block text-sm text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ingresa tu email"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, [e.target.name]: e.target.value })
                }
                required
                className="w-full rounded-md border border-stroke-dark bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="mb-[10px] block text-sm text-white"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  required
                  className="w-full rounded-md border border-stroke-dark bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="mb-[10px] block text-sm text-white"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  value={data.confirmPassword}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  required
                  className="w-full rounded-md border border-stroke-dark bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-[30px]">
              <label
                htmlFor="terms"
                className="flex cursor-pointer select-none items-center text-sm text-gray-400"
              >
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="sr-only peer"
                  required
                />
                <span className="mr-[10px] flex h-5 w-5 items-center justify-center rounded border border-stroke-dark peer-checked:border-primary">
                  <svg
                    className={`h-3 w-3 text-primary ${
                      acceptTerms ? 'block' : 'hidden'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                Acepto los{" "}
                <Link href="/terms" className="ml-1 text-primary hover:underline">
                  Términos y Condiciones
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-primary p-3 text-base font-medium text-white hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Procesando...</span>
                </div>
              ) : (
                "Crear cuenta"
              )}
            </button>

            <p className="mt-4 text-center text-sm text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
