import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-utils";
import axios from "axios";
import JoditEditor from "jodit-react";
import Cookies from "js-cookie";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddBlog = () => {
  const query = new URLSearchParams(useLocation().search);
  const blogId = query.get("blogId");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const token = Cookies.get("authtoken");
  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (blogId) {
      setLoading(true);
      axios
        .get(
          `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/blog/getBlog/${blogId}`,
          authConfig
        )
        .then((res) => {
          if (res.data.author._id !== user._id) {
            navigate("/blogs");
          }
          const { title, tags, description } = res.data;
          setTitle(title);
          setTags(tags.join(", ")); // Convert tags array to string
          setDescription(description);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [blogId, user._id, navigate]);

  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Express your thoughts",
      height: 500,
      theme: theme,
      style: {
        backgroundColor: theme === "dark" ? "#080c14" : "#fff",
        color: theme === "dark" ? "#fff" : "#080c14",
        width: "100%",
      },
    }),
    [theme]
  );

  const disabled =
    title.length < 10 || 
    tags.length < 1 || 
    description.length < 30 

  async function onSubmit() {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/questions/postquestion`, // Correct endpoint
        {
          title,
          tags: tags.split(",").map((tag) => tag.trim()), // Convert tags string to array
          description,
        },
        authConfig
      );

      toast.success("Added your blog");
      setDescription("");
      setTitle("");
      setTags("");

      navigate(`/blogs`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function updateBlog() {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/blog/editBlog`, // Correct endpoint
        {
          title,
          tags: tags.split(",").map((tag) => tag.trim()), // Convert tags string to array
          description,
          id: blogId,
        },
        authConfig
      );

      toast.success("Updated your blog");
      setTitle("");
      setTags("");
      setDescription("");

      navigate(`/blogs`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-screen-lg mx-auto space-y-10 my-20 px-6">
        <h1 className="text-2xl text-center my-6">Write your Question</h1>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col items-start gap-1 space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Title must be more than 10 characters
            </p>
          </div>
        </div>

        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col items-start gap-1 space-y-1.5">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Add tags separated by commas"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

      
        <div className="grid w-full items-center gap-4 mb-20">
          <div className="flex flex-col items-start gap-1 space-y-1.5">
            <Label htmlFor="content">Blog Content</Label>
            <JoditEditor
              ref={editor}
              value={description}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setDescription(newContent)}
              onChange={(newContent) => setDescription(newContent)}
            />
            <p className="text-xs text-muted-foreground pl-3">
              *Content must be more than 30 characters
            </p>
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            if (blogId) {
              updateBlog();
            } else {
              onSubmit();
            }
          }}
          // disabled={loading || disabled}
        >
          {loading ? "Loading..." : blogId ? "Update question" : "Add Question"}
        </Button>
      </div>
    </>
  );
};

export default AddBlog;
