import React, { Fragment, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus, User2 } from "lucide-react";
import axios from "@/store/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { resetUser, toggleFollow } from "@/store/user/userSlice";

function RecommendUser() {
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
  }, []);

  useEffect(() => {
    if (changeFollow) {
      toast.success(message, { position: "top-center" });
      dispatch(resetUser());
    }
  }, [changeFollow]);
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="pb-2">
        <h3 className="text-base font-semibold">People also viewed</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {users.length > 0 &&
          users.map((user, i: number) => (
            <Fragment key={user._id}>
              <div className="flex justify-start items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar?.url} />
                  <AvatarFallback>
                    <User2 className="w-8 h-8 p-1.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-sm opacity-70 line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                    {user.headline}
                  </span>
                  <Button
                    className="flex items-center mt-2 px-3 rounded-full"
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => dispatch(toggleFollow(user._id))}
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
                </div>
              </div>
              {i !== users.length - 1 && <hr />}
            </Fragment>
          ))}
      </CardContent>
    </Card>
  );
}

export default RecommendUser;
