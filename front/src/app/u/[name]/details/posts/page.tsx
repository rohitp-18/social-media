import React from "react";
import Wrapper from "../_wrapper";
import Post from "@/components/post";
import ProfileCard from "@/components/profileCard";
import FooterS from "@/components/footerS";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Page() {
  return (
    <Wrapper>
      <section className="md:grid grid-cols-[250px_1fr] block mx-auto max-w-7xl min-h-screen gap-6">
        <aside className="md:flex flex-col gap-3 w-full shrink hidden h-min">
          <ProfileCard />
          <Card className="flex flex-col gap-4">
            <CardContent className="flex flex-col gap-1 p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold opacity-90">
                  Following
                </span>
                <span className="text-sm opacity-80">100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold opacity-80">
                  Followers
                </span>
                <span className="text-sm opacity-80">100</span>
              </div>
            </CardContent>
          </Card>
          <FooterS />
        </aside>
        <div className="flex flex-col items-center justify-between mb-5">
          <Post cardClass="w-full lg:mr-5" />
          <Post cardClass="w-full lg:mr-5" />
          <Post cardClass="w-full lg:mr-5" />
        </div>
      </section>
    </Wrapper>
  );
}

export default Page;
