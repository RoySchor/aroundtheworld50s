import { BlogPostContent } from './TrinidadAndTobagoPost6.types';

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
  path: "trinidad-and-tobago/6",
  header: "📌Unveiling Tobago's Treasures: Nylon Pool & Buccoo Reef🏝️🐠🪸",
  title: "📍Unveiling Tobago's Treasures",
  subtitle: "Tobago's Aquatic Gems: A Journey to the Fabled Nylon Pool & Lively Buccoo Reef 💙🐠✨",
  backgroundImage: "IMG_1867.jpeg",
  description: `Dive into the crystal-clear magic of Tobago with us as we explore two of its most iconic underwater wonders: the enchanting Nylon Pool and the vibrant Buccoo Reef! This blog post takes you on a journey to discover the legendary "pool in the middle of the sea," where the water feels as soft as silk and promises rejuvenation. Then, plunge into the thriving ecosystem of Buccoo Reef, a protected marine park with colorful coral and an incredible array of tropical fish. Get ready to be mesmerized!`,
  tipsSection: "💥 Insider Tips: Your Key to an Unforgettable Trip (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/trinidad-and-tobago",
  itineraries: [
      {
        "title": "Nylon Pool & Buccoo Reef",
        "items": [
          "\ud83d\udcccStore Bay Beach, Crown Point",
          "\ud83d\udcccPigeon Point Beach",
          "\ud83d\udcccNylon Pool",
          "\ud83d\udcccBuccoo Reef",
          "\ud83d\udcccNo Man's land"
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
        "content": "We were excited to explore Tobago's underwater wonders today! We met our tour guide at \ud83d\udcccPigeon Point Beach (\u2139\ufe0f entrance fee applies), passing by \ud83d\udcccStore Bay Beach, where locals enjoyed a leisurely swim. The vibrant stalls selling local art along the way added a touch of local color. The beach is simply idyllic, think soft white sand, swaying palm trees, and clear turquoise water. It's truly a picture-perfect Caribbean paradise! Note, on the way to Pigeon Point, you'll spot some charming local stalls selling all sorts of vibrant, local art. It's a great chance to grab a unique souvenir!"
      },
      {
        "key": "image-gridSection3",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1853.jpeg",
          "IMG_1854.jpeg",
          "IMG_1860.jpeg",
          "IMG_1852.jpeg",
          "IMG_1851.jpeg",
          "IMG_1867 2.jpeg",
          "IMG_1889.jpeg",
          "IMG_1868.jpeg"
        ]
      },
      {
        "key": "textSection4",
        "layout": {
          "type": "text"
        },
        "content": "Our first stop, the \ud83d\udcccNylon Pool, named after Princess Margaret, was a magical experience. She likened the pool's crystal-clear water to the transparency of nylon, a fitting description for its remarkable clarity. Locals believe that swimming in these turquoise waters possesses rejuvenating powers. The crystal-clear water was simply mesmerizing."
      },
      {
        "key": "image-gridSection5",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1861.jpeg",
          "IMG_1911.jpeg",
          "IMG_1908.jpeg",
          "IMG_1916.jpeg"
        ]
      },
      {
        "key": "textSection6",
        "layout": {
          "type": "text"
        },
        "content": "We then explored the vibrant \ud83d\udcccBuccoo Reef, encountering a dazzling array of marine life. It was a living, breathing kaleidoscope down there \u2013 the corals were vibrant, and I just kept seeing schools of bright, colorful fish zipping past in every direction. It truly felt like an underwater wonderland!"
      },
      {
        "key": "image-gridSection7",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1893 2.jpeg",
          "IMG_1894.jpeg",
          "IMG_1900.jpeg",
          "IMG_1898.jpeg"
        ]
      },
      {
        "key": "textSection8",
        "layout": {
          "type": "text"
        },
        "content": "Our boat trip had another fantastic surprise: a stop at No Man's Land, a secluded, pristine white-sand beach accessible only by boat! It wasn't on our original plan, but it turned out to be this incredible, tiny slice of paradise. The water was just ridiculously clear, and the best part? Locals were right there, selling the freshest seafood, which made for the perfect, spontaneous moment of pure relaxation and a delicious treat, before returning to Pigeon Point to relax and enjoy the afternoon."
      },
      {
        "key": "image-gridSection9",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1923.jpeg",
          "IMG_1922.jpeg",
          "IMG_1939.jpeg",
          "IMG_1885.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const TRINIDAD_AND_TOBAGO_POST_6 = createBlogPost(trinidadandtobagoContent);
