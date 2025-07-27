"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { searchPeoples } from "@/store/search/allSearchSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function Step3({
  externalLink,
  setExternalLink,
  tags,
  setTags,
  postControl,
  setPostControl,
  location,
  setLocation,
}: {
  externalLink: any[];
  setExternalLink: React.Dispatch<React.SetStateAction<any[]>>;
  tags: any[];
  setTags: React.Dispatch<React.SetStateAction<any[]>>;
  postControl: string;
  setPostControl: React.Dispatch<React.SetStateAction<string>>;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [tagName, setTagName] = useState("");
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [linkText, setLinkText] = useState("");
  const [peoples, setPeoples] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { peoples: sPeoples } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    if (tagName.length > 0) {
      dispatch(searchPeoples({ q: tagName, limit: 10, page: 1 }));
    }
  }, [dispatch, tagName]);

  useEffect(() => {
    setPeoples(() =>
      sPeoples.filter((person: any) =>
        tags.every((tag: any) => tag._id !== person._id)
      )
    );
  }, [sPeoples]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Label htmlFor="skills" className="text-sm font-medium">
          tags
        </Label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 mt-1">
            {tags.map((tag: any, index: number) => (
              <Badge
                key={index}
                className="flex items-center gap-1 px-1 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md opacity-80"
              >
                <span className="text-xs">{tag.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 text-xs w-4 p-0.5 text-gray-500 hover:text-red-500"
                  onClick={() => {
                    const updatedTags = tags.filter(
                      (s: any) => s._id !== tag._id
                    );
                    setTags(updatedTags);
                  }}
                >
                  ✕
                </Button>
              </Badge>
            ))}
          </div>
        )}
        <div className="relative">
          <Input
            type="text"
            id="tag"
            placeholder="Search connection tags..."
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onFocusCapture={() => {
              setOpen(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setOpen(false);
              }, 300);
            }}
            className="w-full"
          />
          {tagName && open && (
            <div className="absolute top-full left-0 w-full z-10 mt-1 bg-white rounded-md border shadow-md max-h-60 overflow-y-auto">
              {peoples.length === 0 ? (
                <div className="py-2 px-3 text-sm text-gray-500">
                  No peoples found.
                </div>
              ) : (
                <div className="max-h-60">
                  {peoples.map((person: any) => (
                    <div
                      key={person._id}
                      onClick={() => {
                        setTags((prev) => [...prev, person]);
                        setTagName("");
                        setOpen(false);
                      }}
                      className="cursor-pointer hover:bg-gray-100 p-2 text-sm text-gray-800 flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={person.avatar?.url} />
                          <AvatarFallback>
                            {person.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold">{person.name}</span>
                          <span className="text-xs text-gray-500">
                            {person.headline || "No headline available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Location */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="location" className="text-sm font-medium">
          Location
        </Label>
        <Input
          id="location"
          placeholder="Add location..."
          value={location}
          required
          onChange={(e) => setLocation(e.target.value)}
          className="resize-none"
        />
      </div>
      {/* External Links */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="externalLink" className="text-sm font-medium">
          External Link
        </Label>
        {externalLink.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 mt-1">
            {externalLink.map((link: any, index: number) => (
              <Badge
                key={index}
                className="flex items-center gap-1 px-1 py-1 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md opacity-80"
              >
                <span className="text-xs">{link.text}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 text-xs w-4 p-0.5 text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.preventDefault();
                    const updatedLinks = externalLink.filter(
                      (s: any) => s !== link
                    );
                    setExternalLink(updatedLinks);
                  }}
                >
                  ✕
                </Button>
              </Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            id="externalLink"
            placeholder="Add external link..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="resize-none"
          />
          <Input
            id="linkText"
            placeholder="Link text..."
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="resize-none"
          />
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              if (link && linkText) {
                setExternalLink((prev) => [...prev, { link, text: linkText }]);
                setLink("");
                setLinkText("");
              }
            }}
          >
            Add Link
          </Button>
        </div>
      </div>
      {/* Post Control */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="postControl" className="text-sm font-medium">
          Who can see this post?
        </Label>
        <Select value={postControl} onValueChange={setPostControl}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="connections">Connections Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default Step3;
