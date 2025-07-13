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
  header: "📍Body Painting, Union Square, NYC",
  title: "NYC's Living Canvas: Getting Painted in Union Square! 🏙️🌟",
  subtitle: "✨A Farewell to Fantastic: Witnessing the Last NYC Body Painting Day🎨",
  backgroundImage: "IMG_0544.jpeg",
  description: `Ever dreamed of becoming a living canvas? We dove headfirst into a truly unforgettable body painting experience right here in NYC! 🤯 Imagine the city's iconic energy meeting vibrant colors, all brought to life on your skin!  Ready to get colorful?🌈🌟`,
  tipsSection: "",
  tipsLink: "/aroundtheworld50s#",
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
        "content": "The air buzzed with excitement as we navigated the throngs of spectators. Everywhere we looked, bodies were being transformed \u2013 intricate patterns, fantastical creatures, and vibrant abstracts emerged, defying imagination. It was a celebration of the human form as art, a testament to the incredible talent and dedication of the artists involved.\nWe wandered through the crowd, marveling at the sheer diversity of styles and the artists' dedication. Each body became a unique masterpiece, a fleeting moment of artistic expression captured for all to see. As the day progressed, the energy in Union Square continued to rise, a vibrant testament to the power of art and the human spirit.\nThis final Body Painting Day was a poignant reminder of the city's vibrant artistic spirit and a celebration of the human body as a canvas for creativity. While this particular event may be gone, its legacy will continue to inspire artists and awe onlookers for years to come."
      },
      {
        "key": "image-gridSection3",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0528.jpeg",
          "IMG_0485.jpeg",
          "IMG_0483.jpeg",
          "IMG_0492.jpeg",
          "IMG_0494.jpeg",
          "IMG_0501.jpeg",
          "IMG_0506.jpeg",
          "IMG_0509.jpeg",
          "IMG_0514.jpeg",
          "IMG_0518.jpeg",
          "IMG_0540.jpeg",
          "IMG_0542.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const UNITED_STATES_NEW_YORK_POST_1 = createBlogPost(unitedstatesnewyorkContent);
