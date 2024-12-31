"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const ResetPassword = ({ token }: { token: string }) => {
  const [data, setData] = useState({
    password: "",
  });
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState({
    email: "",
  });

  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post(`/api/forget-password/verify-token`, {
          token,
        });

        if (res.status === 200) {
          setUser({
            email: res.data.email,
          });
          setVerified(true);
        }
      } catch (error) {
        // @ts-ignore
        toast.error(error.response.data);
        router.push("/auth/forget-password");
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (data.password === "") {
      toast.error("Please enter your password.");
      return;
    }

    try {
      const res = await axios.post(`/api/forget-password/update`, {
        email: user?.email,
        password: data.password,
      });

      if (res.status === 200) {
        toast.success(res.data);
        setVerified(true);
        setData({ password: "" });
        router.push("/auth/signin");
      }
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data);
    }
  };

  return (
    <>
      {/* <!-- ===== SignIn Form Start ===== --> */}
      <section className="pb-[110px] pt-[150px] lg:pt-[220px]">
        <div className="container overflow-hidden lg:max-w-[1250px]">
          <div
            className="wow fadeInUp mx-auto w-full max-w-[520px] rounded-lg bg-[#F8FAFB] px-6 py-10 shadow-card dark:bg-[#15182A] dark:shadow-card-dark sm:p-[50px]"
            data-wow-delay=".2s"
          >
            <div className="text-center">
              <h3 className="mb-[10px] text-2xl font-bold text-black dark:text-white sm:text-[28px]">
                pdate Password
              </h3>

              <p className="mb-11 text-base text-body">
                Enter your new password
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="mb-[10px] block text-sm text-black dark:text-white"
                >
                  Your Password
                </label>
                <input
                  type="text"
                  placeholder="Password"
                  name="password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  required
                  className={`w-full rounded-md border border-stroke bg-white px-6 py-3 text-base font-medium text-body outline-none focus:border-primary focus:shadow-input dark:border-stroke-dark dark:bg-black dark:text-white dark:focus:border-primary`}
                />
              </div>

              <button
                aria-label="login with email and password"
                className={`hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho mx-auto mt-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out ${
                  error.length > 0 || !data.password
                    ? "bg-gray-600"
                    : "bg-black  "
                }`}
                type="submit"
              >
                Save Password
                <svg
                  className="fill-white"
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

              {error.length > 0 && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      </section>
      {/* <!-- ===== SignIn Form End ===== --> */}
    </>
  );
};

export default ResetPassword;
