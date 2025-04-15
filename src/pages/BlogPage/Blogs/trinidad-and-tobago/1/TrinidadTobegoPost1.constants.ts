import { BlogPostContent } from './TrinidadTobegoPost1.types';

// Generic blog post structure that can be reused
export const createBlogPost = (content: BlogPostContent): BlogPostContent => ({
  header: content.header,
  title: content.title,
  subtitle: content.subtitle,
  description: content.description,
  tipsSection: content.tipsSection,
  itineraries: content.itineraries || [],
  content: content.content || [],
});

// Specific content for Trinidad and Tobago post
const trinidadTobagoContent: BlogPostContent = {
  header: "📍🇹🇹 Trinidad & Tobago: A Tale of Two Islands",
  title: "📌Port-of-Spain",
  subtitle: "⛱️10 days of Caribbean Charm: Uncovering the Soul and Beaches ✨",
  description: `
    Our Trinidad & Tobago adventure was a spur-of-the-moment decision.
    When our cruise was unexpectedly rerouted (due to a hurricane), we embraced
    the unexpected and planned a last-minute island getaway.
    The idea of exploring these vibrant twin islands, fueled by my husband's
    friend's glowing descriptions of the culture and beaches, quickly took hold.
    And so, our Caribbean escape began.
  `,
  tipsSection:
    "💥 Insider Tips: Your Key to an Unforgettable Trip (read more…)",
  itineraries: [
    {
      title: "Itinerary 📍",
      items: [
        "📌 The BRIX, Autograph Collection",
        "📌 Queen's Hall",
        "📌 Stollmeyer's Castle Killarney",
        "📌 Memorial Park",
        "📌 Queen's Park Savannah",
      ],
    },
    {
      title: "Itinerary 📍",
      items: [
        "📌 Ariapita Avenue",
        "📌 Independence Square",
        "📌 Memorial Park",
        "📌 Downtown Port of Spain",
        "📌 Trinity Cathedral",
        "📌 Cathedral of the Immaculate Conception",
        "📌 Independence Square",
      ],
    },
  ],
  content: [
    {
      key: "firstItinerary",
      layout: { type: "itinerary-with-map", mapIndex: 0 },
      content: null,
    },
    {
      key: "firstImageGrid",
      layout: { type: "image-grid" },
      content: null,
      images: [
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
      ],
    },
    {
      key: "arrivalDescription",
      layout: { type: "two-column", leftType: "image", rightType: "text" },
      content: `
        The 🛩️ touched down in 📌Port of Spain just before noon. We hailed a 🚕taxi
        to our hotel, The #BRIX, Autograph Collection. We selected this 🏨for its
        upscale accommodations, great deal, and proximity to key attractions like
        📌Queen's Park.
      `,
      leftImage: "trinidad-tobego-post-1-bg.jpg",
    },
    {
      key: "magnificentSeven",
      layout: { type: "text" },
      content: `
        We strolled down the street, passing the historic 📌Queen's Hall, heading
        towards the 📌Magnificent Seven, a collection of seven stunning Victorian-era
        mansions on Maraval Road in #PortofSpain. These 🏰architectural gems, built
        between 1902 and 1910, offer a glimpse into the island's opulent past.
        We strolled along the street, admiring their unique architectural styles,
        including French Colonial, Scottish baronial, and Indian Empire influences.
        The intricate details of each mansion while imagining the lives of the
        families who once resided within their walls.
      `,
    },
    {
      key: "secondImageGrid",
      layout: { type: "image-grid" },
      content: null,
      images: [
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
        "trinidad-tobego-post-1-bg.jpg",
      ],
    },
    {
      key: "memorialPark",
      layout: { type: "two-column", leftType: "image", rightType: "text" },
      content: `
        As we strolled leisurely through 📌Memorial Park and the iconic 📌Queen's
        Park Oval, we couldn't resist indulging in this cold, refreshing 🥥coconut
        water from street vendors.
      `,
      leftImage: "trinidad-tobego-post-1-bg.jpg",
    },
    {
      key: "downtownDescription",
      layout: { type: "text" },
      content: `
        As it was still early afternoon, we hopped into a 🚕, heading downtown to
        the vibrant soul, a blend of history and culture. Downtown Port of Spain
        is a whirlwind of activity, where the city's rhythm pulses through the
        streets. Historic landmarks stand proudly alongside modern buildings while
        the air is filled with the sounds of lively chatter, soca music, and the
        tempting aromas of street food. It's a captivating blend of history and
        modernity with grand colonial buildings, bustling markets, and tranquil squares.
      `,
    },
    {
      key: "secondItinerary",
      layout: { type: "itinerary-with-map", mapIndex: 1 },
      content: null,
    },
    {
      key: "independenceSquare",
      layout: { type: "two-column", leftType: "image", rightType: "text" },
      content: `
        We asked the driver to drop us off few blocks from 📌Independence Square,
        so we could soak in the vibrant #atmosphere of downtown. Independence Square
        was a bustling hub of activity, with people going about their day and street
        vendors selling their wares. We wandered through the square, soaking up the
        vibrant atmosphere and admiring the architecture of the surrounding buildings.
        Towering government buildings, like silent sentinels, watched over the square.
        We passed the Red House, the seat of Parliament, a grand building that
        whispered tales of political history. The Supreme Court, a majestic edifice,
        stood nearby, a reminder of the island's legal system. It was a fascinating
        walk, a journey through the heart of Trinidad and Tobago's governance.
      `,
      leftImage: "trinidad-tobego-post-1-bg.jpg",
    },
    {
      key: "cathedral",
      layout: { type: "text" },
      content: `
        The square pulsed with the vibrant energy of this Caribbean capital
        surrounded by historic government buildings. We approached the majestic
        📌Cathedral of the Immaculate Conception⛪, which loomed against the lively
        Port of Spain skyline. As we approached, its imposing presence commanded
        attention by its intricate stonework, the soaring spires, and the sense
        of tranquility. Stepping inside was like entering another world of
        awe-inspiring beauty. Sunlight streamed through stained glass windows,
        casting colors across the polished marble floor.
      `,
    },
    {
      key: "market",
      layout: { type: "text" },
      content: `
        We were drawn into the lively #market, a sensory explosion! We navigated
        the bustling crowds, captivated by the vibrant display of fruits and
        vegetables. Mountains of pineapples, peppers, and many other colorful
        produce overflowed from every stall, creating an exhilarating experience
        that immersed us in the local culture.
      `,
    },
    {
      key: "trinityCathedral",
      layout: { type: "two-column", leftType: "text", rightType: "image" },
      content: `
        We continued our exploration, venturing towards 📌Trinity Cathedral⛪,
        architectural beauty, a breathtaking testament to the island's history.
        Stepping inside was like stepping back in time. We continued along the
        road, passing charming gardens adorned with sculptures, until we reached
        the traffic light where the police station was located, and our #journey
        came to an unexpected halt. A friendly 👮police officer advised us against
        proceeding further, citing safety concerns for tourists in that particular area.
      `,
      rightImage: "trinidad-tobego-post-1-bg.jpg",
    },
    {
      key: "ariapitaAvenue",
      layout: { type: "text" },
      content: `
        We retraced our steps back towards the vibrant market and hailed another
        🚕. Our destination? 📌#Ariapita Avenue, renowned as Port of Spain's "foodie
        street". We envisioned a lively culinary scene with many restaurants and
        some street vendors. Unfortunately, our expectations weren't fully met.
        The street seemed a bit subdued, with several establishments closed. We
        weren't sure if the time of day (around 7 PM) or perhaps the off-season
        (October) contributed to the quieter atmosphere.
      `,
    },
    {
      key: "memorialParkDinner",
      layout: { type: "text" },
      content: `
        Hungry, we followed the hotel's recommendation and returned to Memorial
        Park, eager to sample the local flavors. We paused at the Cenotaph Garden,
        paying our respects at this poignant memorial within Memorial Park. We were
        excited to discover a vibrant food truck scene, a delicious and lively way
        to experience the local cuisine at the southern point of the park across
        from the performance art center. It was the perfect place to experience
        authentic local cuisine.
      `,
    },
    {
      key: "evening",
      layout: { type: "text" },
      content: `
        Back at the hotel, we retreated to the rooftop 🍻bar of our 🏨hotel.
        Sipping on cool drinks🍹, we relaxed and enjoyed breathtaking panoramic
        views of the city sparkling below. A delightful surprise awaited us in
        our room! A beautifully arranged tray laden with decadent cakes sat on
        the table, a thoughtful gesture from the hotel to celebrate my husband's
        birthday and our anniversary. What a wonderful way to end the day!
      `,
    },
    {
      key: "surprise",
      layout: { type: "text" },
      content: `
        A delightful surprise awaited us in our room! A beautifully arranged
        tray laden with decadent cakes sat on the table, a thoughtful gesture
        from the hotel to celebrate my husband's birthday and our anniversary.
        What a wonderful way to end the day!
      `,
    },
  ],
};

// Create the blog post using the generic structure
export const TRINIDAD_TOBAGO_POST_1 = createBlogPost(trinidadTobagoContent);