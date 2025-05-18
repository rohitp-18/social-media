"use client";

import Navbar from "@/components/userNavbar";
import IntroNavbar from "@/components/introNavbar";
import React, { PropsWithChildren } from "react";
import RecommendUser from "@/components/recommend/recommendUser";
import YouMayKnow from "@/components/recommend/YouMayKnow";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Wrapper(props: PropsWithChildren) {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      {user ? <Navbar /> : <IntroNavbar />}

      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto px-3">
          {/* <section className="flex mx-auto max-w-7xl justify-center gap-2"> */}
          <section className="md:grid lg:grid-cols-[1fr_320px] grid-cols-[1fr_280px] block mx-auto max-w-7xl min-h-screen gap-3">
            <section className="min-h-screen max-w-[860px] overflow-hidden w-full flex flex-col gap-5 flex-grow-0">
              {props.children}
            </section>
            <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
              <RecommendUser />
              <YouMayKnow />
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export default Wrapper;
