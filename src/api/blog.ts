import { API_ADMIN_BASE } from "./admin";

// Blogs
export const BLOGS = API_ADMIN_BASE + "/blogs";
export const API_CREATE_BLOG = BLOGS; // POST
export const API_GET_BLOGS = BLOGS; // GET
export const API_GET_BLOG_BY_ID = BLOGS + "/"; // GET + [id]
export const API_UPDATE_BLOG = BLOGS; // PATCH
export const API_DELETE_BLOG = BLOGS + "?id="; // DELETE

// Blog Categories
export const BLOG_CATEGORIES = API_ADMIN_BASE + "/blog-categories";
export const API_CREATE_BLOG_CATEGORY = BLOG_CATEGORIES; // POST
export const API_GET_BLOG_CATEGORIES = BLOG_CATEGORIES; // GET
export const API_GET_BLOG_CATEGORY_BY_ID = BLOG_CATEGORIES + "/"; // GET + [id]
export const API_UPDATE_BLOG_CATEGORY = BLOG_CATEGORIES; // PATCH
export const API_DELETE_BLOG_CATEGORY = BLOG_CATEGORIES + "?id="; // DELETE

// Blog Authors
export const BLOG_AUTHORS = API_ADMIN_BASE + "/blog-authors";
export const API_CREATE_BLOG_AUTHOR = BLOG_AUTHORS; // POST
export const API_GET_BLOG_AUTHORS = BLOG_AUTHORS; // GET
export const API_GET_BLOG_AUTHOR_BY_ID = BLOG_AUTHORS + "/"; // GET + [id]
export const API_UPDATE_BLOG_AUTHOR = BLOG_AUTHORS; // PATCH
export const API_DELETE_BLOG_AUTHOR = BLOG_AUTHORS + "?id="; // DELETE
