import React, { useEffect, useState } from "react";
import axios from "axios";
```
Steps to Use Instagram Graph API
Set Up Instagram Graph API

Ensure your Instagram account is set to a Professional (Business or Creator) account.
Link your Instagram account to a Facebook page.
Register as a Facebook Developer and create an app at the Facebook Developers Portal. (https://developers.facebook.com/)

Generate an Access Token

Get an Access Token using the Instagram Graph API. You will need:
App ID and App Secret.
A valid redirect URI.
Use the Access Token Tool (https://developers.facebook.com/tools/access-token/) to generate a long-lived access token.

Fetch Instagram Posts

Use the /me/media endpoint to fetch recent posts from your account:
Documentation: Instagram Graph API Reference - User Media. (https://developers.facebook.com/docs/instagram-api/reference/user-media/)
```;
const InstagramSection = () => {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({});
  const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your Instagram Graph API Access Token

  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        const profileResponse = await axios.get(
          `https://graph.instagram.com/me?fields=username,account_type,media_count&access_token=${accessToken}`,
        );
        setProfile(profileResponse.data);

        const postsResponse = await axios.get(
          `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,caption,permalink&access_token=${accessToken}`,
        );
        setPosts(postsResponse.data.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching Instagram data:", error);
      }
    };

    fetchInstagramData();
  }, []);

  return (
    <div className="border-4 border-tan bg-white rounded-lg p-8 mt-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold font-cursive text-center mb-6 text-gray-800">
        Join me on Instagram{" "}
        <a
          href={`https://instagram.com/${profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tan hover:underline"
        >
          @{profile.username}
        </a>
      </h2>
      <div className="flex items-center gap-4 mb-8">
        <img
          src={`https://via.placeholder.com/64`} // Replace with your profile image URL if available
          alt={`${profile.username} Profile`}
          className="w-16 h-16 rounded-full object-cover border-2 border-tan"
        />
        <div>
          <p className="font-bold text-lg text-gray-800">@{profile.username}</p>
          <p className="text-sm text-gray-600">
            Exploring the world one step at a time. 🌍 Sharing stories,
            memories, and places that inspire.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden"
          >
            <a href={post.permalink} target="_blank" rel="noopener noreferrer">
              <img
                src={post.media_url}
                alt={post.caption || "Instagram Post"}
                className="w-full h-full object-cover"
              />
            </a>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() =>
            window.open(`https://instagram.com/${profile.username}`, "_blank")
          }
          className="px-4 py-2 bg-tan text-white text-sm rounded hover:bg-gray-800 hover:text-white"
        >
          Follow on Instagram
        </button>
      </div>
    </div>
  );
};

export default InstagramSection;
