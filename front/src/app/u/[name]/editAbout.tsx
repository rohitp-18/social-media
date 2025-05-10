import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function EditAbout({
  open,
  setClose,
}: {
  open: boolean;
  setClose: (val: boolean) => any;
}) {
  const [about, setAbout] = useState<string>("");

  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user) {
      setAbout(user.about);
    }
  }, [user]);
  return (
    <Dialog open={open} onOpenChange={(val) => setClose(val)}>
      <DialogContent
        style={{ scrollbarWidth: "none" }}
        className="overflow-y-scroll md:min-w-96 max-h-[90vh] w-full sm:max-w-[450px]"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            About
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            This will be visible to everyone who visits your profile. <br />
            Please keep it respectful and appropriate.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="grid w-full mb-4 max-w-sm items-center gap-1">
            <Label className="font-medium" htmlFor="about">
              About
            </Label>
            <Textarea
              className="p-1 w-full"
              id="about"
              autoFocus
              placeholder="About you..."
              value={about}
              rows={5}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
          <DialogFooter className="flex justify-end">
            <Button
              variant={"link"}
              className="cursor-pointer text-sm font-medium text-red-500 hover:underline"
              onClick={() => setClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAbout;
