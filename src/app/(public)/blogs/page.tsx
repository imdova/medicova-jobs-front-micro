import { NoResultMessage } from "@/app/(auth)/admin/blog/helper";
import BlogCard from "@/components/blog/BlogCard";
import CustomPagination from "@/components/UI/CustomPagination";
import { getAllBlogs } from "@/lib/actions/blog.actions";

const page = async () => {
  const result = await getAllBlogs()
  const data = result.data;
  const blogs = data?.data || [];
  const total = data?.total || 0;
  return (
    <main className="mb-12 min-h-[600px]">
      <div className="container mx-auto px-6 lg:max-w-[1170px] ">
        <h1 className="text-4xl md:text-5xl font-bold my-20 md:text-start text-center text-main">
          Mediova Blogs
        </h1>
        {/* Grid Blogs Veiw  */}
        {blogs?.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg">
            Not Found Blogs!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs?.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                isEdit={false}
              />
            ))}
            {data?.total === 0 && <NoResultMessage />}
          </div>
        )}

        {/* Pagination Component */}
        <div className="my-6">
          <CustomPagination
            totalItems={total}
          />
        </div>
      </div>
    </main>
  );
};
export default page;
