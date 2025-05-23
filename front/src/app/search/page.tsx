"use client";

import All from "@/components/search/all";
import CompanySearch from "@/components/search/companySearch";
import GroupSearch from "@/components/search/groupSearch";
import JobSearch from "@/components/search/jobSearch";
import PeopleSearch from "@/components/search/peopleSearch";
import PostSearch from "@/components/search/postSearch";
import ProjectSearch from "@/components/search/projectSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/userNavbar";
import IntroNavbar from "@/components/introNavbar";
import { RootState } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Page() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [selectValues, setSelectValues] = useState<any>({});

  const pathname = usePathname();
  const searchParam = useSearchParams();
  const router = useRouter();

  const { skills, posts, projects, peoples, groups, companies } = useSelector(
    (state: RootState) => state.search
  );
  const { user } = useSelector((state: RootState) => state.user);

  const handleSelectChange = (filter: any, value: string) => {
    if (type === "all") {
      return;
    }

    setSelectValues((prev: any) => ({
      ...prev,
      [filter.key]: value,
    }));

    if (type !== "all") {
      const url = new URLSearchParams(window.location.search);
      url.set(filter.key, value);
      window.history.replaceState(null, "", `/search?${url.toString()}`);
    }

    if (type === "all") {
      const url = new URLSearchParams(window.location.search);
      url.set(filter.title, value);
      window.history.replaceState(null, "", `/search?${url.toString()}`);
    }
  };

  const urlChange = () => {
    const url = new URLSearchParams(window.location.search);
    url.set("type", type);
    window.history.replaceState(null, "", `/search?${url.toString()}`);
  };

  useEffect(() => {
    const q = searchParam.get("q");
    const t = searchParam.get("type");
    console.log(q);
    if (q) {
      router.push(
        `/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(
          t ? t : "all"
        )}`
      );
      setQuery(q);
    }
  }, [pathname, router]);

  const searchFilters = [
    { value: "all", label: "All" },
    {
      value: "people",
      label: "People",
      filters: [
        {
          key: "location",
          title: "Location",
          search: true,
          options: [
            { value: "USA", label: "USA" },
            { value: "Canada", label: "Canada" },
            { value: "UK", label: "UK" },
            { value: "Australia", label: "Australia" },
            { value: "Germany", label: "Germany" },
            { value: "India", label: "India" },
          ],
        },
        // {
        //   key: "connections",
        //   title: "Connections",
        //   options: [
        //     { value: "1", label: "1st" },
        //     { value: "2", label: "2nd" },
        //     { value: "3", label: "3rd" },
        //   ],
        // },
        // for future updates
        // {
        //   key: "industry",
        //   title: "Industry",
        //   options: [
        //     { value: "it_industry", label: "IT industry" },
        //     { value: "other_industry", label: "Other industry" },
        //   ],
        // },
        // {
        //   key: "company",
        //   title: "Company",
        //   options: [
        //     { value: "company1", label: "Company 1" },
        //     { value: "company2", label: "Company 2" },
        //   ],
        // },
        {
          key: "skill",
          title: "Skills",
          options: skills.map((skill) => ({
            value: skill._id,
            label: skill.name,
          })),
        },
        {
          key: "sort",
          title: "Sort by",
          options: [
            { value: "relevant", label: "Relevance" },
            { value: "recent", label: "Most recent" },
            { value: "connections", label: "Most connections" },
            { value: "popular", label: "Popular" },
          ],
        },
      ],
    },
    {
      value: "jobs",
      label: "Jobs",
      apply: true,
      filters: [
        {
          key: "date_posted",
          title: "Date posted",
          options: [
            { value: "past_day", label: "Past 24 hours" },
            { value: "past_week", label: "Past week" },
            { value: "past_month", label: "Past month" },
            { value: "past_year", label: "Past year" },
          ],
        },
        {
          key: "sort",
          title: "Sort by",
          options: [
            { value: "relevant", label: "Most relevant" },
            { value: "recent", label: "Most recent" },
            { value: "liked", label: "Most liked" },
            { value: "commented", label: "Most commented" },
          ],
        },
        {
          key: "experience_level",
          title: "Experience Level",
          options: [
            { value: "0", label: "Entry level" },
            { value: "1", label: "Intermediate" },
            { value: "2", label: "Associate" },
            { value: "3", label: "Senior" },
            { value: "4", label: "Professional" },
          ],
        },
        {
          title: "Company",
          key: "company",
          search: true,
          options: [
            { value: "company1", label: "Company 1" },
            { value: "company2", label: "Company 2" },
          ],
        },
        {
          title: "Work Type",
          key: "workType",
          options: [
            { value: "remote", label: "Remote" },
            { value: "hybrid", label: "Hybrid" },
            { value: "office", label: "Office" },
          ],
        },
        {
          title: "Location",
          key: "location",
          search: true,
          options: [{ value: "India", label: "India" }],
        },
      ],
    },
    {
      value: "posts",
      label: "Posts",
      filters: [
        {
          title: "Type",
          key: "contain",
          options: [
            { value: "text", label: "Text" },
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
          ],
        },
        {
          title: "Timeframe",
          key: "timeframe",
          options: [
            { value: "past_day", label: "Past 24 hours" },
            { value: "past_week", label: "Past week" },
            { value: "past_month", label: "Past month" },
            { value: "past_year", label: "Past year" },
          ],
        },
        {
          title: "Sort by",
          key: "sort",
          options: [
            { value: "relevant", label: "Most relevant" },
            { value: "recent", label: "Most recent" },
            { value: "liked", label: "Most liked" },
            { value: "commented", label: "Most commented" },
          ],
        },
      ],
    },
    {
      value: "groups",
      label: "Groups",
      apply: true,
      filters: [
        {
          title: "Location",
          key: "location",
          search: true,
          options: [
            { value: "USA", label: "USA" },
            { value: "Canada", label: "Canada" },
            { value: "UK", label: "UK" },
            { value: "Australia", label: "Australia" },
            { value: "Germany", label: "Germany" },
            { value: "India", label: "India" },
          ],
        },
        // {
        //   title: "Industry",
        //   key: "industry",
        //   options: [
        //     { value: "it_industry", label: "IT industry" },
        //     { value: "other_industry", label: "Other industry" },
        //   ],
        // },
        // {
        //   title: "Company",
        //   options: [
        //     { value: "company1", label: "Company 1" },
        //     { value: "company2", label: "Company 2" },
        //   ],
        // },
        // {
        //   title: "Members",
        //   key: "members",
        //   options: [
        //     { value: "member1", label: "Member 1" },
        //     { value: "member2", label: "Member 2" },
        //   ],
        // },
        {
          title: "Skills",
          key: "skill",
          options: skills.map((skill) => ({
            value: skill._id,
            label: skill.name,
          })),
        },
        {
          title: "Sort by",
          key: "sort",
          options: [
            { value: "relevant", label: "Most relevant" },
            { value: "recent", label: "Most recent" },
            { value: "members", label: "Most members" },
          ],
        },
      ],
    },
    {
      value: "companies",
      label: "Companies",
      filters: [
        {
          title: "location",
          key: "location",
          search: true,
          options: [
            { value: "USA", label: "USA" },
            { value: "Canada", label: "Canada" },
            { value: "UK", label: "UK" },
            { value: "Australia", label: "Australia" },
            { value: "Germany", label: "Germany" },
            { value: "India", label: "India" },
          ],
        },
        {
          title: "Industry",
          key: "industry",
          options: [
            { value: "it_industry", label: "IT industry" },
            { value: "other_industry", label: "Other industry" },
          ],
        },
        {
          title: "size",
          key: "size",
          options: [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ],
        },
        {
          title: "Sort by",
          key: "sort",
          options: [
            { value: "relevant", label: "Most relevant" },
            { value: "recent", label: "Most recent" },
            { value: "employees", label: "Most employees" },
          ],
        },
      ],
    },
    {
      value: "projects",
      label: "Projects",
      filters: [
        {
          title: "Skills",
          search: true,
          options: skills.map((skill) => ({
            value: skill._id,
            label: skill.name,
          })),
        },
        {
          title: "No of Members",
          key: "members",
          options: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
          ],
        },

        {
          title: "Sort by",
          key: "sort",
          options: [
            { value: "relevant", label: "Most relevant" },
            { value: "recent", label: "Most recent" },
            { value: "members", label: "Most members" },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    const selectedFilter = searchFilters.find(
      (filter) => filter.value === type
    );
    urlChange();
    setIndex(
      searchFilters.indexOf(selectedFilter!) < 0
        ? 0
        : searchFilters.indexOf(selectedFilter!)
    );
  }, [type, searchFilters]);

  useEffect(() => {
    setSelectValues({ q: query });
    window.history.replaceState(null, "", `/search?q=${query}`);
  }, [type, query]);

  return (
    <>
      {user ? <Navbar /> : <IntroNavbar />}

      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="container lg:max-w-[1100px] mx-auto">
          <Card className="bg-background flex flex-col gap-3 shadow-md w-full">
            {type !== "all" ? (
              <CardContent className="flex items-center gap-3 py-3">
                <div className="flex flex-col items-start gap-2">
                  {/* <Label className="text-sm font-semibold">Type</Label> */}
                  <Select
                    defaultValue={type}
                    onValueChange={(value) => setType(value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {searchFilters.map((filter) => (
                          <SelectItem key={filter.value} value={filter.value}>
                            {filter.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {type !== "all" && (
                  <div className="flex h-full">
                    <Separator
                      className="h-12 items-center opacity-60 overflow-hidden w-[1px] bg-foreground"
                      orientation="vertical"
                    />
                  </div>
                )}

                <div className="flex gap-5 w-full items-center">
                  {((type === "posts" && posts.length > 0) ||
                    (type === "projects" && projects.length > 0) ||
                    (type === "people" && peoples.length > 0) ||
                    (type === "groups" && groups.length > 0) ||
                    (type === "companies" && companies.length > 0)) &&
                    searchFilters[index].filters?.map((f) => (
                      <div key={f.title} className="flex flex-col">
                        {/* <label className="text-sm font-semibold">{f.title}</label> */}
                        <Select
                          value={selectValues[f.title] || ""}
                          onValueChange={(value) =>
                            handleSelectChange(f, value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={f.title} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {f.search && (
                                <Input
                                  value={search}
                                  type="text"
                                  placeholder="Search..."
                                  className="p-2 w-full mb-2 border rounded-md"
                                  onChange={(e) => setSearch(e.target.value)}
                                />
                              )}
                            </SelectGroup>
                            <SelectGroup>
                              {f.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}

                  {searchFilters[index].apply && (
                    <>
                      <div className="flex h-full">
                        <Separator
                          className="h-12 items-center opacity-60 overflow-hidden w-[1px] bg-foreground"
                          orientation="vertical"
                        />
                      </div>
                      <Drawer direction="left">
                        {/* <DrawerTrigger> */}
                        <Button variant={"outline"} className="text-opacity-50">
                          Apply filters
                        </Button>
                        {/* </DrawerTrigger> */}
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Apply Filters</DrawerTitle>
                          </DrawerHeader>
                        </DrawerContent>
                      </Drawer>
                    </>
                  )}
                </div>
              </CardContent>
            ) : (
              <CardContent className="flex gap-3 py-3">
                <div className="">
                  <Tabs
                    value={type}
                    onValueChange={(val) => setType(val)}
                    className="md:overflow-hidden overflow-auto"
                  >
                    <TabsList className="flex md:gap-6 gap-5 min-h-12 max-h-max h-[unset] justify-center overflow-auto bg-transparent items-center md:justify-start">
                      {searchFilters.map(
                        (tabs) =>
                          tabs.value !== "all" && (
                            <TabsTrigger
                              key={tabs.value}
                              style={{ boxShadow: "none" }}
                              className={"border rounded-full py-2 px-4"}
                              value={tabs.value}
                            >
                              {tabs.label}
                            </TabsTrigger>
                          )
                      )}
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        <section className="container lg:max-w-[1100px] mx-auto py-6">
          {type === "all" && (
            <All setType={setType} selectValues={selectValues} />
          )}
          {type === "people" && (
            <PeopleSearch setType={setType} selectValues={selectValues} />
          )}
          {type === "jobs" && (
            <JobSearch setType={setType} selectValues={selectValues} />
          )}
          {type === "companies" && (
            <CompanySearch setType={setType} selectValues={selectValues} />
          )}
          {type === "posts" && (
            <PostSearch setType={setType} selectValues={selectValues} />
          )}
          {type === "groups" && (
            <GroupSearch setType={setType} selectValues={selectValues} />
          )}
          {type === "projects" && (
            <ProjectSearch setType={setType} selectValues={selectValues} />
          )}
        </section>
      </main>
    </>
  );
}

export default Page;
