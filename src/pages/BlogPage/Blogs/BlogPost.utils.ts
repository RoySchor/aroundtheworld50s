import { BlogPostContent } from "./BlogPost.types";

export const getImagePathFromBlogPost = (blogPost: BlogPostContent, imageName: string) => {
  return require(`../../../assets/blog/${blogPost.path}/${imageName}`);
};
