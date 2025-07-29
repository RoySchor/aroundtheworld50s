import { BlogPostContent } from './TrinidadAndTobagoPost3.types';

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

// Specific content for Trinidad and Tobago post
const trinidadandtobagoContent: BlogPostContent = {
  country: "Trinidad and Tobago",
  path: "trinidad-and-tobago/3",
  header: "📍A West Coast Adventure",
  title: "✨A West Coast Adventure: A Glimpse of Trinidad's Heartbeat",
  subtitle: "A West Coast Vibe Adventure! 🇹🇹🎶✨",
  backgroundImage: "IMG_1737.jpeg",
  description: `Today, we embarked on an adventure to explore the heartland of Trinidad, venturing west from the bustling city. The drive along the winding road (the only road) was a journey in itself, passing through charming villages where life moved at a slower pace.`,
  tipsSection: "💥 Insider Tips: Your Key to an Unforgettable Trip (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/trinidad-and-tobago",
  itineraries: [
      {
        "title": "West Coast Trinidad",
        "items": [
          "\ud83d\udccdArima",
          "\ud83d\udccdSangre Grande",
          "\ud83d\udccdManzanilla Beach"
        ]
      }
    ],
  content: [
      {
        "key": "itinerary-with-mapSection1",
        "layout": {
          "type": "itinerary-with-map",
          "mapIndex": 0
        },
        "content": null
      },
      {
        "key": "two-columnSection2",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text"
        },
        "content": "Our first stop was \ud83d\udcccArima, a town steeped in history and brimming with local charm. We savored the vibrant atmosphere, soaking in the sights and sounds of the bustling market.",
        "leftImage": "IMG_1723.jpeg"
      },
      {
        "key": "textSection5",
        "layout": {
          "type": "text"
        },
        "content": "As we continued west, the sky darkened, and clouds gathered on the horizon. Undeterred, we pressed on towards \ud83d\udcccSangre Grande. Imagine our surprise when we encountered a bustling market in the center of a roundabout! Local vendors showcased their wares \u2013 fresh produce, colorful crafts, and mouthwatering local delicacies. We couldn't resist indulging in the quintessential Trinidadian treat: doubles."
      },
      {
        "key": "textSection5",
        "layout": {
          "type": "text"
        },
        "content": "With the rain starting to fall, we made our way towards \ud83d\udcccManzanilla Beach. The road conditions deteriorated rapidly, so we made a quick stop by the beach and then decided to head back to the hotel. Despite the unexpected weather, our journey through the heart of Trinidad was a captivating experience. We encountered the warmth of local communities, savored delicious treats, and witnessed the raw beauty of the island's interior."
      },
      {
        "key": "image-gridSection5",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1731.jpeg",
          "IMG_1737.jpeg",
          "IMG_1728.jpeg",
          "IMG_1724.jpeg",
          "IMG_1721.jpeg",
          "IMG_1725.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const TRINIDAD_AND_TOBAGO_POST_3 = createBlogPost(trinidadandtobagoContent);
