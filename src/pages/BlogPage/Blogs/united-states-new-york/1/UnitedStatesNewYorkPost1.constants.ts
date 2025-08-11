import { BlogPostContent } from './UnitedStatesNewYorkPost1.types';

export const createBlogPost = (content: BlogPostContent): BlogPostContent => ({
  country: content.country,
  path: content.path,
  header: content.header,
  title: content.title,
  subtitle: content.subtitle,
  description: content.description,
  tipsSection: content.tipsSection,
  tipsLink: content.tipsLink,
  backgroundImage: content.backgroundImage,
  itineraries: content.itineraries || [],
  content: content.content || [],
});

// Specific content for United States post
const unitedstatesnewyorkContent: BlogPostContent = {
  country: "United States",
  path: "united-states-new-york/1",
  header: "📍 Body Painting, Union Square",
  title: "📍Body Painting, Union Square, Manhattan",
  subtitle: "Final Canvas: Reliving the Body Painting Magic in Union Square! 🎨✨🗽",
  backgroundImage: "IMG_0731.jpeg",
  description: `Remember that unforgettable experience of becoming a living work of art? This post takes you back to our last incredible body painting adventure right in the heart of NYC's Union Square! We're looking back at the vibrant colors, the incredible artists, and the amazing energy of turning public space into a canvas.  🖌️🌟`,
  tipsSection: "💥 Insider Tips: Your Key to an Unforgettable Trip (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/united-states-new-york",
  itineraries: [],
  content: [
      {
        "key": "textSection1",
        "layout": {
          "type": "text"
        },
        "content": "After over a decade of transforming Union Square into a vibrant canvas of human artistry, New York City's annual Body Painting Day ended on July 23, 2023. This final edition was a dazzling spectacle, a vibrant tapestry of colors and creativity as artists meticulously transformed nude models into living masterpieces."
      },
      {
        "key": "textSection2",
        "layout": {
          "type": "text"
        },
        "content": "Everywhere we looked, we saw bodies transforming \u2013 it was truly mind-blowing to see intricate patterns, wild and fantastical creatures, and vibrant abstract designs come to life right before our eyes. It was a powerful celebration of the human form, showcasing the incredible talent and dedication of every single artist involved.\n\nEach person became their unique masterpiece, a fleeting piece of art that everyone could witness. As the day progressed, the energy in Union Square continued to build, a truly vibrant testament to the power of art and the resilience of the human spirit."
      },
      {
        "key": "image-gridSection3",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0482.jpeg",
          "IMG_0485.jpeg",
          "IMG_0487.jpeg",
          "IMG_0492.jpeg",
          "IMG_0494.jpeg",
          "IMG_0542.jpeg",
          "IMG_0518.jpeg",
          "IMG_0521.jpeg",
          "IMG_0487.jpeg",
          "IMG_0544.jpeg",
          "IMG_0554.jpeg",
          "IMG_0527.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const UNITED_STATES_NEW_YORK_POST_1 = createBlogPost(unitedstatesnewyorkContent);
