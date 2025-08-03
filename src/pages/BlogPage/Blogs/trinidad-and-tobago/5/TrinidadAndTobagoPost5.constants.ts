import { BlogPostContent } from './TrinidadAndTobagoPost5.types';

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
  path: "trinidad-and-tobago/5",
  header: "📍Beach & Rainforest: A Day of Contrasts🏖️🌲",
  title: "📍Tobago: Island Paradise Awaits",
  subtitle: "Tropical vibes, endless beaches, and pure relaxation. Tobago, you've captured my heart! 🌴🏖️",
  backgroundImage: "IMG_1828.jpeg",
  description: `Let's discover the unspoiled beauty of Tobago and experience paradise on this Caribbean gem. We'll dive into turquoise waters teeming with vibrant marine life, unwind on secluded, powdery white sand beaches, and explore lush rainforests.  Get ready to fall in love with Tobago's charm, tranquility, and endless natural wonders!`,
  tipsSection: "💥 Insider Tips: Your Key to an Unforgettable Trip (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/trinidad-and-tobago",
  itineraries: [
      {
        "title": "Tobago_Beaches",
        "items": [
          "\ud83d\udcccCastara Bay Rd",
          "\ud83d\udcccCastara Beach",
          "\ud83d\udcccEnglishman's Bay",
          "\ud83d\udcccTobago Main Ridge Forest Reserve"
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
        "key": "textSection2",
        "layout": {
          "type": "text"
        },
        "content": "As I mentioned in my insider tip, Tobago deserves more of your time if you're seeking a more laid-back pace focusing on beaches, rainforests, and relaxation. \nWe debated between the \u26f4\ufe0f ferry and a \ud83d\udee9\ufe0f flight but ultimately chose the ferry. We believed that savoring the journey, with its scenic views of the islands, was an integral part of the travel experience. Plus, the ferry ride wasn't significantly longer than a flight. We opted for the early morning ferry (6 AM) from Trinidad."
      },
      {
        "key": "image-gridSection3",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1949.jpeg",
          "IMG_1945.jpeg",
          "IMG_1946.jpeg",
          "IMG_1771.jpeg"
        ]
      },
      {
        "key": "two-columnSection4",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text",
          "imageAlt": "img1773"
        },
        "content": "While sometimes prone to delays, the four-hour ferry ride offered a unique perspective, gliding past small, uninhabited islands as we sailed toward our destination. Upon arriving in Tobago, we collected our \ud83d\ude99rental car and headed towards our hotel, but not before indulging in a delicious local lunch at a charming roadside eatery. This was the perfect start to our island adventure.",
        "leftImage": "IMG_1773.jpeg"
      },
      {
        "key": "textSection5",
        "layout": {
          "type": "text"
        },
        "content": "The drive to \ud83d\udcccCastara Bay was an adventure in itself. The winding road demanded patience as we navigated past slow-moving buses and trucks."
      },
      {
        "key": "image-gridSection6",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1814.jpeg",
          "IMG_1816.jpeg",
          "IMG_1817.jpeg",
          "IMG_1819.jpeg"
        ]
      },
      {
        "key": "textSection7",
        "layout": {
          "type": "text"
        },
        "content": "As we approached, the bay's beauty began to unfold, culminating in a breathtaking panorama. Castara Beach captivated us with its crescent shape and the unusual underwater shelf, creating a gradual and inviting entry into the turquoise waters. We couldn't wait to explore this idyllic corner of paradise.\nFrom there, we continued to explore another secluded beach, \ud83d\udcccEnglishman's Bay, a hidden gem. This secluded paradise captivated us with its pristine white sand, crystal-clear turquoise waters, and a backdrop of lush green hills."
      },
      {
        "key": "image-gridSection8",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1830.jpeg",
          "IMG_1831.jpeg",
          "IMG_1832.jpeg",
          "IMG_1837.jpeg",
          "IMG_1839.jpeg",
          "IMG_1841.jpeg",
          "IMG_1845.jpeg",
          "IMG_1824.jpeg"
        ]
      },
      {
        "key": "textSection9",
        "layout": {
          "type": "text"
        },
        "content": "We reluctantly left the idyllic bay, eager to explore more before the fading light made driving on the winding roads too challenging. We headed to the \ud83d\udcccMain Ridge Forest Reserve\ud83c\udf32, the oldest protected rainforest in the Western Hemisphere. The drive through the lush green hills was a journey, offering glimpses of the island's diverse wildlife. We reached the reserve, and the air immediately felt cooler and fresher. The sounds of the rainforest created a sense of tranquility. We couldn\u2019t spend more than an hour exploring the part of the trail (\u2139\ufe0f moderately difficult hike).\n As the light began to fade, we decided against continuing to \ud83d\udcccArgyle Falls. Driving on the winding roads with narrow shoulders in the dark presented a safety concern we weren't willing to risk.  \ud83d\udca5 I recommend dedicating at least half a day to the forest."
      },
      {
        "key": "textSection10",
        "layout": {
          "type": "text"
        },
        "content": "Tobago offers a diverse culinary scene, with many charming, smaller restaurants showcasing the island's unique flavors. To ensure a delightful dining experience, making reservations in advance is highly recommended, as these popular spots tend to fill up quickly."
      }
    ],
};

// Create the blog post using the generic structure
export const TRINIDAD_AND_TOBAGO_POST_5 = createBlogPost(trinidadandtobagoContent);
