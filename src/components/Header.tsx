"use client"
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";


export default function Header() {
  // const { data: session } = useSession(); // Access the session data
  return (
    <header className="fixed top-0 left-0 w-full shadow-md p-4 flex justify-between items-center border-b-4 ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center justify-between h-14">
            {/* logo and home link */}
            <Link href={true ? "/home" : "/"} className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#242d56] rounded-sm flex items-center justify-center border-2 border-b-3 border-r-3 border-black">
                <span className="text-black text-base sm:text-xl">📚</span>
              </div>
              <span className="font-semibold text-white text-xl sm:text-xl">Mind Path</span>
            </Link>
          </div>

          {/* AuthButtons*/}
          <nav className="flex items-center space-x-2 sm:space-x-4">

           {true && (
              <div className="flex gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => signIn()}
                  className="border-2 border-black text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Link href="/signin"> Sign In</Link>
                </Button>
                <Link href="/register" passHref>
                  <button className="px-2 sm:px-4 py-1.5 bg-[#c1ff72] border-2 border-b-4 border-r-4 border-white rounded-lg hover:bg-[#c1ff72] hover:border-b-2 hover:border-r-2 transition-all duration-100 text-xs sm:text-sm font-medium shadow-sm hover:shadow active:border-b-5 active:border-r-2">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </nav>  
        </div>
      </div>
    </header>
  );
}
