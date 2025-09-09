import React, { Fragment, useEffect, useState } from "react";
import FooterS from "../footerS";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2 } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { toast } from "sonner";
import { toggleFollowCompany } from "@/store/company/companySlice";
import { searchCompany } from "@/store/search/allSearchSlice";
import CompanySearchCard from "./companySearchCard";

function CompanySearch({
  setSelectValues,
  selectValues,
}: {
  setSelectValues: (values: any) => void;
  selectValues: any;
}) {
  const { companies } = useSelector((state: RootState) => state.search);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(searchCompany(selectValues));
  }, [dispatch, selectValues]);

  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      <div>
        {companies.length > 0 ? (
          <Card className="flex flex-col w-full gap-3 overflow-auto">
            <CardContent className="flex flex-col gap-2 py-5">
              {companies.map((company: any, i: number) => (
                <Fragment key={company._id}>
                  <CompanySearchCard company={company} i={i} />
                </Fragment>
              ))}
            </CardContent>
          </Card>
        ) : (
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
                  No Companies found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  We couldn't find any Company matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
              </div>
              {Object.keys(selectValues).length > 1 && (
                <button
                  onClick={() =>
                    setSelectValues({ q: selectValues.q, type: "companies" })
                  }
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear Filters
                </button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <aside>
        <FooterS />
      </aside>
    </section>
  );
}

export default CompanySearch;
