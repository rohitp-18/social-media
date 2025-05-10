"use client";

import All from "@/components/search/all";
import CompanySearch from "@/components/search/companySearch";
import GroupSearch from "@/components/search/groupSearch";
import JobSearch from "@/components/search/jobSearch";
import PeopleSearch from "@/components/search/peopleSearch";
import PostSearch from "@/components/search/postSearch";
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
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [index, setIndex] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q");
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [pathname, router]);

  const searchFilters = [
    { value: "all", label: "All" },
    {
      value: "people",
      label: "People",
      filters: [
        {
          title: "location",
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
          title: "connections",
          options: [
            { value: "1st", label: "1st" },
            { value: "2nd", label: "2nd" },
            { value: "3rd", label: "3rd" },
          ],
        },
        {
          title: "industry",
          options: [
            { value: "it_industry", label: "IT industry" },
            { value: "other_industry", label: "Other industry" },
          ],
        },
        {
          title: "company",
          options: [
            { value: "company1", label: "Company 1" },
            { value: "company2", label: "Company 2" },
          ],
        },
        {
          title: "skills",
          options: [
            {
              value: "skill1",
              label: "Skill 1",
            },
          ],
        },
        {
          title: "sort by",
          options: [
            { value: "relevance", label: "Relevance" },
            { value: "most_recent", label: "Most recent" },
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
          title: "Date posted",
          options: [
            { value: "past_day", label: "Past 24 hours" },
            { value: "past_week", label: "Past week" },
            { value: "past_month", label: "Past month" },
            { value: "past_year", label: "Past year" },
          ],
        },
        {
          title: "sort by",
          options: [
            { value: "most_relevant", label: "Most relevant" },
            { value: "most_recent", label: "Most recent" },
            { value: "most_liked", label: "Most liked" },
            { value: "most_commented", label: "Most commented" },
          ],
        },
        {
          title: "experience level",
          options: [
            { value: "0", label: "Entry level" },
            { value: "1", label: "Intermediate" },
            { value: "2", label: "Associate" },
            { value: "3", label: "Senior" },
            { value: "4", label: "Professional" },
          ],
        },
        {
          title: "company",
          search: true,
          options: [
            { value: "company1", label: "Company 1" },
            { value: "company2", label: "Company 2" },
          ],
        },
        {
          title: "Work Type",
          options: [
            { value: "remote", label: "Remote" },
            { value: "hybrid", label: "Hybrid" },
            { value: "office", label: "Office" },
          ],
        },
        {
          title: "location",
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
          title: "type",
          options: [
            { value: "text", label: "Text" },
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
          ],
        },
        {
          title: "timeframe",
          options: [
            { value: "past_day", label: "Past 24 hours" },
            { value: "past_week", label: "Past week" },
            { value: "past_month", label: "Past month" },
            { value: "past_year", label: "Past year" },
          ],
        },
        {
          title: "sort by",
          options: [
            { value: "most_relevant", label: "Most relevant" },
            { value: "most_recent", label: "Most recent" },
            { value: "most_liked", label: "Most liked" },
            { value: "most_commented", label: "Most commented" },
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
          title: "location",
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
          title: "industry",
          options: [
            { value: "it_industry", label: "IT industry" },
            { value: "other_industry", label: "Other industry" },
          ],
        },
        {
          title: "company",
          options: [
            { value: "company1", label: "Company 1" },
            { value: "company2", label: "Company 2" },
          ],
        },
        {
          title: "members",
          options: [
            { value: "member1", label: "Member 1" },
            { value: "member2", label: "Member 2" },
          ],
        },
        {
          title: "skills",
          options: [
            { value: "skill1", label: "Skill 1" },
            { value: "skill2", label: "Skill 2" },
          ],
        },
        {
          title: "sort by",
          options: [
            { value: "most_relevant", label: "Most relevant" },
            { value: "most_recent", label: "Most recent" },
            { value: "most_members", label: "Most members" },
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
          title: "industry",
          options: [
            { value: "it_industry", label: "IT industry" },
            { value: "other_industry", label: "Other industry" },
          ],
        },
        {
          title: "size",
          options: [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ],
        },
        {
          title: "sort by",
          options: [
            { value: "most_relevant", label: "Most relevant" },
            { value: "most_recent", label: "Most recent" },
            { value: "most_employees", label: "Most employees" },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    const selectedFilter = searchFilters.find(
      (filter) => filter.value === type
    );
    setIndex(searchFilters.indexOf(selectedFilter!));
  }, [type, searchFilters]);

  return (
    <>
      <Navbar />

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
                  {searchFilters[index].filters?.map((f) => (
                    <div key={f.title} className="flex flex-col">
                      {/* <label className="text-sm font-semibold">{f.title}</label> */}
                      <Select onValueChange={(val) => console.log(f.title)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={f.title} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {f.search && (
                              <Input
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
                    className="overflow-auto"
                  >
                    <TabsList className="flex md:gap-6 gap-5 overflow-auto bg-transparent items-center justify-start">
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
            <>
              <All />
            </>
          )}
          {type === "people" && (
            <>
              <PeopleSearch />
            </>
          )}
          {type === "jobs" && (
            <>
              <JobSearch />
            </>
          )}
          {type === "companies" && (
            <>
              <CompanySearch />
            </>
          )}
          {type === "posts" && (
            <>
              <PostSearch />
            </>
          )}
          {type === "groups" && (
            <>
              <GroupSearch />
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default Page;
