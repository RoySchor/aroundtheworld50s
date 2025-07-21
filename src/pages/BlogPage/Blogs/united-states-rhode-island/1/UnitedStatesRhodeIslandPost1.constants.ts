import { BlogPostContent } from './UnitedStatesRhodeIslandPost1.types';

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
const unitedstatesrhodeislandContent: BlogPostContent = {
  country: "United States",
  path: "united-states-rhode-island/1",
  header: "📍Providence, Rhode Island",
  title: "📍Providence, RI: Small City, Big Charm! 🤏💖",
  subtitle: "Taste of Providence: Unlocking the Charm of the Creative Capital! ✨🏙️",
  backgroundImage: "IMG_0023.jpeg",
  description: `Ignite Your Independence: Our Unforgettable 4th of July Weekend in Providence, RI! 🎇🇺🇸✨
Get ready to feel the patriotic pulse of New England! Our recent Fourth of July weekend in Providence, Rhode Island, was an absolute blast – a vibrant fusion of dazzling fireworks, rich history, and the city's signature creative charm.`,
  tipsSection: "",
  tipsLink: "/aroundtheworld50s#",
  itineraries: [
      {
        "title": "Providence, RI",
        "items": [
          "\ud83d\udcccRhode Island State House",
          "\ud83d\udcccStation Park",
          "\ud83d\udcccWaterplace Park",
          "\ud83d\udcccCity Center",
          "\ud83d\udcccIndependence Trail",
          "\ud83d\udcccTrinity Brewhouse",
          "\ud83d\udcccBrown University",
          "\ud83d\udcccCollege Hill",
          "\ud83d\udcccFederal Hill"
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
        "content": "Our long weekend adventure started with a stay at the \ud83c\udfe8 <a href=\"https://expedia.com/affiliate/RF52NY3\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Hilton Providence</a>, perfectly situated for exploring the city. We chose this location strategically, allowing us to easily walk to key attractions during the day and immerse ourselves in the vibrant nightlife of Federal Hill in the evenings.\n\nAfter a 14-minute walk, we approached the first POI on our list, the \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Rhode_Island_State_House\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Rhode Island State House</a>. As we approached, its majestic presence dominated the skyline. Perched on a hill, this impressive building is a landmark visible from afar. Its grandeur is undeniable, particularly the sweeping staircase that adds to its imposing stature."
      },
      {
        "key": "image-gridSection3",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0027.jpeg",
          "IMG_0029.jpeg",
          "IMG_0031.jpeg",
          "IMG_0023.jpeg"
        ]
      },
      {
        "key": "two-columnSection4",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text",
          "imageAlt": "img0028"
        },
        "content": "From the State House, a leisurely four-minute stroll brought us to \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Providence_station\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Station Park</a>, a charming green space surrounding the Providence Station. The \ud83d\ude89station is a magnificent architectural feat, blending Victorian Gothic and Romanesque Revival styles.",
        "leftImage": "IMG_0028.jpeg"
      },
      {
        "key": "two-columnSection5",
        "layout": {
          "type": "two-column",
          "leftType": "text",
          "rightType": "image",
          "imageAlt": "img0026"
        },
        "content": "Next, we made our way to \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Waterplace_Park\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Waterplace Park</a>, a stunning urban oasis overlooking the Providence River. The park boasts a cascading waterfall, making it a perfect spot to relax and enjoy the city views.",
        "rightImage": "IMG_0026.jpeg"
      },
      {
        "key": "image-gridSection6",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0038.jpeg",
          "IMG_0024.jpeg"
        ]
      },
      {
        "key": "two-columnSection7",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text",
          "imageAlt": "img0041"
        },
        "content": "Did you know that Providence boasts its own \ud83d\udccc<a href=\"https://www.visitrhodeisland.com/listing/independence-trails-providence/10068/\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Independence Trail</a>?\n\nStep into History: Following Providence's Independence Trail! \ud83d\udcdc\ud83d\udeb6\u200d\u2640\ufe0f\ud83c\uddfa\ud83c\uddf8\nLace up your walking shoes!\n In Providence, we didn't just read about history \u2013 we walked right through it on the Independence Trail! This self-guided journey through the city's historic core reveals fascinating stories of the Revolutionary War, colonial architecture, and pivotal moments that shaped America's fight for freedom. It's a captivating way to connect with the past, one historic step at a time. \u2728",
        "leftImage": "IMG_0041.jpeg"
      },
      {
        "key": "two-columnSection8",
        "layout": {
          "type": "two-column",
          "leftType": "text",
          "rightType": "image",
          "imageAlt": "img0060"
        },
        "content": "We followed this historic path, leading us to \ud83d\udcccAlex and Ani City Center, where a lively atmosphere was already building as people gathered for the 4th of July evening festivities.",
        "rightImage": "IMG_0060.jpeg"
      },
      {
        "key": "textSection9",
        "layout": {
          "type": "text"
        },
        "content": "The trail weaves through this iconic street. Each building tells a story, offering a picturesque journey through centuries of Providence's past. \ud83c\udfd8\ufe0f\n\nWe passed by the renowned \ud83d\udcccTrinity Brewery along the way.\nWhile Trinity Brewhouse is a fantastic and historic local brewery (established in 1994, it's one of New England's first brewpubs!), it doesn't fall within the historical period covered by the Independence Trail, which focuses on colonial and Revolutionary War-era sites. However, it's a great spot to grab a craft beer and a bite to eat if you're exploring downtown Providence after your historical walk! \ud83c\udf7b"
      },
      {
        "key": "image-gridSection10",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0057.jpeg",
          "IMG_0061.jpeg"
        ]
      },
      {
        "key": "textSection11",
        "layout": {
          "type": "text"
        },
        "content": "Our journey continued towards \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Brown_University\" class=\"post-link\" target=\"_blank\"rel=\"noopener noreferrer\">Brown University</a>. \n\nStrolling to Scholarship: Brown University Bound! \ud83c\udf93\ud83c\udf33\u2728\nFrom the grandeur of Memorial Boulevard, we took a picturesque walk up to Brown University! \ud83d\udeb6\u200d\u2640\ufe0f\nThis historic campus, nestled on College Hill, offers stunning architecture, vibrant student life, and a sense of intellectual energy. \nIt's a beautiful stroll from downtown, connecting the city's urban pulse with its academic heart. \u2764\ufe0f \n\ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/File:Providence_RI_-_Memorial_Blvd_-_Omni_Hotel_Skywalk.jpg\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Memorial Boulevard</a>, lined with impressive historic buildings, led us up \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/College_Hill,_Providence,_Rhode_Island\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">College Hill</a> towards the iconic Brown University Tower. The campus buzzed with energy, with students mingling amongst outdoor sculptures, creating a vibrant and youthful atmosphere."
      },
      {
        "key": "image-gridSection12",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0047.jpeg",
          "IMG_0046.jpeg",
          "IMG_0049.jpeg",
          "IMG_0050.jpeg",
          "IMG_0052.jpeg",
          "IMG_0053.jpeg"
        ]
      },
      {
        "key": "textSection13",
        "layout": {
          "type": "text"
        },
        "content": "For dinner, we ventured into the vibrant \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Federal_Hill,_Providence,_Rhode_Island\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Federal Hill</a> neighborhood, a bustling enclave of Italian-American heritage. Walking down the charming streets, lined with cozy restaurants and lively bars, we were captivated by the lively atmosphere. We chose to dine at one of the many outdoor spaces, enjoying the live music and soaking in the vibrant energy of the neighborhood."
      },
      {
        "key": "image-gridSection14",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0069.jpeg",
          "IMG_0068.jpeg",
          "IMG_0067.jpeg",
          "IMG_0066.jpeg",
          "IMG_0065.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const UNITED_STATES_RHODE_ISLAND_POST_1 = createBlogPost(unitedstatesrhodeislandContent);
