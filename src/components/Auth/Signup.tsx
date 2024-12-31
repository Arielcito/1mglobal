"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import validateEmail from "@/app/libs/validate";
import { useRouter } from 'next/navigation';
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext";

const Signup = () => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const [isPassword, setIsPassword] = useState(false);
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { fullName, email, password } = data;

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      return toast.error("Todos los campos son requeridos");
    }

    try {
      const response = await axios.post("/api/register", {
        name: fullName,
        email,
        password,
      });

      if (response.data) {
        toast.success("Usuario registrado exitosamente");
        
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          console.error("Error al iniciar sesión:", result.error);
          toast.error("Registro exitoso pero hubo un error al iniciar sesión");
          return;
        }

        setData({
          fullName: "",
          email: "",
          password: "",
        });

        router.push('/dashboard');
        toast.success("¡Bienvenido! Has iniciado sesión correctamente");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Ocurrió un error durante el registro");
      }
    }
  };

  const signinWithMail = () => {
    if (!email) {
      return toast.error("Please enter your email address.");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address.");
    } else {
      signIn("email", {
        redirect: false,
        email: email,
      })
        .then((callback) => {
          if (callback?.ok) {
            toast.success("Email sent");
            setData({ ...data, email: "" });
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  return (
    <>
      {/* <!-- ===== SignUp Form Start ===== --> */}
      <section className="pb-[110px] pt-[150px] lg:pt-[220px]">
        <div className="container overflow-hidden lg:max-w-[1250px]">
          <div
            className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-[#F8FAFB] px-6 py-10 shadow-card dark:bg-[#15182A] dark:shadow-card-dark sm:p-[50px]"
            data-wow-delay=".2s"
          >
            <div className="mb-9 flex items-center space-x-3 rounded-md border border-stroke bg-white px-[10px] py-2 dark:border-stroke-dark dark:bg-dark">
              <Link
                href="/auth/signin"
                className="block w-full rounded p-2 text-center text-base font-medium text-black hover:bg-primary hover:text-white dark:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block w-full rounded bg-primary p-2 text-center text-base font-medium text-white hover:bg-opacity-90"
              >
                Sign Up
              </Link>
            </div>

            <div className="text-center">
              <h3 className="mb-[10px] text-2xl font-bold text-black dark:text-white sm:text-[28px]">
                Create your account
              </h3>
              <p className="mb-11 text-base text-body">
                It&apos;s totally free and super easy
              </p>

              <button
                aria-label="sign with google"
                onClick={() => signIn("google")}
                className="mb-6 flex w-full items-center justify-center rounded-md border border-stroke bg-white p-3 text-base font-medium text-body hover:text-primary dark:border-stroke-dark dark:bg-dark"
              >
                <span className="mr-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_72_334)">
                      <path
                        d="M20 10.2216C20.0121 9.53416 19.9397 8.84776 19.7844 8.17725H10.2041V11.8883H15.8276C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2945 14.7577 13.7415 15.1327L13.7219 15.257L16.7512 17.5567L16.9609 17.5772C18.8883 15.8328 19.9996 13.266 19.9996 10.2216"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.204 19.9998C12.959 19.9998 15.272 19.1109 16.9615 17.5775L13.7414 15.133C12.8798 15.722 11.7234 16.1332 10.204 16.1332C8.91366 16.1258 7.65844 15.7203 6.61645 14.9744C5.57445 14.2285 4.7986 13.1799 4.39897 11.9775L4.27938 11.9875L1.12955 14.3764L1.08838 14.4886C1.93671 16.1455 3.23861 17.5384 4.84851 18.5117C6.4584 19.485 8.31283 20.0002 10.2044 19.9998"
                        fill="#34A853"
                      />
                      <path
                        d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.2039 3.86687C11.6661 3.84462 13.0802 4.37827 14.1495 5.35583L17.0294 2.60021C15.1823 0.902092 12.7364 -0.0296414 10.2039 0.000207357C8.31236 -0.000233694 6.45795 0.514977 4.84805 1.48823C3.23816 2.46148 1.93625 3.85441 1.08789 5.51125L4.3875 8.02249C4.79107 6.8203 5.5695 5.77255 6.61303 5.02699C7.65655 4.28143 8.91255 3.87565 10.2039 3.86687Z"
                        fill="#EB4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_72_334">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Sign up with Google
              </button>

              <div className="relative z-10 mb-[30px] flex items-center">
                <span className="hidden h-[1px] w-full max-w-[70px] bg-stroke dark:bg-stroke-dark sm:block"></span>
                <p className="w-full px-5 text-base text-body">
                  Or, sign up with your email
                </p>
                <span className="hidden h-[1px] w-full max-w-[70px] bg-stroke dark:bg-stroke-dark sm:block"></span>
              </div>
            </div>

            <div className="mx-auto mb-12 flex flex-col items-center justify-center gap-1 rounded-lg border border-stroke p-1 dark:border-stroke-dark md:flex-row">
              <button
                className={`w-full rounded-lg px-6 py-3 text-base text-body outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none ${
                  !isPassword &&
                  "border bg-primary/5 text-primary dark:border-primary dark:bg-primary/5"
                }`}
                onClick={() => setIsPassword(false)}
              >
                Magic Link
              </button>
              <button
                className={`w-full rounded-lg px-6 py-3 text-base text-body outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:text-white dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none ${
                  isPassword &&
                  "border bg-primary/5 text-primary dark:border-primary dark:bg-primary/5"
                }`}
                onClick={() => setIsPassword(true)}
              >
                Password
              </button>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className={`${!isPassword ? "" : "hidden"}`}
            >
              <div>
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
                  required
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />

                <div>
                  <button
                    aria-label="login with email and password"
                    className={`mx-auto mt-6 flex items-center justify-center rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-[#2C3149] dark:bg-[#292E45] dark:hover:bg-[#2C3149]`}
                    onClick={signinWithMail}
                  >
                    Send Magic Link
                    <svg
                      className="ml-2.5 fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </form>

            <form
              onSubmit={registerUser}
              className={isPassword ? "" : "hidden"}
            >
              <div className="mb-5">
                <label
                  htmlFor="fullName"
                  className="mb-[10px] block text-sm text-black dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="First and last name"
                  value={data.fullName}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  required
                  className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-[10px] block text-sm text-black dark:text-white"
                >
                  Work Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  required
                  className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-[10px] block text-sm text-black dark:text-white"
                >
                  Your password
                </label>

                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                  }
                  required
                  className="w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-[30px]">
                <label
                  htmlFor="privacy-policy"
                  className="flex cursor-pointer select-none text-base text-body"
                >
                  <input
                    type="checkbox"
                    name="privacy-policy"
                    id="privacy-policy"
                    className="keep-signed sr-only"
                  />
                  <span className="box mr-[10px] mt-[4px] flex h-[22px] w-full max-w-[22px] items-center justify-center rounded-sm border-[.7px] border-stroke bg-white dark:border-stroke-dark dark:bg-black">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon hidden"
                    >
                      <g clipPath="url(#clip0_73_381)">
                        <path
                          d="M6.66649 10.1148L12.7945 3.98608L13.7378 4.92875L6.66649 12.0001L2.42383 7.75742L3.36649 6.81475L6.66649 10.1148Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_73_381">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>

                  <p>
                    By creating account means you agree to the
                    <Link
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Terms and Conditions
                    </Link>
                    , and our
                    <Link
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </label>
              </div>

              <button
                aria-label="signup with email and password"
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary p-3 text-base font-medium text-white hover:bg-opacity-90"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* <!-- ===== SignUp Form End ===== --> */}
    </>
  );
};

export default Signup;
