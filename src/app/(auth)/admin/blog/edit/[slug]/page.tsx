'use client'
import { API_GET_BLOG_BY_ID } from "@/api/blog";
import BlogPage from "@/components/blog/BlogPage";
import Loading from "@/components/loading/loading";
import useFetch from "@/hooks/useFetch";
import { BlogType } from "@/types/blog";
import { CircularProgress } from "@mui/material";
import { notFound } from "next/navigation";

const EditBlogPage = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const { data: blog, loading } = useFetch<BlogType>(API_GET_BLOG_BY_ID + slug, { defaultLoading: true })

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <CircularProgress />
      <h6 className="ml-4">Loading...</h6>
    </div>
  }
  if (!blog) return notFound()
  return (
    <div>
      <BlogPage blog={blog} />
    </div>
  );
};

export default EditBlogPage;
