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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
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
import { AppDispatch, RootState } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSkill, searchSkill } from "@/store/skill/skillSlice";
import { searchCompany } from "@/store/search/allSearchSlice";
import { X } from "lucide-react";
import { createSearchHistoryAction } from "@/store/history/searchHistory";
import { PrimaryLoader } from "@/components/loader";

function Page() {
  const [search, setSearch] = useState<{ [key: string]: string }>({});
  const [type, setType] = useState("not");
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [selectValues, setSelectValues] = useState<any>({});

  const pathname = usePathname();
  const searchParam = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { searchSkills, searchLoading } = useSelector(
    (state: RootState) => state.skill
  );
  const { companies } = useSelector((state: RootState) => state.search);
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
    router.push(`/search?${searchParam.toString()}`);
  };

  const changeType = (str: string) => {
    setType(str);
    setSelectValues({ q: query });
  };

  useEffect(() => {
    const q = searchParam.get("q");
    const t = searchParam.get("type");
    if (q == query && t == type) return;
    if (q) {
      router.push(
        `/search?q=${decodeURIComponent(q)}&type=${decodeURIComponent(
          t ? t : "all"
        )}`
      );
      setQuery(q);
      setSelectValues({ ...selectValues, q: q });
    }
  }, [searchParam, query, type]);

  useEffect(() => {
    if (query) {
      dispatch(createSearchHistoryAction(query));
    }
  }, [query]);

  const searchFilters = useMemo(
    () => [
      { value: "all", label: "All" },
      {
        value: "people",
        label: "People",
        apply: true,
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
            search: true,
            options: searchSkills.map((skill) => ({
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
              { value: "1", label: "Last 24 hours" },
              { value: "7", label: "This week" },
              { value: "30", label: "This month" },
              { value: "365", label: "This year" },
            ],
          },
          {
            key: "sort",
            title: "Sort by",
            apply: true,
            options: [
              { value: "relevant", label: "Most relevant" },
              { value: "recent", label: "Most recent" },
              { value: "salary", label: "Highest Salary" },
            ],
          },
          // future updates
          // {
          //   key: "experience_level",
          //   title: "Experience Level",
          //   options: [
          //     { value: "0", label: "Entry level" },
          //     { value: "1", label: "Intermediate" },
          //     { value: "2", label: "Associate" },
          //     { value: "3", label: "Senior" },
          //     { value: "4", label: "Professional" },
          //   ],
          // },
          {
            title: "Company",
            key: "company",
            search: true,
            options: companies.map((company) => ({
              value: company._id,
              label: company.name,
            })),
          },
          {
            title: "Work Type",
            key: "workType",
            options: [
              { value: "remote", label: "Remote" },
              { value: "hybrid", label: "Hybrid" },
              { value: "onsite", label: "On-site" },
            ],
          },
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
        ],
      },
      {
        value: "posts",
        label: "Posts",
        apply: true,
        filters: [
          {
            title: "Content Type",
            key: "contentType",
            options: [
              { value: "all", label: "All" },
              { value: "text", label: "Text" },
              { value: "image", label: "Image" },
              { value: "video", label: "Video" },
            ],
          },
          {
            title: "Post Type",
            key: "postType",
            options: [
              { value: "all", label: "All" },
              { value: "user", label: "User" },
              { value: "group", label: "Group" },
              { value: "company", label: "Company" },
            ],
          },
          {
            title: "Timeframe",
            key: "timeframe",
            options: [
              { value: "24h", label: "Last 24 hours" },
              { value: "7d", label: "This week" },
              { value: "30d", label: "This month" },
              { value: "1y", label: "This year" },
            ],
          },
          {
            title: "Sort by",
            key: "sort",
            options: [
              { value: "relevant", label: "Most relevant" },
              { value: "recent", label: "Most recent" },
              { value: "liked", label: "Most liked" },
              { value: "comments", label: "Most commented" },
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
          //   title: "Members",
          //   key: "members",
          //   options: [
          //     { value: "member1", label: "Member 1" },
          //     { value: "member2", label: "Member 2" },
          //   ],
          // },
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
        apply: true,
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
          // future
          // {
          //   title: "Industry",
          //   key: "industry",
          //   options: [
          //     { value: "it_industry", label: "IT industry" },
          //     { value: "other_industry", label: "Other industry" },
          //   ],
          // },
          // {
          //   title: "size",
          //   key: "size",
          //   options: [
          //     { value: "small", label: "Small" },
          //     { value: "medium", label: "Medium" },
          //     { value: "large", label: "Large" },
          //   ],
          // },
          {
            title: "Sort by",
            key: "sort",
            options: [
              { value: "relevant", label: "Most relevant" },
              { value: "recent", label: "Most recent" },
              { value: "employees", label: "Most employees" },
              { value: "followers", label: "Most Followers" },
            ],
          },
        ],
      },
      {
        value: "projects",
        label: "Projects",
        apply: true,
        filters: [
          {
            title: "Skills",
            key: "skill",
            search: true,
            options: searchSkills.map((skill) => ({
              value: skill._id,
              label: skill.name,
            })),
          },
          // {
          //   title: "No of Members",
          //   key: "members",
          //   options: [
          //     { value: "1", label: "1" },
          //     { value: "2", label: "2" },
          //     { value: "3", label: "3" },
          //     { value: "4", label: "4" },
          //     { value: "5", label: "5" },
          //   ],
          // },

          {
            title: "Sort by",
            key: "sort",
            options: [
              { value: "relevant", label: "Most relevant" },
              { value: "recent", label: "Most recent" },
              // { value: "old", label: "Oldest" },
            ],
          },
        ],
      },
    ],
    [searchSkills, companies]
  );

  useEffect(() => {
    const selectedFilter = searchFilters.find(
      (filter) => filter.value === type
    );
    // urlChange();
    setIndex(selectedFilter ? searchFilters.indexOf(selectedFilter) : 0);
  }, [type, searchFilters]);

  useEffect(() => {
    if (type === "not") {
      router.push(
        `/search?q=${query}&type=${searchParam.get("type") || "all"}`
      );
      setType(searchParam.get("type") || "all");
    } else {
      router.push(`/search?q=${query}&type=${type}`);
    }
  }, [type, query]);

  if (type === "not" || query == "") return <PrimaryLoader />;

  return (
    <>
      {user ? <Navbar /> : <IntroNavbar />}
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
        <div className="md:container lg:max-w-[1100px] md:mx-auto md:px-4 px-2">
          <Card className="bg-background flex flex-col gap-3 shadow-md w-full">
            {type !== "all" ? (
              <CardContent className="flex items-center gap-3 py-3">
                <div className="flex flex-col items-start gap-2">
                  {/* <Label className="text-sm font-semibold">Type</Label> */}
                  <Select
                    defaultValue={type}
                    onValueChange={(value) => changeType(value)}
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
                  {searchFilters[index].filters?.map(
                    (f) =>
                      ("apply" in f ? !f.apply : true) && (
                        <div
                          key={f.key || f.title}
                          className="hidden flex-col md:flex"
                        >
                          {/* <Label className="text-xs font-medium mb-1">
                        {f.title}
                      </Label> */}
                          <Select
                            value={selectValues[f.key || f.title] || ""}
                            onValueChange={(value) =>
                              handleSelectChange(f, value)
                            }
                          >
                            <SelectTrigger className="w-full min-w-[140px]">
                              <SelectValue placeholder={f.title} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {f.search && (
                                  <div className="px-2 py-1">
                                    <Input
                                      value={search[f.key || f.title] || ""}
                                      onChange={(e) => {
                                        if (f.key == "skill") {
                                          dispatch(searchSkill(e.target.value));
                                        }
                                        if (f.key == "company") {
                                          dispatch(
                                            searchCompany({ q: e.target.value })
                                          );
                                        }
                                        setSearch((prev) => ({
                                          ...prev,
                                          [f.key || f.title]: e.target.value,
                                        }));
                                      }}
                                      type="search"
                                      placeholder={`Search ${
                                        f.title?.toLowerCase() || ""
                                      }...`}
                                      className="p-2 w-full mb-2 border rounded-md"
                                    />
                                  </div>
                                )}
                                {f.options
                                  .filter((option) => {
                                    if (!f.search || !search) return true;
                                    const searchTerm =
                                      search[f.key || f.title]?.toLowerCase() ||
                                      "";
                                    return (
                                      option?.label
                                        ?.toLowerCase()
                                        .includes(searchTerm) ||
                                      option?.value
                                        ?.toLowerCase()
                                        .includes(searchTerm)
                                    );
                                  })
                                  .map((option) => (
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
                      )
                  )}

                  {searchFilters[index].apply && (
                    <>
                      <div className="flex h-full w-full justify-end">
                        <Separator
                          className="h-12 items-center opacity-60 sm:flex hidden overflow-hidden w-[1px] bg-foreground"
                          orientation="vertical"
                        />
                      </div>
                      <Drawer direction="left">
                        <DrawerTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="text-opacity-50"
                          >
                            filters
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerClose className="absolute right-3 top-3">
                              <X className="h-4 w-4" />
                            </DrawerClose>
                            <DrawerTitle>Apply Filters</DrawerTitle>
                            <DrawerDescription>
                              Apply filters to refine your search results
                            </DrawerDescription>
                          </DrawerHeader>
                          <CardContent className="flex flex-col gap-5">
                            {searchFilters[index].filters?.map((f) => (
                              <div
                                key={f.key || f.title}
                                className="flex flex-col min-w-[160px]"
                              >
                                {/* <Label className="text-xs font-medium mb-1">
                        {f.title}
                      </Label> */}
                                <Select
                                  value={selectValues[f.key || f.title] || ""}
                                  onValueChange={(value) =>
                                    handleSelectChange(f, value)
                                  }
                                >
                                  <SelectTrigger className="w-full min-w-[140px]">
                                    <SelectValue placeholder={f.title} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {f.search && (
                                        <div className="px-2 py-1">
                                          <Input
                                            value={
                                              search[f.key || f.title] || ""
                                            }
                                            onChange={(e) => {
                                              if (f.key == "skill") {
                                                dispatch(
                                                  searchSkill(e.target.value)
                                                );
                                              }
                                              if (f.key == "company") {
                                                dispatch(
                                                  searchCompany({
                                                    q: e.target.value,
                                                  })
                                                );
                                              }
                                              setSearch((prev) => ({
                                                ...prev,
                                                [f.key || f.title]:
                                                  e.target.value,
                                              }));
                                            }}
                                            type="search"
                                            placeholder={`Search ${
                                              f.title?.toLowerCase() || ""
                                            }...`}
                                            className="p-2 w-full mb-2 border rounded-md"
                                          />
                                        </div>
                                      )}
                                      {f.options
                                        .filter((option) => {
                                          if (!f.search || !search) return true;
                                          const searchTerm =
                                            search[
                                              f.key || f.title
                                            ]?.toLowerCase() || "";
                                          return (
                                            option?.label
                                              ?.toLowerCase()
                                              .includes(searchTerm) ||
                                            option?.value
                                              ?.toLowerCase()
                                              .includes(searchTerm)
                                          );
                                        })
                                        .map((option) => (
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
                          </CardContent>
                          <DrawerFooter className="justify-between">
                            <Button
                              variant={"secondary"}
                              onClick={() => {
                                setSearch({});
                                dispatch(resetSkill());
                                setSelectValues({ q: query });
                              }}
                            >
                              Clear Filters
                            </Button>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </>
                  )}
                </div>
                {Object.keys(selectValues).length > 1 && (
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      // setSearch({});
                      dispatch(resetSkill());
                      setSelectValues({ q: query });
                    }}
                    className="text-opacity-50 xs:flex hidden"
                  >
                    Clear filters
                  </Button>
                )}
              </CardContent>
            ) : (
              <CardContent className="flex gap-3 py-3">
                {/* <div className=""> */}
                <Tabs
                  value={type}
                  onValueChange={(val) => changeType(val)}
                  className="flex flex-wrap"
                >
                  <TabsList className="flex flex-wrap md:gap-6 gap-5 min-h-12 max-h-max h-[unset] justify-evenly md:justify-start items-center whitespace-nowrap bg-transparent">
                    {searchFilters.map(
                      (tabs) =>
                        tabs.value !== "all" && (
                          <TabsTrigger
                            key={tabs.value}
                            style={{ boxShadow: "none" }}
                            className="border rounded-full py-2 px-4 inline-flex flex-shrink-0"
                            value={tabs.value}
                          >
                            {tabs.label}
                          </TabsTrigger>
                        )
                    )}
                  </TabsList>
                </Tabs>
              </CardContent>
            )}
          </Card>
        </div>
        <section className="md:container lg:max-w-[1100px] mx-auto py-6 px-2 md:px-4">
          {type === "all" && (
            <All setType={changeType} selectValues={selectValues} />
          )}
          {type === "people" && (
            <PeopleSearch
              selectValues={selectValues}
              setSelectValues={setSelectValues}
            />
          )}
          {type === "jobs" && (
            <JobSearch
              selectValues={selectValues}
              setSelectValues={setSelectValues}
            />
          )}
          {type === "companies" && (
            <CompanySearch
              selectValues={selectValues}
              setSelectValues={setSelectValues}
            />
          )}
          {type === "posts" && (
            <PostSearch
              selectValues={selectValues}
              setSelectValues={setSelectValues}
            />
          )}
          {type === "groups" && (
            <GroupSearch
              selectValues={selectValues}
              setSelectValues={setSelectValues}
            />
          )}
          {type === "projects" && (
            <ProjectSearch
              selectValues={selectValues}
              setSelectValues={setSelectValues}
            />
          )}
        </section>
      </main>
    </>
  );
}

export default Page;
