import React, { Fragment, use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RecommendCompany from "../recommend/recommendCompany";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ArrowRight,
  User2,
  Briefcase,
  Users,
  Building2,
  Folder,
} from "lucide-react";
import { Button } from "../ui/button";
import Post from "../post";
import FooterS from "../footerS";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import { getAllSearch } from "@/store/search/allSearchSlice";
import { Separator } from "../ui/separator";
import { toggleFollow } from "@/store/user/userSlice";
import Link from "next/link";
import JobSearchCard from "./jobSearchCard";
import { toast } from "sonner";
import { toggleJoinRequest } from "@/store/group/groupSlice";
import { toggleFollowCompany } from "@/store/company/companySlice";
import { timeAgo } from "@/lib/functions";
import ProjectSearchCard from "./projectSearchCard";
import GroupSearchCard from "./groupSearchCard";
import CompanySearchCard from "./companySearchCard";
import RecommendUser from "../recommend/recommendUser";

function All({ setType, selectValues }: any) {
  const [jobs, setJobs] = useState<any[]>([]);

  const params = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    peoples,
    companies,
    posts,
    projects,
    groups,
    jobs: AllJobs,
    loading,
  } = useSelector((state: RootState) => state.search);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const query = params.get("q");
    if (query) {
      dispatch(getAllSearch(query));
    }
  }, [params, dispatch]);

  useEffect(() => {
    setJobs(AllJobs);
  }, [AllJobs]);

  return (
    <section className="md:grid block lg:grid-cols-[200px_1fr_300px] md:grid-cols-[1fr_300px] w-full gap-4">
      <aside className="h-min lg:block hidden">
        <Card className="sticky  top-[70px] left-0">
          <CardHeader>
            <CardTitle>On this Page</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-2">
            <nav className="flex flex-col gap-1">
              {[
                { id: "people", label: "People", icon: User2 },
                { id: "posts", label: "Posts", icon: ArrowRight },
                {
                  id: "jobs",
                  label: "Jobs",
                  icon: Briefcase,
                },
                {
                  id: "groups",
                  label: "Groups",
                  icon: Users,
                },
                {
                  id: "companies",
                  label: "Companies",
                  icon: Building2,
                },
                {
                  id: "projects",
                  label: "Projects",
                  icon: Folder,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 px-2 py-1 rounded transition-colors hover:bg-secondary hover:text-primary text-foreground text-sm font-medium border border-transparent hover:border-primary"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="ml-1">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </CardContent>
        </Card>
        <div className="md:block hidden">
          <FooterS />
        </div>
      </aside>

      {!loading && (
        <div className="flex flex-col w-full gap-6">
          <Card id="people">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User2 className="w-5 h-5" />
                <CardTitle>People</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {peoples.length > 0 ? (
                <>
                  {peoples.map((people, i: number) => (
                    <Fragment key={people._id}>
                      <div className="flex justify-between my-2 items-start">
                        <Link
                          href={`/u/${people.username}`}
                          className="flex justify-start items-start gap-3"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={people.avatar?.url} />
                            <AvatarFallback>
                              <User2 className="w-8 h-8 p-1.5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col max-w-96">
                            <span className="font-semibold">{people.name}</span>
                            <span className="text-sm opacity-80 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
                              {people.headline}
                            </span>
                            {people.location && (
                              <span className="opacity-60 text-[13px]">
                                {`${
                                  people.location.city
                                    ? people.location.city + ", "
                                    : ""
                                }${
                                  people.location.state
                                    ? people.location.state + ", "
                                    : ""
                                }${
                                  people.location.country
                                    ? people.location.country
                                    : ""
                                }`}
                              </span>
                            )}
                          </div>
                        </Link>

                        {!people.isFollowing &&
                          people._id !== user?._id &&
                          !user?.following.includes(people._id) && (
                            <Button
                              className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                              variant={"outline"}
                              size={"sm"}
                              onClick={() => {
                                if (!user) {
                                  toast.error(
                                    "You must be logged in to follow users",
                                    {
                                      position: "top-center",
                                    }
                                  );
                                  return;
                                }
                                dispatch(toggleFollow(people._id));
                              }}
                            >
                              Follow
                            </Button>
                          )}
                      </div>
                      {i !== peoples.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </Fragment>
                  ))}
                </>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <span className="text-sm opacity-70">
                    No people found for this search
                  </span>
                </div>
              )}
            </CardContent>
            {peoples.length > 0 && (
              <Button
                variant={"link"}
                className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                onClick={() => setType("people")}
              >
                Show all People result <ArrowRight className="w-10 h-10" />
              </Button>
            )}
          </Card>
          <Card id="posts">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                <CardTitle>Posts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-1 md:px-6">
              {posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <Post key={post._id} cardClass="w-full" post={post} />
                  ))}
                </>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <span className="text-sm opacity-70">
                    No posts found for this search
                  </span>
                </div>
              )}
            </CardContent>
            {posts.length > 0 && (
              <Button
                variant={"link"}
                className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                onClick={() => setType("posts")}
              >
                Show all Posts result <ArrowRight className="w-10 h-10" />
              </Button>
            )}
          </Card>
          <Card id="jobs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <CardTitle>Jobs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {jobs.length > 0 ? (
                <>
                  {jobs.map((job) => (
                    <Fragment key={job._id}>
                      <JobSearchCard
                        job={job}
                        removeHandler={(id) =>
                          setJobs((prev) =>
                            prev.filter((job) => job._id !== id)
                          )
                        }
                      />
                    </Fragment>
                  ))}
                </>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <span className="text-sm opacity-70">
                    No jobs found for this search
                  </span>
                </div>
              )}
            </CardContent>
            {jobs.length > 0 && (
              <Button
                variant={"link"}
                className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                onClick={() => setType("jobs")}
              >
                Show all Jobs result <ArrowRight className="w-10 h-10" />
              </Button>
            )}
          </Card>
          <Card id="groups">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <CardTitle>Groups</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {groups.length > 0 ? (
                groups.map((group: any, i: number) => (
                  <Fragment key={group._id}>
                    <GroupSearchCard group={group} i={i} />
                  </Fragment>
                ))
              ) : (
                <div className="flex justify-center items-center h-32">
                  <span className="text-sm opacity-70">
                    No groups found for this search
                  </span>
                </div>
              )}
            </CardContent>
            {groups.length > 0 && (
              <Button
                variant={"link"}
                className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                onClick={() => setType("groups")}
              >
                Show all Groups result <ArrowRight className="w-10 h-10" />
              </Button>
            )}
          </Card>
          <Card id="companies">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <CardTitle>Companies</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {companies.length > 0 ? (
                companies.map((company, i: number) => (
                  <Fragment key={company._id}>
                    <CompanySearchCard company={company} i={i} />
                  </Fragment>
                ))
              ) : (
                <div className="flex justify-center items-center h-32">
                  <span className="text-sm opacity-70">
                    No companies found for this search
                  </span>
                </div>
              )}
            </CardContent>
            {companies.length > 0 && (
              <Button
                variant={"link"}
                className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                onClick={() => setType("companies")}
              >
                Show all Companies result <ArrowRight className="w-10 h-10" />
              </Button>
            )}
          </Card>
          <Card id="projects">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                <CardTitle>Projects</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {projects.length > 0 ? (
                projects.map((project: any, i: number) => (
                  <Fragment key={project._id}>
                    <ProjectSearchCard project={project} i={i} />
                  </Fragment>
                ))
              ) : (
                <div className="flex justify-center items-center h-32">
                  <span className="text-sm opacity-70">
                    No projects found for this search
                  </span>
                </div>
              )}
            </CardContent>
            {projects.length > 0 && (
              <Button
                variant={"link"}
                className="w-full h-12 hover:no-underline hover:bg-secondary text-foreground"
                onClick={() => setType("projects")}
              >
                Show all Projects result <ArrowRight className="w-10 h-10" />
              </Button>
            )}
          </Card>
        </div>
      )}
      <aside className="h-min md:block hidden">
        <RecommendUser />
        <RecommendCompany />
      </aside>
    </section>
  );
}

export default All;
