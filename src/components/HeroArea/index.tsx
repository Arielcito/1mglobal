"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FsLightbox from "fslightbox-react";

const HeroArea = () => {
  const [toggler, setToggler] = useState(false);

  return (
    <>
      <section id="home" className="pt-[165px]">
        <div className="container lg:max-w-[1305px] lg:px-10">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-7/12">
              <div
                className="wow fadeInUp mb-12 lg:mb-0 lg:max-w-[570px]"
                data-wow-delay=".3s"
              >
                <span className="mb-5 block text-lg font-medium leading-tight text-black dark:text-white sm:text-[22px] xl:text-[22px]">
                Crafted for App, Software and SaaS Sites
                </span>
                <h1 className="mb-6 text-3xl font-bold leading-tight text-black dark:text-white sm:text-[40px] md:text-[50px] lg:text-[42px] xl:text-[50px]">
                Next.js Template and SaaS
                  <span className="inline bg-gradient-1 bg-clip-text text-transparent">
                    {" "}
                    Starter Kit{" "}
                  </span>
                  Site.
                </h1>
                <p className="mb-10 max-w-[475px] text-base leading-relaxed text-body">
                Website template and starter kit crafted to build fully functional mobile app landing pages and software websites.
                </p>

                <div className="flex flex-wrap items-center">
                  <Link
                    href="#"
                    className="mb-6 mr-6 inline-flex h-[60px] items-center rounded-lg bg-black px-[30px] py-[14px] text-white hover:bg-opacity-90 dark:bg-white dark:text-black dark:hover:bg-opacity-90"
                  >
                    <span className="mr-[18px] border-r border-stroke border-opacity-40 pr-[18px] leading-relaxed dark:border-[#BDBDBD]">
                      Download Now
                    </span>
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_3_3641)">
                          <path
                            d="M11.624 7.2221C10.748 7.2221 9.392 6.2261 7.964 6.2621C6.08 6.2861 4.352 7.3541 3.38 9.0461C1.424 12.4421 2.876 17.4581 4.784 20.2181C5.72 21.5621 6.824 23.0741 8.288 23.0261C9.692 22.9661 10.22 22.1141 11.924 22.1141C13.616 22.1141 14.096 23.0261 15.584 22.9901C17.096 22.9661 18.056 21.6221 18.98 20.2661C20.048 18.7061 20.492 17.1941 20.516 17.1101C20.48 17.0981 17.576 15.9821 17.54 12.6221C17.516 9.8141 19.832 8.4701 19.94 8.4101C18.62 6.4781 16.592 6.2621 15.884 6.2141C14.036 6.0701 12.488 7.2221 11.624 7.2221ZM14.744 4.3901C15.524 3.4541 16.04 2.1461 15.896 0.850098C14.78 0.898098 13.436 1.5941 12.632 2.5301C11.912 3.3581 11.288 4.6901 11.456 5.9621C12.692 6.0581 13.964 5.3261 14.744 4.3901Z"
                            fill="currentColor"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_3_3641">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                  </Link>

                  <Link
                    href="#"
                    onClick={() => setToggler(!toggler)}
                    className="glightbox mb-6 inline-flex items-center py-4 text-black hover:text-primary dark:text-white dark:hover:text-primary"
                  >
                    <span className="mr-[22px] flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-current">
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.5 7.06367C14.1667 7.44857 14.1667 8.41082 13.5 8.79572L1.5 15.7239C0.833334 16.1088 -3.3649e-08 15.6277 0 14.8579L6.05683e-07 1.00149C6.39332e-07 0.231693 0.833334 -0.249434 1.5 0.135466L13.5 7.06367Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span className="text-base font-medium">
                      <span className="block text-sm"> Watch Demo </span>
                      See how it works
                    </span>
                  </Link>

                  <FsLightbox
                    toggler={toggler}
                    sources={[
                      "https://www.youtube.com/watch?v=HXHphpDJ9T0&pp=ygULaW50cm8gdmlkZW8%3D",
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-5/12">
              <div
                className="wow fadeInUp relative z-10 mx-auto w-full max-w-[530px] pt-8 lg:mr-0"
                data-wow-delay=".3s"
              >
                <Image
                  width={361}
                  height={546}
                  src={"/images/hero/hero-light.png"}
                  alt="hero image"
                  className="mx-auto max-w-full"
                />
                <div className="max-auto absolute left-0 right-0 top-0 -z-10 aspect-square w-full rounded-full bg-gradient-1">
                  <div className="absolute right-0 top-5">
                    <svg
                      width="72"
                      height="51"
                      viewBox="0 0 72 51"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_5_3665)">
                        <path
                          d="M22.378 0.4157C22.3814 0.342879 22.3851 0.270712 22.3891 0.199219C22.3857 0.271606 22.382 0.343766 22.378 0.4157C22.0401 7.83785 25.7079 22.0514 43.163 21.2025C36.0333 21.7022 21.9045 26.7677 22.3875 43.0291C22.1659 35.9367 17.5749 21.9221 1.00683 21.8442C0.856728 21.8465 0.709534 21.8469 0.56543 21.8454C0.713499 21.8439 0.86063 21.8435 1.00683 21.8442C8.04005 21.7355 21.4537 17.3609 22.378 0.4157Z"
                          fill="#7083F5"
                        />
                        <path
                          d="M59.3487 24.4888C59.3506 24.4451 59.3528 24.4018 59.3552 24.3589C59.3532 24.4023 59.351 24.4456 59.3487 24.4888C59.1459 28.942 61.3466 37.4702 71.8196 36.9608C67.5418 37.2606 59.0645 40.3 59.3543 50.0568C59.2213 45.8014 56.4667 37.3926 46.5259 37.3459C46.4359 37.3473 46.3475 37.3475 46.261 37.3466C46.3499 37.3457 46.4382 37.3454 46.5259 37.3459C50.7458 37.2807 58.794 34.6559 59.3487 24.4888Z"
                          fill="#19DEBB"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_5_3665">
                          <rect
                            width="71.2541"
                            height="49.8779"
                            fill="white"
                            transform="translate(0.56543 0.199219)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="absolute bottom-10 left-0">
                    <svg
                      width="65"
                      height="36"
                      viewBox="0 0 65 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M55.4149 1.83203C53.339 1.57898 51.3475 2.4214 49.2904 4.18456C45.9052 7.08611 40.0313 8.52953 34.7368 4.19769C32.4686 2.34195 30.4917 2.04856 28.8583 2.32079C27.1672 2.60264 25.7448 3.50424 24.6267 4.24961C22.8559 5.43014 20.9059 6.67067 18.66 6.9618C16.3417 7.2623 13.8664 6.54246 11.0465 4.19256C8.68539 2.22501 6.66504 1.84655 5.11312 2.08531C3.52522 2.32961 2.288 3.24185 1.57603 4.08328C1.25719 4.46008 0.69326 4.50708 0.316454 4.18824C-0.0603521 3.86941 -0.107346 3.30548 0.21149 2.92867C1.13803 1.83367 2.73868 0.642115 4.84131 0.318626C6.97991 -0.0103986 9.50274 0.579362 12.1908 2.81939C14.7333 4.93815 16.7266 5.40998 18.4302 5.18915C20.2062 4.95894 21.831 3.96513 23.6352 2.76234L24.131 3.50597L23.6352 2.76234C24.7515 2.01814 26.4572 0.908837 28.5644 0.557635C30.7295 0.196804 33.2212 0.648204 35.8687 2.81426C40.3566 6.48615 45.2562 5.28815 48.1272 2.82739C50.3886 0.889088 52.8657 -0.279434 55.6312 0.057691C58.3691 0.391448 61.1615 2.17558 64.1309 5.60179C64.4541 5.9748 64.4138 6.53924 64.0408 6.86252C63.6678 7.18579 63.1034 7.14547 62.7801 6.77246C59.9402 3.49563 57.5184 2.08846 55.4149 1.83203Z"
                        fill="#F76D8D"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M55.4149 11.2026C53.339 10.9496 51.3475 11.792 49.2904 13.5552C45.9052 16.4567 40.0312 17.9001 34.7367 13.5683C32.4686 11.7126 30.4916 11.4192 28.8583 11.6914C27.1671 11.9732 25.7447 12.8748 24.6267 13.6202C22.8559 14.8007 20.9058 16.0413 18.66 16.3324C16.3417 16.6329 13.8663 15.9131 11.0464 13.5632C8.68536 11.5956 6.66501 11.2172 5.11309 11.4559C3.52519 11.7002 2.28797 12.6125 1.576 13.4539C1.25716 13.8307 0.69323 13.8777 0.316424 13.5588C-0.0603826 13.24 -0.107377 12.6761 0.211459 12.2993C1.138 11.2043 2.73865 10.0127 4.84128 9.68923C6.97988 9.36021 9.50271 9.94997 12.1907 12.19C14.7333 14.3088 16.7266 14.7806 18.4302 14.5598C20.2061 14.3295 21.831 13.3357 23.6352 12.1329L24.1309 12.8766L23.6352 12.1329C24.7515 11.3887 26.4572 10.2794 28.5644 9.92824C30.7294 9.56741 33.2212 10.0188 35.8686 12.1849C40.3565 15.8568 45.2562 14.6588 48.1271 12.198C50.3885 10.2597 52.8657 9.09117 55.6312 9.4283C58.3691 9.76205 61.1614 11.5462 64.1308 14.9724C64.4541 15.3454 64.4138 15.9098 64.0408 16.2331C63.6678 16.5564 63.1033 16.5161 62.7801 16.1431C59.9401 12.8662 57.5184 11.4591 55.4149 11.2026Z"
                        fill="#F76D8D"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M55.4149 20.5825C53.339 20.3295 51.3475 21.1719 49.2904 22.935C45.9052 25.8366 40.0312 27.28 34.7367 22.9482C32.4686 21.0924 30.4916 20.7991 28.8583 21.0713C27.1671 21.3531 25.7447 22.2547 24.6267 23.0001C22.8559 24.1806 20.9058 25.4212 18.66 25.7123C16.3417 26.0128 13.8663 25.293 11.0464 22.9431C8.68536 20.9755 6.66501 20.597 5.11309 20.8358C3.52519 21.0801 2.28797 21.9923 1.576 22.8338C1.25716 23.2106 0.69323 23.2576 0.316424 22.9387C-0.0603826 22.6199 -0.107377 22.056 0.211459 21.6792C1.138 20.5842 2.73865 19.3926 4.84128 19.0691C6.97988 18.7401 9.50271 19.3299 12.1907 21.5699C14.7333 23.6886 16.7266 24.1605 18.4302 23.9396C20.2061 23.7094 21.831 22.7156 23.6352 21.5128L24.1309 22.2565L23.6352 21.5128C24.7515 20.7686 26.4572 19.6593 28.5644 19.3081C30.7294 18.9473 33.2212 19.3987 35.8686 21.5647C40.3565 25.2366 45.2562 24.0386 48.1271 21.5779C50.3885 19.6396 52.8657 18.4711 55.6312 18.8082C58.3691 19.1419 61.1614 20.9261 64.1308 24.3523C64.4541 24.7253 64.4138 25.2897 64.0408 25.613C63.6678 25.9363 63.1033 25.896 62.7801 25.523C59.9401 22.2461 57.5184 20.8389 55.4149 20.5825Z"
                        fill="#F76D8D"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M55.4149 29.9619C53.339 29.7089 51.3475 30.5513 49.2904 32.3144C45.9052 35.216 40.0312 36.6594 34.7367 32.3276C32.4686 30.4718 30.4916 30.1784 28.8583 30.4507C27.1671 30.7325 25.7447 31.6341 24.6267 32.3795C22.8559 33.56 20.9058 34.8006 18.66 35.0917C16.3417 35.3922 13.8663 34.6723 11.0464 32.3224C8.68536 30.3549 6.66501 29.9764 5.11309 30.2152C3.52519 30.4595 2.28797 31.3717 1.576 32.2132C1.25716 32.59 0.69323 32.637 0.316424 32.3181C-0.0603826 31.9993 -0.107377 31.4354 0.211459 31.0586C1.138 29.9635 2.73865 28.772 4.84128 28.4485C6.97988 28.1195 9.50271 28.7092 12.1907 30.9493C14.7333 33.068 16.7266 33.5399 18.4302 33.319C20.2061 33.0888 21.831 32.095 23.6352 30.8922L24.1309 31.6359L23.6352 30.8922C24.7515 30.148 26.4572 29.0387 28.5644 28.6875C30.7294 28.3267 33.2212 28.7781 35.8686 30.9441C40.3565 34.616 45.2562 33.418 48.1271 30.9573C50.3885 29.019 52.8657 27.8504 55.6312 28.1876C58.3691 28.5213 61.1614 30.3055 64.1308 33.7317C64.4541 34.1047 64.4138 34.6691 64.0408 34.9924C63.6678 35.3157 63.1033 35.2754 62.7801 34.9023C59.9401 31.6255 57.5184 30.2183 55.4149 29.9619Z"
                        fill="#F76D8D"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroArea;
