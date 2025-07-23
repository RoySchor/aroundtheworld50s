import { BlogPostContent } from './TrinidadAndTobagoPost2.types';

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
  path: "trinidad-and-tobago/2",
  header: "📍North Coast Nirvana: Trinidad's Untamed Tropical Paradise",
  title: "📍North Coast, Trinidad 🇹🇹",
  subtitle: "✨A North Coast Odyssey: Exploring Trinidad's Hidden Gems🏖️",
  backgroundImage: "IMG_1471.jpeg",
  description: `We quickly realized that relying on 🚌 public transportation or 🚕 taxis to explore the island's attractions would be inconvenient and costly. Guided tours, while tempting, also fell outside our budget if we wanted to visit all the planned locations. So, we made a wise decision: renting a car 🚙. This proved the perfect solution, granting us the freedom to explore the island at our own pace, stopping wherever our curiosity led us. 💥You'll spot private cars picking up and dropping off people along the way – these are essentially the local taxis. They're usually very affordable, but it's wise to exercise caution when using them.`,
  tipsSection: "💥 Insider Tips: Your Key to an Unforgettable Trip (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/trinidad-and-tobago",
  itineraries: [
      {
        "title": "North Coast Trinidad",
        "items": [
          "\ud83d\udcccLady Young Road Lookup",
          "\ud83d\udcccSan Juan",
          "\ud83d\udcccPraia Bay",
          "\ud83d\udcccLas Cuevas Beach",
          "\ud83d\udcccMaracas Beach"
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
        "content": "Our adventure began with breathtaking views. We ascended \ud83d\udcccLady Young Road, the panoramic vista from the overlook leaving us speechless. Port of Spain shimmered below. \ud83d\udca5I'd recommend skipping the overpriced fruit stalls at the overlook \u2013 the scenery alone is worth the stop. \nNext, we headed towards \ud83d\udcccSan Juan, a bustling local market where the aroma of spices and the lively chatter of vendors filled the air. This was the real deal, where locals came to shop for their daily needs. We indulged in the local delicacy, \ud83e\uded3doubles \u2013 a delightful combination of curried chickpeas and bara bread, a good start for the day."
      },
      {
        "key": "image-gridSection3",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1448.jpeg",
          "IMG_1447.jpeg",
          "IMG_1444.jpeg",
          "IMG_1313.jpeg",
          "IMG_1314.jpeg",
          "IMG_1312.jpeg",
          "IMG_1310.jpeg",
          "IMG_1316.jpeg"
        ]
      },
      {
        "key": "textSection4",
        "layout": {
          "type": "text"
        },
        "content": "Our next destination: \ud83d\udcccParia Bay. Anticipation built as we imagined the pristine beach we'd seen in photos. However, our excitement quickly turned to apprehension\u2014the paved road led to a gravel road, then a muddy track. After a grueling 45-minute drive over half a mile of treacherous terrain, we encountered a resident. He warned us that the road deteriorated further, and it could take another 2-3 hours to reach the trailhead, followed by a challenging hike through the mud. We reluctantly decided to turn back."
      },
      {
        "key": "image-gridSection5",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1456.jpeg",
          "IMG_1462.jpeg",
          "IMG_1466.jpeg",
          "IMG_1478.jpeg"
        ]
      },
      {
        "key": "textSection6",
        "layout": {
          "type": "text"
        },
        "content": "Undeterred, we headed towards \ud83d\udcccLas Cuevas Beach. With its crescent of golden sand and a picturesque backdrop of colorful fishing boats, this secluded paradise felt like a hidden gem. We cautiously entered the water, mindful of the sudden drop-off that lurked beneath the surface.\n\ud83d\udca5You might encounter kids offering beach chair and umbrella rentals. They often start with a high asking price, but don't hesitate to negotiate! You can usually settle on a much lower amount."
      },
      {
        "key": "image-gridSection7",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1503.jpeg",
          "IMG_1504.jpeg",
          "IMG_1507.jpeg",
          "IMG_1511.jpeg",
          "IMG_1512.jpeg",
          "IMG_1513.jpeg",
          "IMG_1515.jpeg"
        ]
      },
      {
        "key": "textSection8",
        "layout": {
          "type": "text"
        },
        "content": "Finally, we arrived at the legendary Maracas Beach, famous for its world-renowned \ud83d\udcccMaracas Bay Beach. We spent the next three hours basking in the sun, simply enjoying the tranquility of this iconic beach. As the sun descended, we reluctantly packed up and headed back, as we wanted to avoid driving after dark! The roads here are incredibly narrow, with no shoulders and steep trenches right alongside, making night driving quite hazardous.\nWe capped off our day with a memorable dining experience. The hotel was participating in Restaurant Week, offering a prix fixe dinner that was a true culinary journey. Be sure to make a reservation, as these special menus are highly sought after. Allow for approximately three hours to fully enjoy the multiple courses and savor each delectable bite."
      },
      {
        "key": "image-gridSection9",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_1442.jpeg",
          "IMG_1443.jpeg",
          "IMG_1524.jpeg",
          "IMG_1532.jpeg",
          "IMG_1535.jpeg",
          "IMG_1534.jpeg",
          "IMG_1536.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const TRINIDAD_AND_TOBAGO_POST_2 = createBlogPost(trinidadandtobagoContent);
