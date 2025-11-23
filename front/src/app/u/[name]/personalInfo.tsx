import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/store/axios";
import { AppDispatch, RootState } from "@/store/store";
import { getUser, userProfile } from "@/store/user/userSlice";
import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PersonalInfo({
  open,
  setClose,
}: {
  open: boolean;
  setClose: (val: boolean) => any;
}) {
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [link, setLink] = useState("");
  const [linkText, setLinkText] = useState("");
  const [pronouns, setPronouns] = useState("He/Him");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const imageUpload = (e: any) => {
    if (!e.target.files[0]) {
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result as string);
        setAvatar(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    const form = new FormData();

    // check if country is empty and state and city is filled show error to fill country name
    if (country === "" && (state !== "" || city !== "")) {
      toast.error("Please fill country name", { position: "top-center" });
      return;
    }

    // check if state is empty and city is filled show error to fill state name
    if (state === "" && city !== "") {
      toast.error("Please fill state name", { position: "top-center" });
      return;
    }

    form.append("name", name);
    form.append(
      "website",
      JSON.stringify({
        link,
        text: linkText,
      })
    );
    form.append("headline", headline);
    form.append(
      "location",
      JSON.stringify({
        country,
        state,
        city,
      })
    );
    form.append("pronouns", pronouns);

    if (avatarPreview !== user?.avatar?.url) {
      form.append("image", avatar);
    }

    try {
      setLoading(true);

      const { data } = await axios.put("/user/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(data.message, { position: "top-center" });
      setLoading(false);
      setClose(false);
      dispatch(userProfile(user.username));
      dispatch(getUser());
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, { position: "top-center" });
      } else toast.error("Something went wrong", { position: "top-center" });
    }
  };

  useEffect(() => {
    if (user) {
      setAvatar(user?.avatar ? user.avatar.url : "");
      setName(user.name);
      setLink(user?.website?.link);
      setLinkText(user?.website?.text);
      setHeadline(user.headline);
      setPronouns(user.pronouns);
      setCountry(user.location?.country || "");
      setState(user.location?.state || "");
      setCity(user.location?.city || "");
      setAvatarPreview(user.avatar?.url || "");
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={(val) => setClose(val)}>
      {user && (
        <DialogContent
          style={{ scrollbarWidth: "none" }}
          className="overflow-y-scroll h-[80vh]"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold">
              Edit Introduction
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <h3 className="font-semibold text-lg">Profile Picture</h3>
            <p className="opacity-80 text-sm -mt-1  mb-4">
              Please upload a profile picture
            </p>

            <Avatar className="flex-shrink-0 w-20 h-20 mb-4">
              {avatarPreview && (
                <AvatarImage
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-20 h-20"
                />
              )}
              {!avatarPreview && (
                <AvatarImage
                  src={user?.avatar?.url}
                  alt="Avatar"
                  className="w-20 h-20"
                />
              )}

              <AvatarFallback className="w-20 h-20">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Input
                type="file"
                accept="image/*"
                onChange={imageUpload}
                className="hidden"
                id="file-upload"
              />
              <div className="flex items-center gap-2">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-sm font-normal text-blue-500 hover:underline"
                >
                  Change Avatar
                </label>
                {avatarPreview && (
                  <Button
                    variant={"link"}
                    className="cursor-pointer text-sm font-medium text-red-500 hover:underline"
                    onClick={() => {
                      setAvatarPreview("");
                      setAvatar("");
                    }}
                  >
                    remove Avatar
                  </Button>
                )}
              </div>
            </div>

            <Separator className="my-4" />
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <p className="opacity-80 text-sm -mt-1  mb-4">
              Please fill out your information
            </p>

            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Label className="font-medium" htmlFor="username">
                Name
              </Label>
              <Input
                className="p-1 w-full"
                type="text"
                id="username"
                placeholder="Username"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Label className="font-medium" htmlFor="pronouns">
                Pronouns
              </Label>
              <Select value={pronouns} required onValueChange={setPronouns}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pronouns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="He/Him">He/Him</SelectItem>
                    <SelectItem value="She/Her">She/Her</SelectItem>

                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Label className="font-medium" htmlFor="headline">
                HeadLine
              </Label>
              <Textarea
                className="p-1 w-full"
                id="headline"
                placeholder="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <Separator className="my-4" />
            <h3 className="font-semibold text-lg">Location</h3>
            <p className="opacity-80 text-sm -mt-1  mb-4">
              Please fill out your location information
            </p>
            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Label className="font-medium" htmlFor="country">
                Country
              </Label>
              <Input
                className="p-1 w-full"
                id="country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Label className="font-medium" htmlFor="state">
                State
              </Label>
              <Input
                className="p-1 w-full"
                id="state"
                placeholder="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Label className="font-medium" htmlFor="city">
                City
              </Label>
              <Input
                className="p-1 w-full"
                id="city"
                placeholder="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <Separator className="my-4" />

            <h3 className="font-semibold text-lg">Website</h3>
            <p className="opacity-80 text-sm -mt-1  mb-4">
              Please fill out your website information
            </p>
            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Label className="font-medium" htmlFor="link">
                Link
              </Label>
              <Input
                className="p-1 w-full"
                id="link"
                placeholder="Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="grid w-full mb-4 max-w-sm items-center gap-1">
              <Label className="font-medium" htmlFor="linkText">
                Link Text
              </Label>
              <Input
                className="p-1 w-full"
                id="linkText"
                placeholder="Link Text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <DialogFooter className="flex justify-end items-center w-full">
              <Button
                variant={"outline"}
                className="mr-2"
                onClick={() => setClose(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default PersonalInfo;
