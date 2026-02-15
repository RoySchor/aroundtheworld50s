import { BlogPostContent } from "./BlogPost.types";
import { getBlogImageUrl } from "../../../utils/cloudinary";

export const getImagePathFromBlogPost = (blogPost: BlogPostContent, imageName: string) => {
  return getBlogImageUrl(blogPost.path, imageName);
};
