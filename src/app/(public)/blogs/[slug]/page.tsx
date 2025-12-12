import { getAllBlogs, getBlog } from "@/lib/actions/blog.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import BlogCard from "@/components/blog/BlogCard";
import Link from "next/link";
import ArticleCompiler from "@/components/blog/panels/ArticleCompiler";

interface SingleBlogProps {
  params: Promise<{ slug: string }>;
}

export default async function SingleBlog({ params }: SingleBlogProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  // TODO : add Forms here after finishing the form data
  // const forms = await getForms();
  const result = await getAllBlogs();
  const data = result.data;
  const blogs = data?.data || [];

  if (!blog) return notFound();

  return (
    <main className="container mx-auto md:py-8">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row">
        <div className="rounded-base border border-gray-200 p-5 md:p-8 md:shadow-soft lg:w-3/4">
          {blog.success && blog.data && (
            <ArticleCompiler
              blog={blog.data}
              //  forms={forms.data}
            />
          )}
        </div>
        <div className="m-2 lg:w-1/4">
          <div className="space-y-1">
            <h2 className="mb-6 text-2xl font-semibold">View Also</h2>
            {blogs
              .filter((x) => x.id !== blog.data?.id)
              .map((blog) => {
                return (
                  <Link
                    href={`/blogs/${blog.id}`}
                    key={blog.id}
                    className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-3 shadow-soft duration-200 hover:bg-gray-50 hover:shadow-lg"
                  >
                    <Image
                      className="h-14 w-14 rounded object-cover"
                      width={400}
                      height={400}
                      src={blog.content?.photo || ""}
                      alt={blog.title}
                    />
                    <div>
                      <span className="mb-2 block text-xs text-primary">
                        {blog.updated_at
                          ? new Date(blog.updated_at).toLocaleDateString()
                          : "Recently"}
                      </span>
                      <p className="line-clamp-2 text-sm">{blog.title}</p>
                    </div>
                  </Link>
                );
              })}
          </div>
          {blog.data?.keywords && (
            <div className="box-content">
              <h2 className="mb-6 text-2xl font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {blog.data?.keywords?.split(",").map((keyWord, index) => (
                  <button
                    key={index}
                    className="link-smooth w-fit rounded-md bg-primary p-2 text-xs font-semibold text-white hover:bg-primary/90"
                  >
                    {keyWord}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mx-5">
        <h2 className="mb-4 text-2xl font-semibold md:text-3xl">Other Blogs</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {blogs
            .filter((x) => x.id !== blog.data?.id)
            ?.map((blog) => (
              <BlogCard key={blog.id} blog={blog} isEdit={false} />
            ))}
        </div>
      </div>
    </main>
  );
}
