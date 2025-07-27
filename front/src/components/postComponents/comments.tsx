import React, { useEffect, useState, useCallback, Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import axios from "@/store/axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MessageCircleMoreIcon,
  Send,
  User,
  ThumbsUp,
  Reply,
  X,
  MoreHorizontal,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface UserType {
  _id: string;
  name: string;
  avatar?: { url: string };
}

interface Reply {
  _id: string;
  user: UserType;
  content: string;
  likes: string[];
}

interface Comment extends Reply {
  replies: Reply[];
}

function CommentActions({
  comment,
  userId,
  onDelete,
}: {
  comment: Reply;
  userId?: string;
  onDelete: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {comment.user?._id === userId && (
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(comment._id)}
            >
              <X className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RepliesList({
  replies,
  commentId,
  expanded,
  onLike,
  userId,
  onDelete,
}: {
  replies: Reply[];
  commentId: string;
  expanded: boolean;
  onLike: (replyId: string) => void;
  userId?: string;
  onDelete: (id: string) => void;
}) {
  if (!replies?.length || !expanded) return null;
  return (
    <div className="pl-8 pt-4 flex flex-col gap-2 w-full">
      {replies.map((reply) => (
        <Fragment key={reply._id}>
          <div className="flex w-full justify-between items-start">
            <div className="flex gap-2 items-start">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={reply.user?.avatar?.url}
                  alt={reply.user?.name || "User"}
                />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <span className="font-medium text-xs">
                  {reply.user?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {reply.content}
                </span>
                <div className="flex gap-2 mt-1 opacity-80">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onLike(reply._id)}
                    aria-label="Like reply"
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${
                        reply.likes?.includes(userId || "")
                          ? "fill-foreground"
                          : ""
                      }`}
                    />
                    <span className="ml-1 text-xs">
                      {reply.likes?.length || 0}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <CommentActions
              comment={reply}
              userId={userId}
              onDelete={onDelete}
            />
          </div>
          <Separator className="opacity-40" />
        </Fragment>
      ))}
    </div>
  );
}

function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  const { user } = useSelector((state: RootState) => state.user);

  const getAllComments = useCallback(async () => {
    if (!postId) return;
    if (!open) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/comments/all/${postId}`);
      setComments(data.comments);
    } catch {
      toast.error("Failed to fetch comments", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }, [postId, open]);

  useEffect(() => {
    getAllComments();
    setExpandedReplies({});
  }, [getAllComments, postId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim()) return;
      try {
        if (replyingTo) {
          await axios.post(`/comments/reply`, {
            reply: inputText,
            postId,
            commentId: replyingTo,
          });
          toast.success("Reply added!", { position: "top-center" });
        } else {
          await axios.post(`/comments/create`, {
            comment: inputText,
            type: "comment",
            postId,
          });
          toast.success("Comment added!", { position: "top-center" });
        }
        setInputText("");
        setReplyingTo(null);
        getAllComments();
      } catch {
        toast.error(
          replyingTo ? "Failed to add reply" : "Failed to add comment",
          { position: "top-center" }
        );
      }
    },
    [inputText, replyingTo, postId, getAllComments]
  );

  const handleLike = useCallback(
    async (commentId: string) => {
      try {
        await axios.get(`/comments/like/${commentId}`);
        getAllComments();
      } catch {
        toast.error("Failed to like comment", { position: "top-center" });
      }
    },
    [getAllComments]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/comments/${id}`);
        toast.success("Comment deleted", { position: "top-center" });
        getAllComments();
      } catch {
        toast.error("Failed to delete comment", { position: "top-center" });
      }
    },
    [getAllComments]
  );

  const toggleReplies = useCallback((commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (val) {
          getAllComments();
        }
        setOpen(val);
      }}
    >
      <DialogTrigger asChild>
        <div className="flex-col hover:cursor-pointer hover:scale-105 w-16 gap-1 items-center flex">
          <MessageCircleMoreIcon className="h-5 w-5" />
          <span className="text-sm opacity-80">Comment</span>
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90%] overflow-auto pb-0"
        style={{ scrollbarWidth: "thin" }}
      >
        <DialogTitle>Comments</DialogTitle>
        <div
          style={{ scrollbarWidth: "none" }}
          className="w-full min-h-48 overflow-auto max-h-80 py-2 flex gap-2 flex-col pb-[70px]"
        >
          {loading ? (
            <div className="text-center text-muted-foreground py-4">
              Loading...
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <Fragment key={comment._id}>
                <div className="flex justify-between flex-col items-center w-full">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 items-start">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment.user?.avatar?.url}
                          alt={comment.user?.name || "User"}
                        />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1">
                        <span className="font-medium text-sm">
                          {comment.user?.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {comment.content}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-80"
                            onClick={() => handleLike(comment._id)}
                            aria-label="Like comment"
                          >
                            <ThumbsUp
                              className={`h-4 w-4 ${
                                comment.likes?.includes(user?._id)
                                  ? "fill-foreground"
                                  : ""
                              }`}
                            />
                            <span className="ml-1 text-[10px] opacity-70">
                              {comment.likes?.length || 0}
                            </span>
                          </Button>
                          <Button
                            variant={
                              replyingTo === comment._id ? "default" : "ghost"
                            }
                            size="icon"
                            className="h-7 w-7 opacity-80"
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === comment._id ? null : comment._id
                              )
                            }
                            aria-label="Reply"
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CommentActions
                      comment={comment}
                      userId={user?._id}
                      onDelete={handleDelete}
                    />
                  </div>
                  <RepliesList
                    replies={comment.replies}
                    commentId={comment._id}
                    expanded={!!expandedReplies[comment._id]}
                    onLike={handleLike}
                    userId={user?._id}
                    onDelete={handleDelete}
                  />
                  {comment.replies?.length > 0 && (
                    <Button
                      variant="ghost"
                      className="px-0 py-0 text-[11px] opacity-70 flex justify-start mt-1 items-center gap-1 h-4"
                      onClick={() => toggleReplies(comment._id)}
                    >
                      {expandedReplies[comment._id]
                        ? "Hide Replies"
                        : `Show ${comment.replies.length} Replies`}
                    </Button>
                  )}
                </div>
                <Separator className="opacity-60" />
              </Fragment>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No comments yet.
            </div>
          )}
        </div>
        <DialogFooter className="fixed bottom-0 px-6 pb-6 bg-background left-0 w-full pt-2">
          <form
            className="flex w-full gap-2 items-center"
            onSubmit={handleSubmit}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar?.url} alt={user?.name || "User"} />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <Input
              name="comment"
              type="text"
              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
              className="flex-1 border rounded-full px-4 py-2 text-sm bg-background"
              autoComplete="off"
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
              autoFocus
              aria-label={replyingTo ? "Reply input" : "Comment input"}
            />
            {replyingTo && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  setReplyingTo(null);
                  setInputText("");
                }}
                title="Cancel reply"
                aria-label="Cancel reply"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              disabled={!inputText.trim()}
              type="submit"
              className="rounded-full"
              size="sm"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Comments;
