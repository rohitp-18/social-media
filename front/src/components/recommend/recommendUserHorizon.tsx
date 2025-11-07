import React, { Fragment, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Plus, X } from "lucide-react";
import axios from "@/store/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { resetUser, toggleFollow } from "@/store/user/userSlice";
import Link from "next/link";
import { SecondaryLoader } from "../loader";

function RecommendUserHorizon({ force }: { force?: boolean }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const {
    changeFollow,
    message,
    user: loginUser,
  } = useSelector((state: RootState) => state.user);

  async function fetchData() {
    try {
      setLoading(true);
      const { data } = await axios.get("/user/recommend");

      setUsers(data.users);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [loginUser]);

  useEffect(() => {
    if (changeFollow) {
      toast.success(message, { position: "top-center" });
      dispatch(resetUser());
    }
  }, [changeFollow]);

  if (loading) return <SecondaryLoader />;

  if (users.length === 0) return null;

  return (
    <Card className={"flex my-4 flex-col gap-4" + force ? "" : " md:hidden"}>
      <CardHeader className="pb-2">
        <h3 className="text-base font-semibold">People also viewed</h3>
      </CardHeader>
      <CardContent className="flex flex-row gap-4 overflow-x-auto">
        {users.length > 0 &&
          users.map((user, i: number) => (
            <Card
              className="border flex flex-col justify-between p-1 min-w-48 h-60 relative"
              key={user._id}
            >
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={(e) => {
                  setUsers((prevUsers) =>
                    prevUsers.filter((u) => u._id !== user._id)
                  );
                  e.stopPropagation();
                }}
                className="absolute top-1 right-1 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
              <CardContent className="flex items-center flex-col gap-2">
                <Link
                  href={`/user/${user._id}`}
                  className="flex justify-center items-center flex-col"
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center items-center mt-2">
                    <span className="font-semibold text-center line-clamp-2 overflow-hidden text-ellipsis">
                      {user.name}
                    </span>
                    <span className="text-sm text-center text-muted-foreground line-clamp-2 overflow-hidden text-ellipsis">
                      {user.headline}
                    </span>
                  </div>
                </Link>
              </CardContent>
              <CardFooter>
                <Button
                  className="flex items-center mt-2 px-3 w-full rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!loginUser) {
                      toast.error("You must be logged in to follow users", {
                        position: "top-center",
                      });
                      return;
                    }
                    dispatch(toggleFollow(user._id));
                  }}
                >
                  {loginUser && loginUser.following.includes(user._id) ? (
                    <Check />
                  ) : (
                    <Plus />
                  )}
                  {loginUser && loginUser.following.includes(user._id)
                    ? "Following"
                    : "Follow"}
                </Button>
              </CardFooter>
            </Card>
          ))}
      </CardContent>
    </Card>
  );
}

export default RecommendUserHorizon;
