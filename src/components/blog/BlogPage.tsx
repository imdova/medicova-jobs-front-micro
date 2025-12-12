"use client";
import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { BlogType, BreakPoints } from "@/types/blog";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EditorHeader from "@/components/blog/EditorHeader";
import ToolBarSkeleton from "@/components/loading/ToolBarSkeleton";
import { useBlogStore } from "@/lib/blog/blog-store";

const ToolBar = dynamic(() => import("@/components/blog/panels/toolbar"), {
  ssr: false,
  loading: () => <ToolBarSkeleton />, // fallback during loading
});
const BlogFormModal = dynamic(() => import("@/components/blog/blogFormModal"), {
  ssr: false,
});
const BlogBuilder = dynamic(() => import("@/components/blog/BlogBuilder"), {
  ssr: false,
});
const ArticlePreview = dynamic(() => import("@/components/blog/blogReview"), {
  ssr: false,
});

const getViewModeWidth = (viewMode: BreakPoints) => {
  switch (viewMode) {
    case "md":
      return "max-w-[1100px]";
    case "sm":
      return "max-w-[768px]";
    case "xs":
      return "max-w-[375px]";
  }
};

const BlogPage: React.FC<{ blog?: BlogType }> = ({ blog }) => {
  const { inPreview, selectBlock, currentBreakpoint, initiatePage, getActiveForm, resetStore } =
    useBlogStore();
  const activeForm = getActiveForm();

  useEffect(() => {
    initiatePage(blog)
    return resetStore
  }, [initiatePage, blog, resetStore])


  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div>
          <EditorHeader />
          {inPreview ? (
            <ArticlePreview />
          ) : (
            <div
              className={`mt-[50px] grid grid-cols-[1fr_24rem] bg-background`}
            >
              <main className="relative max-w-full overflow-hidden">
                <BlogFormModal />
                <div
                  className={`scrollable-container scroll-bar-minimal !pointer-events-auto h-[calc(100vh-52px)] w-full ${Boolean(activeForm)
                    ? "overflow-hidden"
                    : "!overflow-y-auto !overflow-x-hidden"
                    } bg-gray-50 p-4`}
                >
                  <div
                    onClick={() => selectBlock(null)}
                    className={`mx-auto flex min-h-full flex-col border bg-white p-2 shadow-soft transition-all ${getViewModeWidth(currentBreakpoint)}`}
                  >
                    <Suspense
                      fallback={<div className="p-4">Loading content...</div>}
                    >
                      <BlogBuilder />
                    </Suspense>
                  </div>
                </div>
              </main>

              <Suspense fallback={<div className="p-4">Loading tools...</div>}>
                <ToolBar />
              </Suspense>
            </div>
          )}
        </div>
      </DndProvider>
    </div>
  );
};

export default BlogPage;
