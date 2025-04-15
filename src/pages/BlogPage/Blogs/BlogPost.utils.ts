import { BlogPostContent } from "./trinidad-and-tobago/1/TrinidadTobegoPost1.types";

export const getImagePathFromBlogPost = (blogPost: BlogPostContent, imageName: string) => {
  return require(`../../../assets/${blogPost.path}/${imageName}`);
};
