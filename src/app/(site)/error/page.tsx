import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 Error | Appline Tailwind App Landing Template",
  description: "This is Error page for Apline Pro",
  // other metadata
};

const ErrorPage = () => {
  return (
    <section className="pb-[110px] pt-[150px] lg:pt-[220px]">
      <div className="container overflow-hidden lg:max-w-[1250px]">
        <div className="mx-auto w-full max-w-[570px]">
          <div className="wow fadeInUp mb-8 w-full" data-wow-delay=".2s">
            <Image
              src="/images/404/404.svg"
              alt="404"
              className="mx-auto max-w-full"
              width={505}
              height={138}
            />
          </div>

          <div className="wow fadeInUp text-center" data-wow-delay=".2s">
            <h2 className="mb-[18px] text-[28px] font-bold text-black dark:text-white sm:text-[35px]">
              Sorry, the page can&apos;t be found
            </h2>
            <p className="mb-[30px] text-base font-medium text-body sm:text-lg">
              The page you were looking for appears to have been moved, deleted
              or does not exist.
            </p>

            <Link
              href="/"
              className="inline-flex justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-white hover:bg-opacity-90"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
