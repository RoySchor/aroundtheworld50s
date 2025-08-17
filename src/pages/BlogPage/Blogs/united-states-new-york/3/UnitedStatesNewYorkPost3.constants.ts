import { BlogPostContent } from './UnitedStatesNewYorkPost3.types';

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
  path: "united-states-new-york/3",
  header: "📍Fireworks Over the Hudson: A 4th of July NYC Spectacle",
  title: "📍Fireworks Over the Hudson",
  subtitle: "✨A Night of Stars & Stripes: Catching the 4th of July Fireworks on the Hudson River🎇",
  backgroundImage: "IMG_1137.jpeg",
  description: `Oh, that 4th of July night on the Hudson River! It's one of those experiences you don't forget. I'm taking you back to the sheer magic of watching those spectacular fireworks light up the New York City skyline, from the buzzing energy of the crowds to finding that perfect spot to witness the display, an NYC summer moment. I love fireworks so much, and this display was everything!`,
  tipsSection: "",
  tipsLink: "/aroundtheworld50s#",
  itineraries: [],
  content: [
      {
        "key": "textSection1",
        "layout": {
          "type": "text"
        },
        "content": "The anticipation was palpable. We arrived in the area around 5 PM, determined to snag a great spot along the Lower East Side. It took us more than 30 minutes to walk from the station because so many streets were closed! We had to follow the police's directions to figure out where we were allowed to enter the viewing area. Even by 5 PM, people were already stretched out along the river, totally committed to getting the best view. Despite the crowds, we managed to find a good spot, even able to lean right on the railing! The riverfront slowly filled up, everyone eager to witness the legendary Macy's fireworks display.\n\nAnd then, just like everyone was holding their breath, it began. A symphony of colors erupted over the river, painting the entire night sky. The fireworks display was breathtaking, dazzling against the iconic city skyline. I remember just being completely in awe as each explosion arced across the sky, reflecting perfectly in the waters of the Hudson below. It truly felt like the city itself was part of the show, not just a backdrop.\n\nFor me, that display was more than just pretty lights; it was a powerful reminder of why I love New York City so much \u2013 that incredible sense of collective wonder and celebration. It captures the spirit of Independence Day in such a unique way.\n\n\ud83d\udca5Pro Tip: If you ever go, arrive early! Seriously, securing a good spot along the riverfront is key to truly soaking in the show without any obstructions.\n\nHave you ever witnessed the Macy's 4th of July Fireworks display? What was your favorite part? Share your experience in the comments below!"
      },
      {
        "key": "image-gridSection2",
        "layout": {
          "type": "image-grid"
        },
        "content": null,
        "images": [
          "IMG_2284.jpeg",
          "IMG_2285.jpeg",
          "IMG_2286.jpeg",
          "IMG_2287.jpeg",
          "IMG_2288.jpeg",
          "IMG_0786.jpg",
          "IMG_1136.jpeg",
          "IMG_1137.jpeg",
          "IMG_1132.JPG",
          "IMG_1135.jpeg"
        ]
      }
    ],
};

// Create the blog post using the generic structure
export const UNITED_STATES_NEW_YORK_POST_3 = createBlogPost(unitedstatesnewyorkContent);
