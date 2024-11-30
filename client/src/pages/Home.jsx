import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_PUBLIC_BACKEND_URL
        }/questions/status/pending`
      );
      setBlogs(data?.blogs);
    }

    fetchData();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="dark:bg-background dark:text-foreground">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 space-y-6 md:space-y-10">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Discover the Questions On Latest Insights 
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Stay up-to-date with the latest trends, tips, and industry
                  insights from our expert writers.
                </p>
                <Link
                  to="/blogs"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Read the Questions
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
