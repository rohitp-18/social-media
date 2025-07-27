"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User2, Edit2 } from "lucide-react";
import Image from "next/image";
import back from "@/assets/back.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  updateCompanyBanner,
  resetcompany,
  clearError,
} from "@/store/company/companySlice";
import { toast } from "sonner";

function CompanyHeader({ isAdmin }: { isAdmin: boolean }) {
  const [edit, setEdit] = useState(false);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null
  );
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { company, updated, error } = useSelector(
    (state: RootState) => state.company
  );

  const handleBannerImageChange = useCallback(
    (e: any) => {
      if (e.target.files[0]) {
        setBannerImage(e.target.files[0]);

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setBannerImagePreview(reader.result as string);
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    },
    [bannerImagePreview, bannerImage]
  );

  const handleBannerImageRemove = useCallback(() => {
    setBannerImage(null);
    setBannerImagePreview(null);
  }, [bannerImage, bannerImagePreview]);

  const handleBannerSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const formData = new FormData();
      if (!bannerImage) {
        formData.append("remove", "true");
      } else {
        formData.append("banner", bannerImage);
      }
      setLoading(true);
      dispatch(updateCompanyBanner({ id: company._id, form: formData }));
    },
    [bannerImage, company._id, dispatch]
  );

  useEffect(() => {
    if (updated) {
      setEdit(false);
      setBannerImagePreview(null);
      setBannerImage(null);
      setLoading(false);
      dispatch(resetcompany());
      toast.success("Banner updated successfully", { position: "top-center" });
    }
    if (error) {
      toast.error(error, { position: "top-center" });
      setLoading(false);
      dispatch(clearError());
    }
  }, [updated, error]);
  return (
    <CardHeader className="p-0 rounded-2xl pb-3 flex flex-row justify-between items-center gap-2">
      <div className="flex flex-col relative w-full">
        {company.bannerImage ? (
          <img
            loading="lazy"
            src={company.bannerImage.url}
            alt="background"
            className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
          />
        ) : (
          <Image
            src={back}
            alt="background"
            className="w-full aspect-[4/1] flex-shrink-0 rounded-t-lg"
          />
        )}
        <Avatar className="w-24 h-24 md:w-36 p-2 bg-background border-3 border-background md:-mt-16 md:h-36 ml-5 -mt-12">
          <AvatarImage src={company.avatar?.url} />
          <AvatarFallback>
            <User2 className="w-20 opacity-70 h-20 p-5" />
          </AvatarFallback>
        </Avatar>
        {isAdmin && (
          <Dialog open={edit} onOpenChange={(val) => setEdit(val)}>
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
              <form onSubmit={handleBannerSubmit}>
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
  );
}

export default CompanyHeader;
