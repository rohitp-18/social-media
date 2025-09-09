import React, { Fragment, useEffect } from "react";
import FooterS from "../footerS";
import { Card, CardContent } from "../ui/card";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { Separator } from "../ui/separator";
import ProjectCard from "../projectCard";
import { searchProjects } from "@/store/search/allSearchSlice";

function ProjectSearch({
  selectValues,
  setSelectValues,
}: {
  selectValues: any;
  setSelectValues: (val: any) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const { projects } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    dispatch(searchProjects({ q: selectValues.query, ...selectValues }));
    console.log(selectValues);
  }, [selectValues]);
  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      {projects.length > 0 ? (
        <div>
          <Card className="flex flex-col w-full gap-3 overflow-auto">
            <CardContent className="flex flex-col gap-2 py-5">
              {projects.map((project: any, i: number) => (
                <Fragment key={project._id}>
                  <ProjectCard
                    project={project}
                    isUser={user?._id === project.user._id}
                    showUser={true}
                    username={project.user.username}
                  />
                  {i < projects.length - 1 && <Separator className="my-1" />}
                </Fragment>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Card className="flex flex-col items-center justify-center w-full min-h-[400px] gap-4">
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  No projects found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  We couldn't find any projects matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
              </div>
              {Object.keys(selectValues).length > 1 && (
                <button
                  onClick={() => setSelectValues({ query: selectValues.query })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Filters
                </button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <aside>
        <FooterS />
      </aside>
    </section>
  );
}

export default ProjectSearch;
