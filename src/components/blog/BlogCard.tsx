"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, StarOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/util";
import { BlogType } from "@/types/blog";
import Avatar from "../UI/Avatar";

type Props = {
  blog: BlogType;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (blog: BlogType) => void;
  onDelete?: (blog: BlogType) => void;
  onToggleTemplate?: (blog: BlogType) => void;
  onPublish?: (blog: BlogType) => void;
  onUnpublish?: (blog: BlogType) => void;
  className?: string;
  isEdit?: boolean
};

const BlogCard: React.FC<Props> = ({
  blog,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleTemplate,
  onPublish,
  onUnpublish,
  className,
  isEdit = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const actionOptions = [
    {
      label: "Edit",
      action: () => onEdit?.(blog),
    },
    {
      label: blog.isDraft ? "Publish" : "Unpublish",
      action: () => {
        if (!blog.isDraft) {
          onUnpublish?.(blog);
        } else {
          onPublish?.(blog);
        }
      },
    },
    {
      label: blog.isTemplate ? "Remove from Templates" : "Mark as Template",
      icon: blog.isTemplate ? (
        <StarOff className="h-4 w-4" />
      ) : (
        <Star className="h-4 w-4" />
      ),
      action: () => onToggleTemplate?.(blog),
    },
    {
      label: "Delete",
      action: () => {
        if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
          onDelete?.(blog);
        }
      },
    },
  ];

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Template Badge */}
      {blog.isTemplate && (
        <div className="absolute right-2 top-12 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
            <Star className="h-3 w-3" />
            Template
          </span>
        </div>
      )}

      {/* Status Badge */}
      {isEdit && <div className="absolute left-2 top-2 z-10">
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
            !blog.isDraft
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800",
          )}
        >
          {blog.isDraft ? "Draft" : "Published"}
        </span>
      </div>}

      <div className="flex flex-col justify-between h-full">
        <Link href={`/blogs/${blog.id}`} className="flex-1" >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg rounded-b-none">
            <Image
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              src={blog.content?.photo || ""}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="space-y-3 p-4">
            <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">
              {blog.title}
            </h2>

            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Avatar
                  className="object-cover"
                  src={blog.author?.photo}
                  alt={blog.author?.name}
                  size={40}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {blog.author?.name}
                </span>
                <span className="text-xs text-gray-500">
                  {blog.author?.title}

                  {/* {new Date(blog.created_at).toLocaleDateString()} */}
                </span>
              </div>
            </div>

            <p className="line-clamp-2 text-sm text-gray-600">
              {blog.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {blog.keywords?.split(",").map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-between border-t border-gray-100 p-4">
          <Link
            className="hover:text-primary/80 text-sm font-medium text-primary transition-colors"
            href={`/blogs/${blog.id}`}
          >
            Read More
          </Link>
          <span className="text-xs text-gray-500">
            Updated{" "}
            {blog.updated_at
              ? new Date(blog.updated_at).toLocaleDateString()
              : "Recently"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
