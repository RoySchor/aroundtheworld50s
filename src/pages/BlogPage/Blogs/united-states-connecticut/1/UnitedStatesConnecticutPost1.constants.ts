import { BlogPostContent } from './UnitedStatesConnecticutPost1.types';

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
const unitedstatesconnecticutContent: BlogPostContent = {
  country: "United States",
  path: "united-states-connecticut/1",
  header: "📍Mystic, Connecticut",
  title: "📍Mystic, Just a Quick, But Memorable, Pause! ⏳📸",
  subtitle: "Uncovering Coastal Charm & Maritime Magic! ✨⚓",
  backgroundImage: "IMG_0018.jpeg",
  description: `Discovering Mystic: A Charming Detour on the Way to Providence. Did you know that the Mystic River Bascule Bridge, which you'll likely cross while driving through Mystic, opens on average 2,200 times yearly? That's almost six times a day!`,
  tipsSection: "💥 New England - Insider Tips ⁉️: Your Key to an Unforgettable Trip (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/united-states-connecticut",
  itineraries: [
      {
        "title": "Plymouth, MA",
        "items": [
          "\ud83d\udcccPilgrim Memorial State Park",
          "\ud83d\udcccFishmans Memorial Park",
          "\ud83d\udcccMayflower II",
          "\ud83d\udcccPlymouth Rock",
          "\ud83d\udcccFirst Parish in Plymouth",
          "\ud83d\udcccPlimoth Grist Mill",
          "\ud83d\udcccPlymouth Historic Downtown",
          "\ud83d\udcccPlimoth Patuxet Museums",
          "\ud83d\udcccPlymouth harbor"
        ]
      }
    ],
  content: [
      {
        "key": "textSection2",
        "layout": {
          "type": "text"
        },
        "content": "On our journey north, a spontaneous, we made a detour led us to the enchanting coastal town of Mystic, Connecticut! Don't let \"quick stop\" fool you \u2013 this place isn't just a dot on the map; it's a vibrant tapestry of history, marine life, and undeniable New England charm, making it the perfect, enriching interlude on any road trip.\n\nWe stopped at the \ud83d\udccc Hoxie Scenic Overlook for breathtaking views, to capture the panoramic vista of the Mystic River, the iconic Bascule Bridge, the sprawling Mystic Seaport Museum, and the quaint, historic village nestled along the water. It's the absolute perfect spot to capture that postcard-perfect photo of this charming New England town. \ud83d\udcf8\n\nWhile its fame might be tied to \"Mystic Pizza\" \ud83c\udf55 (and yes, you absolutely should grab a slice \u2013 it's a rite of passage!), the town offers so much more profound insight into its maritime soul.\n\nThe Mystic River flows right through the heart of it. The star attraction here is undoubtedly the Mystic Bascule Bridge. Don't just walk over it \u2013 wait for it to lift! Watching this historic drawbridge gracefully rise to let tall ships and pleasure boats pass. The streets themselves are a delight, lined with independent boutiques, art galleries showcasing local talent, and cozy cafes. It's the perfect place to browse for unique souvenirs, grab a coffee, and just soak in the laid-back, nautical atmosphere.\nAlthough we didn't visit the famous Mystic Seaport Museum this time, I highly recommend setting aside a couple of hours for it, as we had an incredible experience on a previous occasion. It's an immersive living history village with historic ships. \u26f5\ud83d\udd70\ufe0f Or, if you're traveling with kids, the Mystic Aquarium is a fantastic option (\ud83d\udca5you can often buy a combined ticket for both attractions!). Kids especially love seeing the beluga whales and other marine life up close! \ud83d\udc33\ud83d\udc20"
      },
      {
        "key": "image-gridSection2",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0016.jpeg",
          "IMG_0019.jpeg",
          "IMG_0018.jpeg",
          "IMG_9878.jpeg",
          "IMG_9879.jpeg",
          "IMG_9877.jpeg",
          "IMG_9876.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const UNITED_STATES_CONNECTICUT_POST_1 = createBlogPost(unitedstatesconnecticutContent);
