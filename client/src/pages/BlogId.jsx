import { useContext, useEffect, useState } from "react";

import axios from "axios";
import { Edit, Loader2, Trash, TriangleAlert } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

import { Separator } from "@/components/ui/separator";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import "./comment.css";
import CommentCard from "@/components/Comment";
import StarIcon from "@/components/ui/StarIcon";
import { AuthContext } from "@/providers/auth-provider";
import Cookies from "js-cookie";

function BlogIdPage() {
  const param = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [comment, setComment] = useState();
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();
  const token = Cookies.get("authtoken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  async function onSubmit() {
    const backendURL = import.meta.env.VITE_PUBLIC_BACKEND_URL;
    try {
      await axios.delete(`${backendURL}/questions/deletequestion/${param.id}`, config);
      toast.success("Successfully deleted your Question");
      navigate("/blogs");
    } catch (error) {
      toast.error("error in deleting your blog");
    }
  }

  async function addComment() {
    const backendURL = import.meta.env.VITE_PUBLIC_BACKEND_URL;
    try {
      await axios.post(
        `${backendURL}/comments/addcomment/${param.id}`,
        {
          text: comment,
        },
        config
      );

      window.location.reload();
      toast.success("successfully added Your comment here");
    } catch (error) {
      toast.error("Your comment is not added");
    }
  }


  async function getComments(questionId) {
    const backendURL = import.meta.env.VITE_PUBLIC_BACKEND_URL;
    try {
      const { data } = await axios.get(
        `${backendURL}/comments/getcomments/${questionId}`, config
      );
      setComments(data.comments);
    } catch (error) {
      toast.error("error in getting comments");
    }
  }

  useEffect(() => {
    async function getBlog() {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/questions/${param.id}`
        );
        setBlog(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getBlog();
    getComments(param.id);
  }, [param]);


  const { user } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center flex-col gap-20">
        <div className="flex flex-col items-center justify-center">
          <TriangleAlert size={100} className="text-rose-900" />
          <h1 className="text-xl">No blog found🥲🥲</h1>
        </div>
        <Link to={"/blogs"}>
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {blog ? (
        <div className="my-20 max-w-screen-md mx-auto px-6">
          <div className="flex items-center justify-between my-10">
            <h1 className="text-3xl">{blog.question.title}</h1>

            {(blog?.question?.author?._id === user._id  || user?.role=="admin")? (
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your blog and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onSubmit}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant={"ghost"} size={"icon"}>
                  <Edit />
                </Button>
              </div>
            ) : null}
          </div>

          <h3 className="border-l-4 border-l-primary p-4 font-serif m-10">
            {blog.question.description}
          </h3>
          <div dangerouslySetInnerHTML={{ __html: blog.question.description }} />
          <Separator className="my-20" />
          <div>
            <h1 className="text-2xl mb-5">
              Comments{" ("}
              {comments.length}
              {")"}
            </h1>
            <div>
              {comments?.length === 0 ? (
                <>No comments yet. Be the first one to add</>
              ) : (
                comments?.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    commentId={comment._id}
                    text={comment?.text}
                    name={comment?.author?.email}
                  />
                ))
              )}
            </div>

            {user ? (
              <div className="mt-20">
                <h1 className="text-2xl font-medium mb-5">
                  Share your thoughts
                </h1>
                <div className="w-full flex items-center justify-center">
                  <div className="grid w-full items-center gap-4">

                    <div>
                      <Label htmlFor="feedback">Comments</Label>
                      <Textarea
                        id="feedback"
                        name="feedback"
                        placeholder="Share your thoughts..."
                        className="mt-1"
                        rows={3}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <Button onClick={addComment}>Submit</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center mt-10">
                <Link to={"/register"}>
                  <Button>Register Here</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BlogIdPage;
