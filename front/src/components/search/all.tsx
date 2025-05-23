import React, { Fragment, use, useEffect } from "react";
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

function All({ setType, selectValues }: any) {
  const params = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { peoples, companies, posts, projects, groups, jobs, loading } =
    useSelector((state: RootState) => state.search);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const query = params.get("q");
    if (query) {
      dispatch(getAllSearch(query));
    }
  }, [params, dispatch]);

  return (
    <section className="md:grid block grid-cols-[200px_1fr_300px] gap-4">
      <aside className="h-min md:block hidden">
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
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 px-2 py-1 rounded transition-colors hover:bg-secondary hover:text-primary text-foreground text-sm font-medium border border-transparent hover:border-primary"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="ml-1">{item.label}</span>
                  </a>
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
        <div className="flex flex-col gap-6">
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
                  {peoples.map((people: any, i: number) => (
                    <Fragment key={people._id}>
                      <div className="flex justify-between my-2 items-start">
                        <a
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
                        </a>

                        {!people.isFollowing &&
                          people._id !== user?._id &&
                          !user?.following.includes(people._id) && (
                            <Button
                              className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                              variant={"outline"}
                              size={"sm"}
                              onClick={() => dispatch(toggleFollow(people._id))}
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
                      <div className="flex gap-5 justify-between items-start">
                        <div className="flex gap-5 items-center">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              <User2 className="w-14 h-14 p-3" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <h3 className="text-base text-primary font-bold">
                              {job.title}
                            </h3>
                            <span className="text-xs opacity-70">
                              {job.company}
                            </span>
                            <span className="text-xs opacity-70">
                              {job.location}
                            </span>
                            <span className="text-xs opacity-50 pt-1">
                              {job.postedAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                            variant={"outline"}
                            size={"sm"}
                          >
                            Save
                          </Button>
                          <Button
                            className="w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                            variant={"outline"}
                            size={"sm"}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                      <hr />
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
                <>
                  {groups.map((group: any, i: number) => (
                    <Fragment key={group._id}>
                      <div className="flex justify-between my-2 items-start">
                        <div className="flex justify-start items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={group.avatar?.url} />
                            <AvatarFallback>
                              <User2 className="w-8 h-8 p-1.5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col max-w-96">
                            <span className="font-semibold line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                              {group.name}
                            </span>
                            <span className="opacity-90 text-sm">
                              {group.memberCount} Members
                            </span>
                            <span className="text-xs opacity-60 line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                              {group.description}
                            </span>
                          </div>
                        </div>

                        <Button
                          className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                          variant={"outline"}
                          size={"sm"}
                        >
                          Join
                        </Button>
                      </div>
                      {i < groups.length - 1 && <Separator className="my-1" />}
                    </Fragment>
                  ))}
                </>
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
                <>
                  {companies.map((company: any, i: number) => (
                    <Fragment key={company._id}>
                      <div className="flex justify-between my-2 items-start">
                        <div className="flex justify-start items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={company.logo?.url} />
                            <AvatarFallback>
                              <User2 className="w-8 h-8 p-1.5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col max-w-96">
                            <span className="font-semibold">
                              {company.name}{" "}
                            </span>
                            <span className="text-sm opacity-90 line-clamp-1 leading-tight text-ellipsis overflow-hidden">
                              {company.position} | {company.industry} |{" "}
                              {company.connections} |{company.location} |{" "}
                              {company.skills.join(" | ")}
                            </span>
                            <span className="opacity-70 text-[13px]">
                              {company.followers} followers
                            </span>
                          </div>
                        </div>

                        <Button
                          className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                          variant={"outline"}
                          size={"sm"}
                        >
                          follow
                        </Button>
                      </div>
                      {i < companies.length - 1 && <hr className="my-1" />}
                    </Fragment>
                  ))}
                </>
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
                <>
                  {projects.map((project: any, i: number) => (
                    <Fragment key={project._id}>
                      <div className="flex justify-between my-2 items-start">
                        <div className="flex justify-start items-start gap-3">
                          <div className="flex flex-col max-w-96 gap-1">
                            <div className="flex gap-2">
                              <h4 className="font-semibold text-primary">
                                {project.title}
                              </h4>
                              {project.current ? (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                  working
                                </span>
                              ) : (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                  completed
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.skills.map((skill: any) => (
                                <span
                                  key={skill.name}
                                  className="bg-secondary text-xs px-2 py-0.5 rounded-full"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{project.likes.length} likes</span>
                              <span>{project.comments.length} comments</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                          variant={"outline"}
                          size={"sm"}
                        >
                          Save
                        </Button>
                      </div>
                      {i < projects.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </Fragment>
                  ))}
                </>
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
        <RecommendCompany />
      </aside>
    </section>
  );
}

export default All;
