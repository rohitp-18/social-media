import React, { Fragment, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import axios from "@/store/axios";
import { toast } from "sonner";

function RecommendGroups({ id }: { id?: string }) {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { changeFollow, message, user } = useSelector(
    (state: RootState) => state.user
  );

  async function fetchData() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/groups/recommended${id ? `?groupId=${id}` : ""}`
      );

      setGroups(data.groups);
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
    }
  }, [changeFollow]);
  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Recommended Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-2">
        {groups.length > 0 &&
          groups.map((group, i) => (
            <Fragment key={group._id}>
              <div className="flex flex-col justify-between my-2 items-start">
                <div className="flex justify-start items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={group.avatar?.url} />
                    <AvatarFallback>
                      <User2 className="w-8 h-8 p-1.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col max-w-96">
                    <span className="font-semibold line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                      {group.name}
                    </span>
                    <span className="text-xs opacity-60 line-clamp-2 leading-tight text-ellipsis overflow-hidden">
                      {group.headline}
                    </span>
                    <span className="opacity-90 text-sm">
                      {group.members.length} Members
                    </span>
                  </div>
                </div>

                <Button
                  className="flex items-center w-min md:ml-8 mt-2 px-7 py-2 border-primary text-primary hover:text-white hover:bg-primary rounded-full"
                  variant={"outline"}
                  size={"sm"}
                >
                  Join
                </Button>
              </div>
              <hr className="my-1" />
            </Fragment>
          ))}
      </CardContent>
    </Card>
  );
}

export default RecommendGroups;
