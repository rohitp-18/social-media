"use client";

import React, { useState, useEffect } from "react";
import Wrapper from "../u/[name]/details/_wrapper";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTheme } from "next-themes";
import Link from "next/link";

const Page: React.FC = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const { setTheme, theme } = useTheme();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-500">User not found</div>;
  }

  return (
    <>
      <Wrapper>
        <section>
          <h3 className="text-xl font-bold mb-2 dark:text-white">Settings</h3>
          <Link
            href={`/u/${user.username}`}
            className="block bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md"
          >
            <h4 className="text-lg font-semibold mb-1 dark:text-gray-200">
              Account Information
            </h4>
            <p className="text-gray-600 dark:text-gray-300 opacity-75 text-sm">
              Email: {user.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300 opacity-75 text-sm">
              Name: {user.name}
            </p>
          </Link>

          <Link
            href={"/notification/manage"}
            className="block bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mt-2"
          >
            <h4 className="text-lg font-semibold mb-1 dark:text-gray-200">
              Notification Settings
            </h4>
            <p className="text-gray-600 dark:text-gray-300 opacity-75 text-sm">
              Manage your notification preferences.
            </p>
            {/* Add notification settings options here */}
          </Link>
          {/* change password */}
          <Link
            href={"/password/change"}
            className="bg-white dark:bg-gray-900 p-4 block rounded-lg shadow-md mt-2"
          >
            <h4 className="text-lg font-semibold mb-1 dark:text-gray-200">
              Change Password
            </h4>
            <p className="text-gray-600 dark:text-gray-300 opacity-75 text-sm">
              Update your password for better security.
            </p>
            {/* Add change password form here */}
          </Link>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mt-2">
            <h4 className="text-lg font-semibold mb-1 dark:text-gray-200">
              Delete Account
            </h4>
            <p className="text-red-600 dark:text-red-400 opacity-75 text-sm">
              If you wish to delete your account, please contact support.
            </p>
            {/* Add delete account option here */}
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mt-2">
            <h4 className="text-lg font-semibold mb-1 dark:text-gray-200">
              Language Preferences
            </h4>
            <p className="text-gray-600 dark:text-gray-300 opacity-75 text-sm">
              Select your preferred language for the application.
            </p>
            {/* Add language preferences options here */}
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mt-2 flex justify-between items-center">
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold mb-1 dark:text-gray-200">
                Dark Mode
              </h4>
              <p className="text-gray-600 dark:text-gray-300 opacity-75 text-sm">
                Enable dark mode for a better nighttime experience.
              </p>
            </div>
            <button
              onClick={() =>
                theme === "dark" ? setTheme("light") : setTheme("dark")
              }
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                theme === "dark" ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  theme === "dark" ? "transform translate-x-6" : ""
                }`}
              ></span>
            </button>
          </div>
        </section>
      </Wrapper>
    </>
  );
};

export default Page;
