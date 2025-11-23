"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser, resetUser } from "@/store/user/userSlice";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import axios from "@/store/axios";

function Page() {
  const [password, setPassword] = useState(true);
  const [checkbox, setCheckbox] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [checkToken, setCheckToken] = useState(false);

  const router = useRouter();
  const { token } = useParams();
  const { user } = useSelector((state: RootState) => state.user);

  async function submitHandler(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
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

    const formData = {
      confirmPassword,
      newPassword,
    };

    try {
      setChangeLoading(true);

      const { data } = await axios.post(
        `/user/forgot-password/change?token=${token}`,
        formData
      );

      toast.success(data.message, {
        position: "top-center",
      });
      setTimeout(() => {
        user ? router.push(`/u/${user.username}`) : router.push("/login");
      }, 1000);
    } catch (error: any) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data.message
          : "An error occurred",
        {
          position: "top-center",
        }
      );
    } finally {
      setChangeLoading(false);
      setNewPassword("");
      setConfirmPassword("");
      setCheckbox(false);
    }
  }

  async function checkTokenValidity() {
    if (changeLoading) return;
    try {
      setChangeLoading(true);
      const { data } = await axios.get(
        `/user/forgot-password/verify?token=${token}`
      );

      if (data.success) {
        setCheckToken(true);
      }
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data.message
          : "An error occurred while verifying the token",
        {
          position: "top-center",
        }
      );
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } finally {
      setChangeLoading(false);
    }
  }

  useEffect(() => {
    if (token && !checkToken) {
      checkTokenValidity();
    }
  }, [token]);

  return (
    <>
      <main className="min-h-screen bg-background/70">
        <h3>LOGO</h3>
        <section className="w-full flex justify-center items-center h-screen">
          <div className="min-w-[320px] md:min-w-96 shadow-2xl dark:bg-zinc-800 bg-white rounded-lg p-6">
            <form
              className="flex flex-col justify-center max-w-md mx-auto"
              onSubmit={(e) => submitHandler(e)}
            >
              <div className="mb-4 w-full">
                <h2 className="text-2xl text-center font-bold">
                  Change Password
                </h2>
                <div className="text-center opacity-80 text-sm">
                  Please enter your current password and the new password you
                  want to set.
                </div>
              </div>
              <div className="grid w-full relative mb-4 max-w-md items-center gap-1">
                <Label htmlFor="password">New Password</Label>
                <Input
                  className="p-1 w-full"
                  type={password ? "text" : "password"}
                  id="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {password ? (
                  <EyeOffIcon
                    onClick={() => setPassword(!password)}
                    className="cursor-pointer absolute right-2 bottom-1 opacity-70 hover:opacity-100"
                  />
                ) : (
                  <Eye
                    onClick={() => setPassword(!password)}
                    className="cursor-pointer absolute right-2 bottom-1 opacity-70 hover:opacity-100"
                  />
                )}
              </div>

              <div className="grid w-full relative mb-4 max-w-md items-center gap-1">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  className="p-1 w-full"
                  type={password ? "text" : "password"}
                  id="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {password ? (
                  <EyeOffIcon
                    onClick={() => setPassword(!password)}
                    className="cursor-pointer absolute right-2 bottom-1 opacity-70 hover:opacity-100"
                  />
                ) : (
                  <Eye
                    onClick={() => setPassword(!password)}
                    className="cursor-pointer absolute right-2 bottom-1 opacity-70 hover:opacity-100"
                  />
                )}
              </div>

              <div className="flex space-x-2 mb-2 pt-4">
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
                  <Link href="/terms" className="underline">
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              <Button
                disabled={!newPassword || !confirmPassword || changeLoading}
                type="submit"
                className="w-full"
              >
                Change Password
              </Button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Page;
