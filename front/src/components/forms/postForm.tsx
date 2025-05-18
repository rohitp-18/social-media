import React, { useEffect, useRef, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  createPost,
  getProfileActivity,
  resetPost,
  updatePost,
} from "@/store/user/userPostSlice";
import { Image, Video, X } from "lucide-react";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function PostForm({
  onClose,
  post,
  username,
  isUser,
  edit,
}: {
  onClose: () => void;
  post: any;
  username: string;
  isUser: boolean;
  edit: boolean;
}) {
  const [content, setContent] = useState<string>("");
  const [video, setVideo] = useState<any>();
  const [newVideo, setNewVideo] = useState<any>();
  const [videoPreview, setVideoPreview] = useState<any>();
  const [tags, setTags] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [tagName, setTagName] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [externalLink, setExternalLink] = useState<any[]>([]);
  const [link, setLink] = useState<string>("");
  const [linkText, setLinkText] = useState<string>("");
  const [postControl, setPostControl] = useState<string>("public");

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, created, updated, message, error } = useSelector(
    (state: RootState) => state.userPosts
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { connections } = useSelector((state: RootState) => state.search);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step !== 2) {
      return;
    }
    if (content.length < 10) {
      toast.error("Content must be at least 10 characters long.", {
        description: "Please write a longer post.",
        position: "top-center",
      });
      return;
    }
    const formData = new FormData();
    formData.append("content", content);
    tags.forEach((tag) => formData.append("tags", tag._id));
    formData.append("location", location);
    formData.append("externalLinks", JSON.stringify(externalLink));
    formData.append("privacyControl", postControl);
    formData.append("postType", "user");

    if (edit) {
      if (images.length > 0) {
        images.forEach((image) =>
          formData.append("images", JSON.stringify(image))
        );
      }
      if (newImages.length > 0) {
        newImages.forEach((image) => formData.append("newImages", image));
      }
      if (video) {
        formData.append("video", JSON.stringify(video));
      }
      if (newVideo) {
        formData.append("newImages", newVideo);
      }

      dispatch(updatePost({ userPostId: post._id, data: formData }));
      return;
    }

    newImages.forEach((image) => formData.append("images", image));
    newVideo && formData.append("video", newVideo);

    // Dispatch the form data
    dispatch(createPost(formData));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!e.target.files) return;
    if (newImages.length + images.length > 5) {
      toast.error(
        "You can only upload up to 5 images. Please remove some images.",
        {
          description: "Please remove some images to upload more.",
          position: "top-center",
        }
      );
      return;
    }
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview((preview) => [...preview, ...previews].slice(0, 5));
    setNewImages((prev) => [...prev, ...files].slice(0, 5));
  }

  function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setNewVideo(file.name);
    }
  }

  const clearForm = () => {
    setStep(0);
    setTagName("");
    setContent("");
    setVideo("");
    setNewVideo("");
    setImagePreview([]);
    setNewImages([]);
    setTags([]);
    setLocation("");
    setExternalLink([]);
    setLink("");
    setLinkText("");
    setPostControl("public");
  };

  useEffect(() => {
    if (post && edit) {
      clearForm();
      setContent(post.content);
      setTags(post.tags);
      setLocation(post.location);
      setImages(post.images);
      setVideo(post.video);
      setExternalLink(post.externalLinks);
      setPostControl(post.privacyControl);
      setStep(0);
      setTagName("");
    }
  }, [post, edit]);

  useEffect(() => {
    if (created || updated) {
      toast.success(message, {
        position: "top-center",
      });
      dispatch(resetPost());
      clearForm();
      dispatch(getProfileActivity(username));
      onClose();
    }
    if (error) {
      toast.error(error, {
        description: error,
        position: "top-center",
      });
    }
  }, [created, updated, error, message]);

  return (
    <DialogContent
      style={{ scrollbarWidth: "thin" }}
      className="max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Post" : "Create Post"}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {step === 0
              ? edit
                ? "Edit your post content."
                : "Write the content for your new post."
              : step === 1
              ? "Add up to 5 images or 1 video."
              : "Add tags and location to your post."}
          </p>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-6">
          {/* Part 1: Main Content */}
          {step === 0 && (
            <div className="flex flex-col gap-5 py-2">
              <div className="flex flex-col gap-2">
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="resize-none border-none focus-visible:ring-0 focus-visible:border-none"
                  rows={10}
                />
              </div>
            </div>
          )}
          {/* Part 2: Media Upload */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              {newImages.length === 0 && images.length === 0 && (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="video" className="text-sm font-medium">
                    Video
                  </Label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => videoRef.current?.click()}
                  >
                    <Input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={videoRef}
                      onChange={handleVideoUpload}
                    />
                    <Video className="h-5 w-5 text-gray-500" />
                    Upload Video
                  </Button>
                  {videoPreview && (
                    <div className="relative">
                      <div className="absolute inset-0 opacity-30 rounded-md" />
                      <Button
                        size={"icon"}
                        variant="destructive"
                        onClick={() => {
                          setVideoPreview("");
                          setNewVideo("");
                          console.log("videoPreview", videoPreview);
                        }}
                        className="absolute top-2 right-2 z-10"
                      >
                        <X className="h-3 w-3 text-white" />
                      </Button>
                      <video
                        src={videoPreview}
                        controls
                        className="max-h-[80vh] w-full h-auto mt-2 object-contain rounded-md"
                      ></video>
                    </div>
                  )}
                  {video && (
                    <div className="relative">
                      <div className="absolute inset-0 opacity-30 rounded-md" />
                      <Button
                        size={"icon"}
                        variant="destructive"
                        onClick={() => {
                          setVideo("");
                        }}
                        className="absolute top-2 right-2 z-10"
                      >
                        <X className="h-3 w-3 text-white" />
                      </Button>
                      <video
                        src={video}
                        controls
                        className="max-h-[80vh] w-full h-auto mt-2 object-contain rounded-md"
                      ></video>
                    </div>
                  )}
                </div>
              )}
              {!video && !newVideo && (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="images" className="text-sm font-medium">
                    Images
                  </Label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => imageRef.current?.click()}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      ref={imageRef}
                      onChange={handleImageUpload}
                    />
                    <Image className="h-5 w-5 text-gray-500" />
                    Upload Images
                  </Button>
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {imagePreview.map((preview, index) => (
                        <div className="relative" key={index}>
                          <div className="absolute inset-0 bg-black opacity-30 rounded-md" />
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => {
                              setImagePreview((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                              setNewImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute top-1 right-1 p-0.5 h-5 w-5"
                          >
                            <X className="h-2.5 w-2.5 text-white" />
                          </Button>
                          <img
                            src={preview}
                            alt={`Preview ${index}`}
                            className="w-full h-auto rounded-md"
                          />
                        </div>
                      ))}
                      {images.map((preview, index) => (
                        <div className="relative" key={index}>
                          <div className="absolute inset-0 bg-black opacity-30 rounded-md" />
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => {
                              setImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute top-1 right-1 p-0.5 h-5 w-5"
                          >
                            <X className="h-2.5 w-2.5 text-white" />
                          </Button>
                          <img
                            src={preview}
                            alt={`Preview ${index}`}
                            className="w-full h-auto rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Part 3: Tags and Links */}
          {step === 2 && (
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
                      {connections.length === 0 ? (
                        <div className="py-2 px-3 text-sm text-gray-500">
                          No connections found.
                        </div>
                      ) : (
                        <div className="max-h-60">
                          {connections.map((connection: any) => (
                            <div
                              key={connection._id}
                              onClick={() => {
                                setTags((prev) => [...prev, connection]);
                                setTagName("");
                                setOpen(false);
                              }}
                              className="cursor-pointer hover:bg-gray-100 p-2 text-sm text-gray-800 flex items-center gap-2"
                            >
                              {connection.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Add location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="resize-none"
                />
              </div>
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
                        setExternalLink((prev) => [
                          ...prev,
                          { link, text: linkText },
                        ]);
                        setLink("");
                        setLinkText("");
                      }
                    }}
                  >
                    Add Link
                  </Button>
                </div>
              </div>
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
                    <SelectItem value="connections">
                      Connections Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type={step === 2 ? "submit" : "button"}
            disabled={loading}
            onClick={(e) => {
              if (step !== 2) {
                e.preventDefault();
                setStep((next) => (next !== 2 ? next + 1 : next));
              }
            }}
          >
            {step === 2 ? (edit ? "Update Post" : "Create Post") : "Next"}
          </Button>
          {step !== 0 && (
            <Button
              variant="outline"
              type="button"
              onClick={() => step > 0 && setStep((prev) => prev - 1)}
            >
              {step > 0 && "Back"}
            </Button>
          )}
          <DialogClose onClick={onClose} asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default PostForm;
