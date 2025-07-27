import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Plus, User2 } from "lucide-react";
import back from "@/assets/back.png";
import Image from "next/image";
import { AlertDialogFooter } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import axios from "@/store/axios";
import { toggleFollow, userProfile } from "@/store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";

function ProfilePageCard({
  profile,
  isUser,
  setEditIntro,
}: {
  profile: any;
  isUser: boolean;
  setEditIntro: (val: boolean) => void;
}) {
  const [bannerImage, setBannerImage] = useState<string | File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const handleBannerImageRemove = () => {
    setBannerImage(null);
    setBannerImagePreview(null);
  };

  async function removeBannerImage() {
    try {
      setLoading(true);
      const { data } = await axios.put("/user/update/banner", { remove: true });
      setLoading(false);
      if (data.success) {
        toast.success(data.message, {
          description: "Banner removed successfully",
          position: "top-center",
        });
        setBannerImagePreview(null);
        setBannerImage(null);
      } else {
        toast.error(data.message, {
          description: "Please try again",
          position: "top-center",
        });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message, {
          description: "Please try again",
          position: "top-center",
        });
        return;
      } else {
        toast.error("Something went wrong", {
          description: "Please try again",
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Handle form submission logic here
    const formData = new FormData();
    if (!bannerImage) {
      removeBannerImage();
      return;
    }

    formData.append("image", bannerImage);

    try {
      setLoading(true);

      const { data } = await axios.put("/user/update/banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      if (data.success) {
        toast.success(data.message, {
          description: "Banner updated successfully",
          position: "top-center",
        });
        setBannerImagePreview(null);
        setBannerImage(null);
      } else {
        toast.error(data.message, {
          description: "Please try again",
          position: "top-center",
        });
      }
      dispatch(userProfile(profile.user.username));
      setEdit(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message, {
          description: "Please try again",
          position: "top-center",
        });
        return;
      } else {
        toast.error("Something went wrong", {
          description: "Please try again",
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const handleBannerImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log(file);
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setBannerImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  function handleDialogClose(val: boolean) {
    setEdit(val);
    setBannerImagePreview(null);
    setBannerImage(null);
  }

  useEffect(() => {
    if (profile) {
      setBannerImage(profile.user?.bannerImage?.url);
    }
  }, [profile]);

  return (
    <Card>
      <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col relative w-full">
          {profile.user.bannerImage ? (
            <img
              loading="lazy"
              src={profile.user.bannerImage.url}
              alt="background"
              className="w-full aspect-[4/1] flex-shrink-0 rounded-lg"
            />
          ) : (
            <Image
              src={back}
              alt="background"
              className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
            />
          )}
          <Avatar className="w-24 h-24 md:w-36 p-2 bg-background border-3 border-background md:-mt-16 md:h-36 ml-5 -mt-12">
            <AvatarImage src={profile.user?.avatar?.url} />
            <AvatarFallback>
              <User2 className="w-20 opacity-70 h-20 p-5" />
            </AvatarFallback>
          </Avatar>
          {isUser && (
            <Dialog open={edit} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full"
                >
                  <Edit2 className="w-4 h-4 opacity-90" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Make changes to your profile information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col justify-center gap-10 py-4">
                    <div className="w-full aspect-[4/1] flex-shrink-0 rounded-lg">
                      {bannerImagePreview ? (
                        <img
                          loading="lazy"
                          src={bannerImagePreview}
                          alt="background"
                          className="w-full aspect-[4/1] flex-shrink-0 rounded-lg"
                        />
                      ) : (
                        <Image
                          src={back}
                          alt="background"
                          className="w-full aspect-[4/1] flex-shrink-0 rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Label className="text-sm" htmlFor="banner">
                        Upload Banner Image
                      </Label>
                      <Input
                        type="file"
                        id="banner"
                        onChange={handleBannerImageChange}
                        className="col-span-3"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <AlertDialogFooter className="gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-muted-foreground hover:text-red-500"
                      onClick={handleBannerImageRemove}
                    >
                      Remove banner
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary"
                    >
                      Save changes
                    </Button>
                  </AlertDialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1 md:px-4 pt-0 pb-3">
          <h3 className="md:text-2xl text-xl pb-2 font-semibold">
            {profile.user.name}
            {profile.user.pronouns && (
              <span className="text-xs pl-2 opacity-70">
                ({profile.user.pronouns})
              </span>
            )}
          </h3>
          <span className="text-[15px]">{profile.user.headline}</span>
          {profile.user.educcation && profile.user.education[0] && (
            <span className="text-opacity-90 md:hidden text-sm opacity-70">
              {profile.user.education[0]}
            </span>
          )}
          {profile.user.location && (
            <div className="flex justify-start items-center gap-2">
              <h3 className="text-opacity-50 text-sm -mt-1 opacity-50">
                {`${
                  profile.user.location.city
                    ? profile.user.location.city + ", "
                    : ""
                }${
                  profile.user.location.state
                    ? profile.user.location.state + ", "
                    : ""
                }${
                  profile.user.location.country
                    ? profile.user.location.country
                    : ""
                }`}
              </h3>
            </div>
          )}
          <div className="flex opacity-60 items-center gap-2">
            <Link
              href={`/u/${profile.user.username}/peoples/followers`}
              className="hover:underline hover:opacity-100 opacity-80"
            >
              <span className="text-sm pr-1 font-semibold">
                {profile.user.totalFollowers}
              </span>
              <span className="text-sm">Followers</span>
            </Link>
            <Link
              href={`/u/${profile.user.username}/peoples/following`}
              className="hover:underline hover:opacity-100 opacity-80"
            >
              <span className="text-sm pr-1 font-semibold">
                {profile.user.totalFollowing}
              </span>
              <span className="text-sm">Following</span>
            </Link>
            <Link
              href={`/u/${profile.user.username}/peoples/connections`}
              className="hover:underline hover:opacity-100 opacity-80"
            >
              <span className="text-sm pr-1 font-semibold">
                {profile.user.totalConnections}
              </span>
              <span className="text-sm">Connections</span>
            </Link>
          </div>
        </div>
        {isUser && (
          <div className="flex justify-start items-start">
            <Edit2
              onClick={() => setEditIntro(true)}
              className="w-5 h-5 opacity-90"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-start items-center gap-3">
        {isUser ? (
          <Button
            className="flex items-center border-primary text-primary rounded-full hover:text-white hover:bg-primary"
            variant={"outline"}
          >
            Edit Profile
          </Button>
        ) : (
          <>
            {user?.following.includes(profile.user._id) ? (
              <Button
                className="flex items-center rounded-full"
                variant={"outline"}
                onClick={() => dispatch(toggleFollow(profile.user._id))}
              >
                Following
              </Button>
            ) : (
              <Button
                className="flex items-center rounded-full"
                variant={"default"}
                onClick={() => dispatch(toggleFollow(profile.user._id))}
              >
                <Plus /> Follow
              </Button>
            )}
            <Button
              className="flex items-center border-primary text-primary rounded-full"
              variant={"outline"}
            >
              Message
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProfilePageCard;
