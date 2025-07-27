import React from "react";

const PrimaryLoader: React.FC = () => (
  <div className="flex justify-center items-center w-full h-screen">
    <div className="w-16 h-16 m-2 rounded-full border-[6px] border-blue-900 border-t-transparent border-l-blue-900 border-b-blue-900 border-r-transparent animate-spin" />
  </div>
);

const SecondaryLoader: React.FC = () => (
  <div className="flex justify-center items-center w-full h-full">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

export { PrimaryLoader, SecondaryLoader };
