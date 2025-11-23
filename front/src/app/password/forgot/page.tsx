"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "@/store/axios";
import { isAxiosError } from "axios";
import { RootState } from "@/store/store";

function Page() {
  const [checkbox, setCheckbox] = useState(true);

  const [email, setEmail] = useState("");
  const [eLoading, setELoading] = useState(false);

  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.user);

  async function submitHandler(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (loading) return;
    if (!email) {
      toast.error("Please fill all required fields", {
        position: "top-center",
      });
      return;
    }

    if (!checkbox) {
      toast.error("Please accept our terms and conditions", {
        position: "top-center",
      });
      return;
    }

    try {
      setELoading(true);
      console.log(window.location.origin);
      const { data } = await axios.put("/user/forgot-password/apply", {
        email,
        link: `${window.location.origin}`,
      });

      if (data.success) {
        toast.success("Email sent successfully", {
          position: "top-center",
        });
        setTimeout(() => {
          user ? router.push(`/u/${user.username}`) : router.push("/login");
        }, 1000);
      }
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data.message
          : "An error occurred. Please try again.",
        {
          position: "top-center",
        }
      );
    } finally {
      setELoading(false);
      setEmail("");
      setCheckbox(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-background/70">
        <h3>LOGO</h3>
        <section className="w-full flex justify-center items-center h-screen">
          <div className="min-w-[320px] md:min-w-96 shadow-2xl dark:bg-zinc-800 bg-white rounded-lg p-6">
            <form
              className="flex flex-col justify-center"
              onSubmit={(e) => submitHandler(e)}
            >
              <div className="mb-4">
                <h2 className="text-2xl text-center font-bold">
                  Forgot Password
                </h2>
                <div className="text-center opacity-80 text-sm">
                  Enter your email to reset your password.
                </div>
              </div>

              <div className="grid w-full relative mb-4 py-3 max-w-sm items-center gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex space-x-2 mb-2">
                <Checkbox
                  id="terms"
                  checked={checkbox}
                  onCheckedChange={() => setCheckbox(!checkbox)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <Link href="/terms" className="text-blue-500 hover:underline">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              <Button
                disabled={!email || !checkbox || eLoading}
                type="submit"
                className="w-full"
              >
                Send Email
              </Button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Page;
