import { BlogPostContent } from './UnitedStatesMassachusettsPost1.types';

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
const unitedstatesmassachusettsContent: BlogPostContent = {
  country: "United States",
  path: "united-states-massachusetts/1",
  header: "📍Plymouth, Massachusetts -- Where America's Story Begins! 🇺🇸",
  title: "📍Plymouth, Massachusetts",
  subtitle: "Journey to the Past: Unveiling Historic Plymouth, MA! 📜⚓✨",
  backgroundImage: "IMG_0296.jpeg",
  description: `Ever wondered what it was really like in 1620? Or how history shaped one of America's most beloved towns? This blog takes you beyond the myths and into the heart of this extraordinary destination. Discover Plymouth, Massachusetts, from the iconic Plymouth Rock🪨 to the living history of Plimoth Patuxet. Join us for a journey back to where it all began.`,
  tipsSection: "💥 Insider Tips: Your Key to an Unforgettable Trip to Massachusetts (read more...)",
  tipsLink: "/aroundtheworld50s#/tips/united-states-massachusetts",
  itineraries: [
      {
        "title": "Plymouth, MA",
        "items": [
          "\ud83d\udcccPilgrim Memorial State Park",
          "\ud83d\udccc Fisherman's Memorial Park",
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
        "key": "itinerary-with-mapSection1",
        "layout": {
          "type": "itinerary-with-map",
          "mapIndex": 0
        },
        "content": null
      },
      {
        "key": "image-gridSection2",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0185.jpeg",
          "IMG_0189.jpeg",
          "IMG_0191.jpeg",
          "IMG_0193.jpeg",
          "IMG_0196.jpeg",
          "IMG_0198.jpeg",
          "IMG_0199.jpeg",
          "IMG_0276.jpeg"
        ]
      },
      {
        "key": "textSection3",
        "layout": {
          "type": "text"
        },
        "content": "Stepping Back in Time (and Loving Every Minute!) \ud83d\udd70\ufe0f \n\nOur Plymouth adventure kicked off on Water Street, the perfect gateway to this historic town. You\u2019ll find convenient parking \ud83c\udd7f\ufe0f right along the street or, if you prefer, in the lot behind the information center \u2139\ufe0f just across the road. \n\nI highly recommend making your first stop the information center. It's packed with maps \ud83d\uddfa\ufe0f, brochures, and helpful staff who can offer great insights to make your visit even better. Plus, it's a super convenient spot to find clean public restrooms \ud83d\udebb before you start your explorations! \n\nAs we stepped out, we were immediately struck by the breathtaking views of the harbor \u2693. The sparkling water and boats \ud83d\udee5\ufe0f created such a picturesque scene. We soaked it all in before making our way toward Fishermen's Park. Here, you'll find a tranquil spot to reflect and often see local artists \ud83c\udfa8 or fishermen \ud83c\udfa3 going about their day \u2013 it\u2019s a lovely view, so don't skip it. Planning to dine on the wharf? \ud83c\udf7d\ufe0f A little \ud83d\udca5insider tip: if you're visiting on a busy summer day, it\u2019s a smart move to book a table in advance at one of the many restaurants. They fill up fast, and you don't want to miss out on those waterfront views!\nContinuing our stroll along Water Street, our next destination was the iconic Mayflower II \u26f5.  Along the way, we stumbled upon a delightful display of artist-painted beach chairs \ud83c\udfa8\ud83c\udfd6\ufe0f. I absolutely couldn't resist stopping and sitting on them for a few minutes \u2013 they added such a vibrant touch to the historic surroundings. It's those little unexpected gems that make exploring Plymouth so much fun! \u2728"
      },
      {
        "key": "image-gridSection4",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0187.jpeg",
          "IMG_0197.jpeg"
        ]
      },
      {
        "key": "textSection5",
        "layout": {
          "type": "text"
        },
        "content": "After soaking in the harbor views and admiring those charming painted beach chairs \ud83c\udfa8\ud83c\udfd6\ufe0f, our journey continued along Water Street, leading us directly to Plymouth's majestic centerpiece: the Mayflower II. This isn't just any old ship; it's a full-scale, crafted replica of the iconic vessel that brought the Pilgrims to these shores in 1620. Stepping aboard, you'll immediately notice the incredible attention to detail. It's designed to give you a profound sense of what the original 17th-century voyage was like."
      },
      {
        "key": "image-gridSection6",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0200.jpeg",
          "IMG_0203.jpeg",
          "IMG_0205.jpeg",
          "IMG_0207.jpeg",
          "IMG_0208.jpeg",
          "IMG_0277.jpeg",
          "IMG_0184.jpeg"
        ]
      },
      {
        "key": "textSection7",
        "layout": {
          "type": "text"
        },
        "content": "After our fascinating voyage aboard the Mayflower II, we continued our stroll along Water Street, heading directly towards Plymouth's most iconic landmark: Plymouth Rock! The walk itself is a journey through living history that tells the story of America's beginnings."
      },
      {
        "key": "image-gridSection8",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0213.jpeg",
          "IMG_0215.jpeg",
          "IMG_0232.jpeg",
          "IMG_0233.jpeg",
          "IMG_0234.jpeg",
          "IMG_0236.jpeg"
        ]
      },
      {
        "key": "two-columnSection9",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text"
        },
        "content": "Arriving at the Rock, let's be honest: when you first see it, it might not be the massive, towering monument some imagine. But its true significance isn't in its size, it's in its story and symbolism. Nestled beneath an impressive granite. The Rock is widely recognized as the traditional landing place of the Pilgrims in December 1620. While historians debate whether this exact stone was their first point of contact (many believe it was, but there's no definitive proof from the Pilgrims themselves), what is undeniable is its enduring role as a powerful national icon.",
        "leftImage": "IMG_0220.jpeg"
      },
      {
        "key": "image-gridSection10",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0216.jpeg",
          "IMG_0231.jpeg"
        ]
      },
      {
        "key": "textSection11",
        "layout": {
          "type": "text"
        },
        "content": "We started our ascent away from the waterfront, climbing towards another of Plymouth's essential historical gems: the famous Plimoth Grist Mill. The way uphill is a beautiful journey through the heart of the town, you will pass the Burial Hill, Plymouth's oldest and most historic cemetery. Dating back to the 17th century, it's the final resting place for many original Pilgrims and their descendants.  \ud83e\udea6\ud83c\udf33\n\nThe Plimoth Grist Mill isn't just a picturesque old building; it's a working replica of a 17th-century water-powered grist mill!"
      },
      {
        "key": "image-gridSection12",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0246.jpeg",
          "IMG_0247.jpeg",
          "IMG_0248.jpeg",
          "IMG_0249.jpeg",
          "IMG_0256.jpeg",
          "IMG_0259.jpeg",
          "IMG_0245.jpeg",
          "IMG_0236.jpeg"
        ]
      },
      {
        "key": "textSection13",
        "layout": {
          "type": "text"
        },
        "content": "After our historical deep dive, we decided to stroll through downtown Plymouth, and it's delightful! It's a fantastic blend of old-world charm and modern convenience. \n\nTown Square is located near Burial Hill and the First Parish Church. You'll find charming shops and historical markers, making it a lovely place to soak in the atmosphere. \ud83c\udfd8\ufe0f\u26ea\nWe couldn't resist! We grabbed a delicious ice cream \ud83c\udf66 and were lucky enough to find a cozy spot that overlooked the sparkling harbor\ud83d\udeb6\u200d\u2640\ufe0f\ud83c\udf89"
      },
      {
        "key": "image-gridSection14",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0243.jpeg",
          "IMG_0244.jpeg",
          "IMG_0235.jpeg",
          "IMG_0261.jpeg",
          "IMG_0263.jpeg",
          "IMG_0264.jpeg",
          "IMG_0266.jpeg",
          "IMG_0267.jpeg",
          "IMG_0269.jpeg",
          "IMG_0275.jpeg",
          "IMG_0273.jpeg"
        ]
      },
      {
        "key": "textSection15",
        "layout": {
          "type": "text"
        },
        "content": "After our downtown break, complete with ice cream and those perfect harbor views \ud83c\udf66\u2693, we reluctantly pulled ourselves away and hopped back in the car. Our next destination was the grand finale of our Plymouth journey, and arguably the most immersive experience: Plimoth Patuxet Museums!\n\nJust a short drive from the historic waterfront, this isn't just a museum \u2013 it's a living journey with a live demonstration. If you've ever visited Historic Colonial Williamsburg in Virginia, you'll immediately feel a similar magic here. It brings history to life in an incredibly authentic and engaging way! \u2728 (\ud83d\udca5allow 2-3h)"
      },
      {
        "key": "image-gridSection16",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0279.jpeg",
          "IMG_0280.jpeg",
          "IMG_0282.jpeg"
        ]
      },
      {
        "key": "two-columnSection17",
        "layout": {
          "type": "two-column",
          "leftType": "image",
          "rightType": "text"
        },
        "content": "But wait! On our way from Plimoth Patuxet back to the harbor for dinner, we made one last, absolutely must-stop detour: the incredible National Monument to the Forefathers! \ud83d\uddfd\n\nThis towering granite monument, dedicated in 1889, is an often-overlooked masterpiece. Did you know that it is the largest granite monument in the United States? It symbolizes the ideals the Pilgrims brought with them.  Take a moment to walk around it \u2013 it's truly breathtaking! \ud83e\udd2f\nI",
        "leftImage": "IMG_0283.jpeg"
      },
      {
        "key": "textSection18",
        "layout": {
          "type": "text"
        },
        "content": "We returned to the vibrant waterfront for our grand finale: a delicious dinner back at the harbor! We settled into a restaurant right on Fisherman's Wharf, eager to savor some local flavors. \ud83c\udf7d\ufe0f\ud83e\udd80\n Cheers to history, charm, and unforgettable experiences! \ud83e\udd42\ud83c\udf0a"
      },
      {
        "key": "image-gridSection19",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_0284.jpeg",
          "IMG_0286.jpeg",
          "IMG_0288.jpeg",
          "IMG_0299.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const UNITED_STATES_MASSACHUSETTS_POST_1 = createBlogPost(unitedstatesmassachusettsContent);
