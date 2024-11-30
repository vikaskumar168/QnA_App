import Card from "@/components/card";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(false);


  async function fetchBlog() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL
        }/questions/status/approved`
      );
      setBlogs(data?.questions);
      console.log(data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlog();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <TriangleAlert size={100} className="text-rose-900" />
          <h1 className="text-xl">No blog found🥲🥲</h1>
        </div>
        <Link to={"/"}>
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  
  return (
    <>
      <Navbar />
      <div className="max-w-screen-2xl mx-auto mt-20">
        <h1 className="text-center text-3xl 2xl:text-4xl font-bold my-10 md:my-16">
          Explore all our Questions And Answers
        </h1>
        <div className="mx-5 lg:mx-10">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Question"
            className="mb-10"
          />
        </div>
        {blogs.length != 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {blogs.map((i) => (
              <Card
                key={i._id}
                id={i._id}
                title={i.title}
                description={i.description}
                author={i.author.email}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-screen flex items-center justify-center">
            No blogs available
          </div>
        )}
      </div>

    </>
  );
}

export default BlogPage;
