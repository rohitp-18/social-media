"use client";

import React from "react";
import RecommendCompany from "../recommend/recommendCompany";
import RecommendUser from "../recommend/recommendUser";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Navbar from "../userNavbar";
import IntroNavbar from "../introNavbar";

function CompanyWrapper(props: {
  children: React.ReactNode;
  sectionClassName?: string;
  section2ClassName?: string;
  asideClassName?: string;
}) {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      {user ? <Navbar /> : <IntroNavbar />}
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto px-3">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section
            className={
              "md:grid lg:grid-cols-[1fr_320px] grid-cols-[1fr_280px] block mx-auto max-w-7xl min-h-screen gap-3 " +
              props.sectionClassName
            }
          >
            <section
              className={
                "min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0 " +
                props.section2ClassName
              }
            >
              {props.children}
            </section>
            <aside
              className={
                "md:flex flex-col gap-3 w-full shrink hidden h-min " +
                (props.asideClassName || "")
              }
            >
              <RecommendCompany />
              <RecommendUser />
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export default CompanyWrapper;
