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
import { AppDispatch } from "@/store/store";
import { registerUser, resetUser } from "@/store/user/userSlice";
import { useRouter } from "next/navigation";

function Page() {
  const [password, setPassword] = useState(true);
  const [checkbox, setCheckbox] = useState(true);

  const [email, setEmail] = useState("");
  const [passworValue, setPasswordValue] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, login, loading, error } = useSelector(
    (state: any) => state.user
  );

  function submitHandler(e: React.FormEvent): void {
    e.preventDefault();

    if (!email || !passworValue || !name) {
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
      name,
      email,
      password: passworValue,
    };

    dispatch(registerUser(formData));
  }

  useEffect(() => {
    if (!loading && user && login) {
      toast.success("User registered successfully", {
        position: "top-center",
      });
      dispatch(resetUser());
      router.push("/u/" + user.username);
      return;
    }

    if (!loading && user && !login) {
      router.push("/u/" + user.username);
      return;
    }

    if (error) {
      toast.error(error, {
        position: "top-center",
      });
      dispatch(resetUser());
    }
  }, [error, user]);

  return (
    <>
      <main className="min-h-screen bg-backgrouund/70">
        <h3>LOGO</h3>
        <section className="w-full flex justify-center items-center h-screen">
          <div className="min-w-[320px] md:min-w-96 shadow-2xl dark:bg-zinc-800 bg-white rounded-lg p-6">
            <form
              className="flex flex-col justify-center"
              onSubmit={(e) => submitHandler(e)}
            >
              <div className="mb-4">
                <h2 className="text-2xl text-center font-bold">Register</h2>
                <div className="text-center opacity-80 text-sm">
                  Create your account.
                </div>
              </div>

              <div className="grid w-full mb-4 max-w-sm items-center gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  className="p-1"
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid w-full mb-4 max-w-sm items-center gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="p-1"
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid w-full relative mb-4 max-w-sm items-center gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  className="p-1"
                  type={password ? "text" : "password"}
                  id="password"
                  placeholder="Pasword"
                  value={passworValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
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
                  Remeber me
                </label>
              </div>

              <Button type="submit" className="w-full">
                Register
              </Button>
              <span className="text-sm mb-2 mt-1 opacity-80">
                By clicking the button, you agree to our
                <Link href="/terms" className="pl-2 underline">
                  Terms & Conditions
                </Link>
              </span>

              <div className="flex justify-center items-center gap-2 mt-4">
                <hr className="w-1/4" />
                <span className="text-sm opacity-80">Or continue with</span>
                <hr className="w-1/4" />
              </div>

              <div className="flex flex-col gap-5 justify-center py-2 mt-3">
                <Button
                  type="button"
                  variant={"outline"}
                  className="h-12 rounded-full shadow-xl w-full"
                >
                  <svg
                    height="300px"
                    width="300px"
                    version="1.1"
                    id="Layer_1"
                    viewBox="0 0 291.319 291.319"
                    fill="#000000"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <path
                          fill="#3B5998"
                          d="M145.659,0c80.45,0,145.66,65.219,145.66,145.66c0,80.45-65.21,145.659-145.66,145.659 S0,226.109,0,145.66C0,65.219,65.21,0,145.659,0z"
                        ></path>
                        <path
                          fill="#FFFFFF"
                          d="M163.394,100.277h18.772v-27.73h-22.067v0.1c-26.738,0.947-32.218,15.977-32.701,31.763h-0.055 v13.847h-18.207v27.156h18.207v72.793h27.439v-72.793h22.477l4.342-27.156h-26.81v-8.366 C154.791,104.556,158.341,100.277,163.394,100.277z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  continue With Facebook
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  className="h-12 rounded-full shadow-xl w-full"
                >
                  <svg
                    viewBox="0 0 32 32"
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    fill="none"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
                        fill="#EB4335"
                      ></path>
                    </g>
                  </svg>
                  continue With Facebook
                </Button>
              </div>

              <div className="text-center text-sm opacity-80 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Page;
