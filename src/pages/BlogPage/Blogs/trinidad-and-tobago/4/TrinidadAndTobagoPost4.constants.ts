import { BlogPostContent } from './TrinidadAndTobagoPost4.types';

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
  path: "trinidad-and-tobago/4",
  header: "📍Unveiling La Brea & the Caroni Swamp: A South Coast Journey",
  title: "📍A South Coast Journey, Trinidad 🇹🇹",
  subtitle: "✨Where natural wonders and cultural treasures await🦩",
  backgroundImage: "IMG_1638.jpeg",
  description: `Come along with us as we dive into the truly wild side of Trinidad! On this adventure, we'll certainly soak in the local vibe with quick stops at some bustling markets and amazing Indian cultural spots, but our main focus today – the real stars of this trip – are two incredible natural wonders: the mysterious La Brea Pitch Lake and the vibrant Caroni Swamp. We will uncover the secrets of the world's largest natural asphalt lake, where the ground is actually bubbling underneath us. As the sun begins to dip, we'll glide through the mangrove trees of the Caroni Swamp. It's a true paradise for wildlife, building up to that unforgettable moment when thousands of Scarlet Ibises paint the sky in brilliant reds.`,
  tipsSection: "💥 Insider Tips: Your Key to an Unforgettable Trip (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/trinidad-and-tobago",
  itineraries: [
      {
        "title": "South Coast Trinidad",
        "items": [
          "\ud83d\udcccHotel, The BRIX, Autograph Collection",
          "\ud83d\udcccChaguanas",
          "\ud83d\udcccDattatreya Mandir Temple",
          "\ud83d\udcccSewdass Sadhu Shiva Mandir Temple in the Sea",
          "\ud83d\udcccSan Fernando Hill",
          "\ud83d\udcccLa Brea Pitch Lake",
          "\ud83d\udcccCaroni Swamp"
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
        "content": "We began our journey in \ud83d\udcccChaguanas, exploring the vibrant heart of the town. The bustling Municipal Market, a kaleidoscope of colors and aromas, was a feast for the senses. We indulged in the local favorite \u2013 doubles \u2013 a savory treat that tantalized our taste buds."
      },
      {
        "key": "image-gridSection3",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1548.jpeg",
          "IMG_1550.jpeg",
          "IMG_1551.jpeg",
          "IMG_1555.jpeg",
          "IMG_1556.jpeg",
          "IMG_1562.jpeg",
          "IMG_1563.jpeg",
          "IMG_1561.jpeg"
        ]
      },
      {
        "key": "two-columnSection4",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text",
          "imageAlt": "img1565"
        },
        "content": "We strolled through the town, admiring the architecture of buildings like the Lion House, a significant landmark with historical significance.",
        "leftImage": "IMG_1565.jpeg"
      },
      {
        "key": "two-columnSection5",
        "layout": {
          "type": "two-column",
          "leftType": "text",
          "rightType": "image",
          "imageAlt": "img1570"
        },
        "content": "Next, we delved into the rich Indian heritage of Trinidad, visiting the \ud83d\udcccSerene Dattatreya Mandir Temple. Walking into the Dattatreya Mandir Temple, you really can't prepare for the feeling of standing there, face-to-face with that enormous statue of Lord Hanuman. It's truly massive, and it made me feel incredibly small in comparison. The whole atmosphere of the temple is just so peaceful and serene, despite the sheer scale of the statue. It's a powerful reminder that Indians are a significant part of Trinidad's population, and their culture deeply enriches the island. \ud83d\udca5 If you're hoping for a semi-private tour, I highly recommend arriving early, just like we did. That way, you'll find the entire place almost empty, which makes the experience even more impactful.",
        "rightImage": "IMG_1570.jpeg"
      },
      {
        "key": "image-gridSection6",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1569.jpeg",
          "IMG_1572.jpeg",
          "IMG_1575.jpeg",
          "IMG_1576.jpeg"
        ]
      },
      {
        "key": "textSection7",
        "layout": {
          "type": "text"
        },
        "content": "And Then: The Magnificent Sea Temple \ud83c\udf0a\ud83d\ude4f After that incredibly moving visit to the Dattatreya Mandir Temple, we headed to our next stop \ud83d\udcccthe Sewdass Sadhu Shiva Mandir Temple. This one is just unforgettable, dramatically situated right on the coast, seemingly rising out of the sea itself. It was a beautiful contrast to the inland temple, showing another facet of Trinidad's rich culture. While we were there, we even had a fascinating glimpse of a large Indian gathering for a private event, dressed beautifully in traditional Indian clothes."
      },
      {
        "key": "image-gridSection8",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1589.jpeg",
          "IMG_1597.jpeg",
          "IMG_1598.jpeg",
          "IMG_1594.jpeg",
          "IMG_1599.jpeg",
          "IMG_1602.jpeg",
          "IMG_1606.jpeg",
          "IMG_1605.jpeg"
        ]
      },
      {
        "key": "two-columnSection9",
        "layout": {
          "type": "two-column",
          "leftType": "text",
          "rightType": "image",
          "imageAlt": "img1608"
        },
        "content": "After a delicious lunch at a local eatery, we ascended \ud83d\udcccSan Fernando Hill, enjoying panoramic views of the surrounding landscape. The drive up was exhilarating, offering breathtaking vistas at every turn.",
        "rightImage": "IMG_1608.jpeg"
      },
      {
        "key": "textSection10",
        "layout": {
          "type": "text"
        },
        "content": "The next stop was the legendary \ud83d\udcccLa Brea Pitch Lake, a unique natural phenomenon. A local guide (check my tips section) expertly navigated us through the area, explaining this natural asphalt lake's fascinating history and geological wonders. He emphasized the importance of safety, highlighting the dangers of venturing into the pitch without proper guidance. Walking across the surface of the La Brea Pitch Lake was absolutely wild \u2013 it literally felt like I was treading on a bubbling black pudding! We had to be super careful with every step because our shoes could easily get stuck in the incredibly sticky pitch, especially since it was a hot day. Our guide was really serious about us sticking to the designated paths, and he even shared some fascinating (and a little bit chilling) stories about the locals. He told us how they've had to move their houses multiple times because of the bubbling, shifting earth underneath them! Can you imagine? Or about visitors who got stuck and lost inside these water bubbles... It was such a humbling experience, a powerful reminder of nature's incredible force and mystery, and how much we really need to respect it. Truly unforgettable."
      },
      {
        "key": "image-gridSection11",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1618.jpeg",
          "IMG_1621.jpeg",
          "IMG_1624.jpeg",
          "IMG_1625.jpeg",
          "IMG_1627.jpeg",
          "IMG_1629.jpeg",
          "IMG_1631.jpeg",
          "IMG_1636.jpeg"
        ]
      },
      {
        "key": "textSection12",
        "layout": {
          "type": "text"
        },
        "content": "We made our way to the incredible \ud83d\udcccCaroni Bird Sanctuary. We timed it just right for the daily show \u2013 and trust me, you absolutely want to confirm your swamp tour departure time way in advance, because those limited spots vanish fast! Also, a quick tip \ud83d\udca5: bring cash, as many of the tour operators prefer it. This huge wetland is one of Trinidad's biggest, and it's just buzzing with all kinds of amazing birds. We even spotted some flamingos gracefully wading in the shallows, adding another splash of beautiful color to the landscape! But the real magic happened as the sun began to set. Suddenly, thousands upon thousands of Scarlet Ibises started flying in, coming back to their roosting spots. They literally painted the entire sky with the most vibrant, fiery red hues. It wasn't just a sight, it was a whole symphony of color and sound that's now absolutely etched into my memory. Truly breathtaking!"
      },
      {
        "key": "image-gridSection13",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1653.jpeg",
          "IMG_1654.jpeg",
          "IMG_1672.jpeg",
          "IMG_1670.jpeg",
          "IMG_1693.jpeg",
          "IMG_1688.jpeg",
          "IMG_1699.jpeg",
          "IMG_1720.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const TRINIDAD_AND_TOBAGO_POST_4 = createBlogPost(trinidadandtobagoContent);
