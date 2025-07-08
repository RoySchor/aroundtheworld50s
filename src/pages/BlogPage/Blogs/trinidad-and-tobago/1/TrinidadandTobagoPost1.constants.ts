import { BlogPostContent } from './TrinidadandTobagoPost1.types';

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
  path: "trinidad-and-tobago/1",
  header: "📍🇹🇹Trinidad & Tobago, a tale of 2 islands",
  title: "📌Port of Spain, Trinidad",
  subtitle: "⛱️10 days of Caribbean Charm: Uncovering the Soul and Beaches ✨Trinidad First, Tobago Next: Your Ultimate Island-Hopping Adventure✨",
  backgroundImage: "IMG_1889.jpeg",
  description: `Our <a href="https://en.wikipedia.org/wiki/Trinidad" class="post-link" target="_blank" rel="noopener noreferrer">Trinidad & Tobago</a> adventure was a spur-of-the-moment decision. When our cruise was unexpectedly rerouted (due to a hurricane), we embraced the unexpected and planned a last-minute island getaway. The idea of exploring these vibrant twin islands, fueled by my husband's friend's glowing descriptions of the culture and beaches, quickly took hold. And so, our Caribbean escape began.`,
  tipsSection: "💥 Insider Tips: Your Key to an Unforgettable Trip (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/trinidad-and-tobago",
  itineraries: [
      {
        "title": "Day 1, Afternoon - Oval",
        "items": [
          "\ud83d\udcccHotel, The BRIX, Autograph Collection",
          "\ud83d\udcccQueens Hall",
          "\ud83d\udcccMagnificent Seven",
          "\ud83d\udcccQueen's Park Oval",
          "\ud83d\udcccMemorial Park"
        ]
      },
      {
        "title": "Day 1, Afternoon- Downtown",
        "items": [
          "\ud83d\udcccDowntown, Port of Spain",
          "\ud83d\udcccIndependence Square",
          "\ud83d\udcccCathedral of the Immaculate Conception",
          "\ud83d\udcccTrinity Cathedral",
          "\ud83d\udcccAriapita Ave",
          "\ud83d\udcccQueen's Park Oval"
        ]
      }
    ],
  content: [
      {
        "key": "two-columnSection1",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text",
          "imageAlt": "img1355"
        },
        "content": "The \ud83d\udee9\ufe0f touched down in \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Port_of_Spain\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Port of Spain</a> just before noon. We hailed a \ud83d\ude95taxi to our hotel, <a href=\"https://expedia.com/affiliate/Zm1VD21\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">The BRIX, Autograph Collection</a>. We selected this \ud83c\udfe8for its upscale accommodations, great deal, and proximity to key attractions like \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Queen%27s_Park_Savannah\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Queen's Park</a>.",
        "leftImage": "IMG_1355.jpeg"
      },
      {
        "key": "itinerary-with-mapSection2",
        "layout": {
          "type": "itinerary-with-map",
          "mapIndex": 0
        },
        "content": null
      },
      {
        "key": "textSection3",
        "layout": {
          "type": "text"
        },
        "content": "We strolled down the street, passing the historic  \ud83d\udccc<a href=\"https://queenshalltt.com/\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Queen's Hall</a>, heading towards the \ud83d\udccc<a href=\"https://visittrinidad.tt/blog/magnificent-seven-in-port-of-spain-trinidad/\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Magnificent Seven</a>, a collection of seven stunning Victorian-era mansions on Maraval Road in #PortofSpain. These \ud83c\udff0architectural gems, built between 1902 and 1910, offer a glimpse into the island's opulent past. We strolled along the street, admiring their unique architectural styles, including French Colonial, Scottish baronial, and Indian Empire influences"
      },
      {
        "key": "image-gridSection4",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1327.jpeg",
          "IMG_1325.jpeg",
          "IMG_1333.jpeg",
          "IMG_1329.jpeg",
          "IMG_1320.jpeg",
          "IMG_1342.jpeg",
          "IMG_1337.jpeg"
        ]
      },
      {
        "key": "two-columnSection5",
        "layout": {
          "type": "two-column",
          "leftType": "text",
          "rightType": "image",
          "imageAlt": "img1354"
        },
        "content": "As we strolled through \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Memorial_Park,_Port_of_Spain\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Memorial Park</a> and the iconic \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Queen%27s_Park_Oval\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Queen's Park Oval</a>, we couldn\u2019t resist indulging in this cold, refreshing \ud83e\udd65coconut water from street vendors.",
        "rightImage": "IMG_1354.jpeg"
      },
      {
        "key": "textSection6",
        "layout": {
          "type": "text"
        },
        "content": "As it was still early afternoon, we hopped into a \ud83d\ude95, heading downtown to the vibrant soul, a blend of history and culture. Downtown Port of Spain is a whirlwind of activity. Historic landmarks stand proudly alongside modern buildings while the air is filled with the sounds of lively chatter, music, and the tempting aromas of street food. It\u2019s a captivating blend of history and modernity with grand colonial buildings, bustling markets, and squares."
      },
      {
        "key": "itinerary-with-mapSection9",
        "layout": {
          "type": "itinerary-with-map",
          "mapIndex": 1
        },
        "content": null
      },
      {
        "key": "two-columnSection8",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text",
          "imageAlt": "img1372"
        },
        "content": "We asked the driver to drop us off a few blocks from \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Independence_Square_(Port_of_Spain\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Independence Square</a>), so we could soak in the vibrant atmosphere of downtown.  Independence Square was a bustling hub of activity, with people going about their day and street vendors selling their wares. We wandered through the square, soaking up the vibrant atmosphere and admiring the architecture of the surrounding buildings.",
        "leftImage": "IMG_1372.jpeg"
      },
      {
        "key": "textSection9",
        "layout": {
          "type": "text"
        },
        "content": "Towering government buildings watched over the square. We passed the Houses of Parliament, a grand building with a political history. The Supreme Court, a majestic edifice, stood nearby, a reminder of the island's legal system. It was a fascinating walk, a journey through the heart of Trinidad and Tobago's governance. The square pulsed with the vibrant energy of this Caribbean capital, surrounded by historic government buildings. We approached the majestic \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Cathedral_of_the_Immaculate_Conception_(Port_of_Spain\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Cathedral of the Immaculate Conception\u26ea</a>), which loomed against the lively Port of Spain skyline. Stepping inside was like entering another world of inspiring beauty. Sunlight streamed through stained glass windows, casting colors across the polished marble floor. \nWe were drawn into the lively market, a sensory explosion! We navigated the bustling crowds, captivated by the vibrant display of fruits and vegetables. Mountains of pineapples, peppers, and many other colorful produce overflowed from every stall, creating an exhilarating experience that immersed us in the local culture. We continued our exploration, venturing towards \ud83d\udccc<a href=\"https://en.wikipedia.org/wiki/Holy_Trinity_Cathedral,_Port_of_Spain\" class=\"post-link\" target=\"_blank\" rel=\"noopener noreferrer\">Trinity Cathedral\u26ea</a>, architectural beauty, a breathtaking testament to the island's history. We continued along the road, passing charming gardens adorned with sculptures, until we reached the traffic light where the police station was located; our journey then came to an unexpected halt. A friendly \ud83d\udc6epolice officer advised us against proceeding further, citing safety concerns for tourists in that particular area."
      },
      {
        "key": "image-gridSection10",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1378.jpeg",
          "IMG_1380.jpeg",
          "IMG_1383.jpeg",
          "IMG_1390.jpeg",
          "IMG_1392.jpeg",
          "IMG_1399.jpeg",
          "IMG_1404.jpeg",
          "IMG_1408.jpeg",
          "IMG_1411.jpeg",
          "IMG_1374.jpeg"
        ]
      },
      {
        "key": "textSection11",
        "layout": {
          "type": "text"
        },
        "content": "Our destination? \ud83d\udcccAriapita Avenue, renowned as Port of Spain's \"foodie street\u201d. We envisioned a lively culinary scene with many restaurants and some street vendors. Unfortunately, our expectations weren't fully met. The street seemed a bit subdued, with several establishments closed. We weren't sure if the time of day (around 7 PM) or perhaps the off-season (October) contributed to the quieter atmosphere. Hungry, we followed the hotel's recommendation and returned to Memorial Park, eager to sample the local flavors. We paused at the Cenotaph Garden, paying our respects at this poignant memorial within Memorial Park."
      },
      {
        "key": "two-columnSection12",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text",
          "imageAlt": "img1422"
        },
        "content": "We were excited to discover a vibrant food truck scene, a delicious and lively way to experience the local cuisine at the southern point of the park, across from the performance art center.  It was the perfect place to experience authentic local cuisine.",
        "leftImage": "IMG_1422.jpeg"
      },
      {
        "key": "two-columnSection13",
        "layout": {
          "type": "two-column",
          "leftType": "text",
          "rightType": "image",
          "imageAlt": "img1438"
        },
        "content": "Back at the hotel, we retreated to the rooftop \ud83c\udf7bbar. Sipping on cool drinks\ud83c\udf79, we relaxed and enjoyed breathtaking panoramic views of the city sparkling below.",
        "rightImage": "IMG_1438.jpeg"
      },
      {
        "key": "two-columnSection14",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text",
          "imageAlt": "img1433"
        },
        "content": "A delightful surprise awaited us in our room! A beautifully arranged tray laden with decadent cakes sat on the table, a thoughtful gesture from the hotel to celebrate my husband's birthday and our anniversary. What a wonderful way to end the day!",
        "leftImage": "IMG_1433.jpeg"
      },
      {
        "key": "instagramSection15",
        "layout": {
          "type": "instagram"
        },
        "content": null
      }
    ],
};

// Create the blog post using the generic structure
export const TRINIDAD_AND_TOBAGO_POST_1 = createBlogPost(trinidadandtobagoContent);
