import { BlogPostContent } from './FrancePost2.types';

export const createBlogPost = (content: BlogPostContent): BlogPostContent => ({
  country: content.country,
  path: content.path,
  header: content.header,
  title: content.title,
  subtitle: content.subtitle,
  description: content.description,
  tipsSection: content.tipsSection,
  backgroundImage: content.backgroundImage,
  itineraries: content.itineraries || [],
  content: content.content || [],
});

// Specific content for France post
const franceContent: BlogPostContent = {
  country: "France",
  path: "france/2",
  header: "Header",
  title: "France Title",
  subtitle: "subtilte",
  backgroundImage: "frodo.jpg",
  description: `short description`,
  tipsSection: "tips",
  itineraries: [],
  content: [
      {
        "key": "textSection1",
        "layout": {
          "type": "text"
        },
        "content": "happiness"
      }
    ],
};

// Create the blog post using the generic structure
export const FRANCE_POST_2 = createBlogPost(franceContent);
