import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
function FooterS() {
  return (
    <div className="flex flex-col px-3 py-4 gap-4">
      <div className="flex flex-wrap gap-3 justify-center py-3 items-center">
        <Link href="#" className="text-sm opacity-80 hover:underline">
          about
        </Link>
        <Link href="#" className="text-sm opacity-80 hover:underline">
          help
        </Link>
        <Link href="#" className="text-sm opacity-80 hover:underline">
          privacy
        </Link>
        <Link href="#" className="text-sm opacity-80 hover:underline">
          terms
        </Link>
        <Link href="#" className="text-sm opacity-80 hover:underline">
          contact
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm opacity-80 focus-visible:outline-none">
            more
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background p-2 rounded-lg shadow-lg">
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                accessibility
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                careers
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                developers
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                advertising
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                cookies
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                community guidelines
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="text-sm text-center font-semibold">TS TECH &copy; 2025</h3>
    </div>
  );
}

export default FooterS;
