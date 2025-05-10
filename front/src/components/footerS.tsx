import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
function FooterS() {
  return (
    <div className="flex flex-col px-3 py-4 gap-4">
      <div className="flex flex-wrap gap-3 justify-center py-3 items-center">
        <a href="#" className="text-sm opacity-80 hover:underline">
          about
        </a>
        <a href="#" className="text-sm opacity-80 hover:underline">
          help
        </a>
        <a href="#" className="text-sm opacity-80 hover:underline">
          privacy
        </a>
        <a href="#" className="text-sm opacity-80 hover:underline">
          terms
        </a>
        <a href="#" className="text-sm opacity-80 hover:underline">
          contact
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm opacity-80 focus-visible:outline-none">
            more
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background p-2 rounded-lg shadow-lg">
            <DropdownMenuItem>
              <a href="#" className="w-full">
                accessibility
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#" className="w-full">
                careers
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#" className="w-full">
                developers
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#" className="w-full">
                advertising
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#" className="w-full">
                cookies
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#" className="w-full">
                community guidelines
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="text-sm text-center font-semibold">TS TECH &copy; 2025</h3>
    </div>
  );
}

export default FooterS;
