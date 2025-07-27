import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  clearError,
  createPost,
  resetPosts,
  updatePost,
} from "@/store/utils/postSlice";
import { ArrowLeft, Image, User2, Video, X } from "lucide-react";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import Step3 from "./step3";

function PostForm({
  target,
  type,
  post,
  edit,
}: {
  type: string;
  target: string;
  post?: any;
  edit?: boolean;
}) {
  const [content, setContent] = useState<string>("");
  const [video, setVideo] = useState<any>();
  const [newVideo, setNewVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<any>();
  const [tags, setTags] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<any[]>([]);
  const [location, setLocation] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [externalLink, setExternalLink] = useState<any[]>([]);
  const [postControl, setPostControl] = useState<string>("public");

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    created,
    updated,
    message,
    error,
    post: newPost,
  } = useSelector((state: RootState) => state.posts);
  const { company } = useSelector((state: RootState) => state.company);
  const { group } = useSelector((state: RootState) => state.group);

  // Handle form submission
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
    formData.append("postType", type);
    formData.append("origin", target);

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
    newVideo && formData.append("images", newVideo);

    // Dispatch the form data
    dispatch(createPost(formData));
  }

  // Handle image upload
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

  // Handle video upload
  function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setNewVideo(file);
    }
  }

  // Clear form function
  const clearForm = () => {
    setStep(0);
    setContent("");
    setVideo("");
    setNewVideo(null);
    setImagePreview([]);
    setNewImages([]);
    setTags([]);
    setLocation("");
    setExternalLink([]);
    setPostControl("public");
  };

  // Clear form when the component mounts or when the post is edited
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
    }
  }, [post, edit]);

  // Show success or error messages
  useEffect(() => {
    if (created || updated) {
      toast.success(message, {
        position: "top-center",
      });
      dispatch(resetPosts());
      clearForm();
      newPost
        ? router.push(`/post/${newPost?._id}`)
        : router.push(`/${type}/${target}`);
    }
    if (error) {
      toast.error(error, {
        description: error,
        position: "top-center",
      });
      dispatch(clearError());
    }
  }, [created, updated, error, message]);

  return (
    <section className="flex flex-col items-center gap-10">
      {/* get back button */}
      <div className="w-full flex justify-start items-center">
        <Button
          variant="outline"
          className="border-none flex gap-4 items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold text-base">Back</span>
        </Button>
      </div>
      <div className="w-full">
        {/* post owner details */}
        <Card className="w-full max-w-2xl mx-auto p-4 mb-4 shadow-sm border border-gray-200 rounded-lg">
          <Link
            href={
              type === "company"
                ? `/company/${company.id}`
                : `/group/${group.id}`
            }
            className="flex items-center space-x-4"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  type === "company" ? company?.avatar?.url : group?.avatar?.url
                }
              />
              <AvatarFallback>
                <User2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold">
                {type === "company" ? company.name : group.name}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {type === "company" ? "Company" : "Group"}
              </p>
            </div>
          </Link>
        </Card>
        {/* post form */}
        <form onSubmit={handleSubmit}>
          <Card className="w-full max-w-2xl mx-auto p-6">
            {/* post header */}
            <CardHeader className="p-0">
              <CardTitle>{edit ? "Edit Post" : "Create Post"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {step === 0
                  ? edit
                    ? "Edit your post content."
                    : "Write the content for your new post."
                  : step === 1
                  ? "Add up to 5 images or 1 video."
                  : "Add tags and location to your post."}
              </p>
            </CardHeader>
            {/* post main content */}
            <CardContent className="flex flex-col gap-5 py-6">
              {/* Part 1: Main Content */}
              {step === 0 && (
                <div className="flex flex-col gap-5 py-2">
                  <div className="flex flex-col gap-2">
                    <Textarea
                      id="content"
                      placeholder="Write your post content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="resize-none border focus-visible:ring-0"
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
                              setNewVideo(null);
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
                                loading="lazy"
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
                                loading="lazy"
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
                <Step3
                  externalLink={externalLink}
                  setExternalLink={setExternalLink}
                  tags={tags}
                  setTags={setTags}
                  postControl={postControl}
                  setPostControl={setPostControl}
                  location={location}
                  setLocation={setLocation}
                />
              )}
            </CardContent>
            {/* post footer with navigation buttons */}
            <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
              <div className="flex gap-2">
                <Button variant="secondary" type="button" onClick={router.back}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                {step !== 0 && (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setStep((prev) => prev - 1)}
                  >
                    Back
                  </Button>
                )}
              </div>
              <Button
                type={step === 2 ? "submit" : "button"}
                disabled={loading}
                onClick={(e) => {
                  if (step !== 2) {
                    e.preventDefault();
                    setStep((prev) => prev + 1);
                  }
                }}
              >
                {step === 2 ? (edit ? "Update Post" : "Create Post") : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </section>
  );
}

export default PostForm;
