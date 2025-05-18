import React from "react";
import FooterS from "../footerS";
import { Card, CardContent } from "../ui/card";
import Post from "../post";

function PostSearch() {
  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      <div className="">
        <Card className="flex flex-col w-full gap-3 overflow-auto">
          <CardContent className="flex flex-col gap-2 py-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Post key={i} cardClass="w-full" post={{}} />
            ))}
          </CardContent>
        </Card>
      </div>
      <aside>
        <FooterS />
      </aside>
    </section>
  );
}

export default PostSearch;
