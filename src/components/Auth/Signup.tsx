"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useSession } from "next-auth/react";

interface ValidationErrors {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup = () => {
  const router = useRouter();
  const { status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return null;
  }

  const validateForm = (): ValidationErrors | null => {
    const errors: ValidationErrors = {};
    
    // Validación del nombre
    if (!data.name.trim()) {
      errors.name = "El nombre es obligatorio";
    } else if (data.name.length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.name)) {
      errors.name = "El nombre solo puede contener letras";
    }

    // Validación del apellido
    if (!data.lastName.trim()) {
      errors.lastName = "El apellido es obligatorio";
    } else if (data.lastName.length < 2) {
      errors.lastName = "El apellido debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.lastName)) {
      errors.lastName = "El apellido solo puede contener letras";
    }

    // Validación del email
    if (!data.email) {
      errors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "El formato del email no es válido";
    }

    // Validación de la contraseña
    if (!data.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (data.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/(?=.*[a-z])/.test(data.password)) {
      errors.password = "La contraseña debe contener al menos una letra minúscula";
    } else if (!/(?=.*[A-Z])/.test(data.password)) {
      errors.password = "La contraseña debe contener al menos una letra mayúscula";
    } else if (!/(?=.*\d)/.test(data.password)) {
      errors.password = "La contraseña debe contener al menos un número";
    }

    // Validación de confirmación de contraseña
    if (!data.confirmPassword) {
      errors.confirmPassword = "Debe confirmar la contraseña";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const validationErrors = validateForm();
      if (validationErrors) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${data.name.trim()} ${data.lastName.trim()}`,
          email: data.email,
          password: data.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error en el registro');
      }

      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente"
      });
      
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (signInResult?.error) {
        throw new Error('Error al iniciar sesión automáticamente');
      }

      router.push('/dashboard');
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Ocurrió un error inesperado. Por favor, intente nuevamente"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente con Google"
        });
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Error al iniciar sesión con Google"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pb-[110px] pt-[50px] md:pt-[150px] lg:pt-[100px] bg-background">
      <div className="container overflow-hidden lg:max-w-[1250px]">
        <div className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-black px-6 py-10 shadow-card-dark sm:p-[10px] flex flex-col items-center">
          <Image src={"/images/logo/logo-white.png"} alt="Logo" width={173} height={34} />
          <div className="text-center">
            <h3 className="mb-[10px] text-2xl font-bold text-white sm:text-[28px]">
              Crea tu cuenta
            </h3>
            <p className="mb-11 text-base text-gray-400">
              Regístrate para comenzar
            </p>
          </div>

          <form onSubmit={handleSignup} className="w-full">
            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-[10px] block text-sm text-white"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                placeholder="Ingresa tu nombre"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className={`w-full rounded-md border ${
                  errors.name ? 'border-red-500' : 'border-stroke-dark'
                } bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input`}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="lastName"
                className="mb-[10px] block text-sm text-white"
              >
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Ingresa tu apellido"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                className={`w-full rounded-md border ${
                  errors.lastName ? 'border-red-500' : 'border-stroke-dark'
                } bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input`}
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1 text-sm text-red-500">
                  {errors.lastName}
                </p>
              )}
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
                placeholder="Ingresa tu email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className={`w-full rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-stroke-dark'
                } bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="mb-[10px] block text-sm text-white"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="Crea tu contraseña"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className={`w-full rounded-md border ${
                  errors.password ? 'border-red-500' : 'border-stroke-dark'
                } bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label
                htmlFor="confirmPassword"
                className="mb-[10px] block text-sm text-white"
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirma tu contraseña"
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                className={`w-full rounded-md border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-stroke-dark'
                } bg-black px-6 py-3 text-base font-medium text-white outline-none focus:border-primary focus:shadow-input`}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              aria-label="Crear cuenta"
              className="flex w-full justify-center rounded-md bg-primary p-3 text-base font-medium text-white hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="sr-only" aria-live="polite">Cargando...</span>
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                "Crear Cuenta"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-base text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
                aria-label="Iniciar sesión con cuenta existente"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
