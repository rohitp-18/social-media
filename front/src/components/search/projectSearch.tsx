import React, { Fragment, useEffect } from "react";
import FooterS from "../footerS";
import { Card, CardContent } from "../ui/card";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Separator } from "../ui/separator";
import ProjectCard from "../projectCard";
import { searchProjects } from "@/store/search/allSearchSlice";

function ProjectSearch({ setType, selectValues }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const { projects } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    // dispatch(searchProjects({ q: selectValues.query, ...selectValues }));
    console.log(selectValues);
  }, [selectValues]);
  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      <div>
        <Card className="flex flex-col w-full gap-3 overflow-auto">
          <CardContent className="flex flex-col gap-2 py-5">
            {projects.map((project: any, i: number) => (
              <Fragment key={project._id}>
                <ProjectCard
                  project={project}
                  isUser={user?._id === project.user._id}
                  setType={setType}
                  showUser={true}
                  username={project.user.username}
                />
                {i < projects.length - 1 && <Separator className="my-1" />}
              </Fragment>
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

export default ProjectSearch;
