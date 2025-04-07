import React from "react";
import "../../../../../styles/layout.css";
import "../../BlogPost.css";
import background from "../../../../../assets/blog/trinidad-and-tobago/1/trinidad-tobego-post-1-bg.jpg";
import TwoColumnLayout from "../../../../../components/TwoColumnLayout/TwoColumnLayout";
import ImageGrid from "../../../../../components/ImageGrid/ImageGrid";
import MapEmbed from "../../../../../components/MapEmbed/MapEmbed";

const TrinidadTobegoPost1 = () => {
  const images = [
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
  ];

  const portOfSpainMap = (
    <MapEmbed
      title="Port of Spain Map"
      url="https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d15683.427881537722!2d-61.524383801540914!3d10.668208131583249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e0!4m5!1s0x8c3607d0be7ebb55%3A0x2dd4764afb66c4d6!2sThe%20BRIX%2C%20Autograph%20Collection%2C%20Coblentz%20Avenue%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6730318!2d-61.5088929!4m5!1s0x8c3607b9acef9d09%3A0xebc97d2236bdd499!2sQueen&#39;s%20Hall%2C%201-3%20St%20Ann&#39;s%20Rd%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6726361!2d-61.510602299999995!4m5!1s0x8c36080ae020b87d%3A0x9331045e7a215764!2sQueen&#39;s%20Park%20W%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6665236!2d-61.5163863!4m5!1s0x8c360876ae030299%3A0x274e0b4cadf67adb!2sStollmeyer%E2%80%99s%20Castle%20Killarney%2C%2031%20Maraval%20Road%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.672433!2d-61.518896899999994!4m5!1s0x8c3607e0e1493be1%3A0x6309c523240869dd!2sMF7R%2BC5V%20Memorial%20Park%2C%20Frederick%20St%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6636028!2d-61.509577799999995!4m5!1s0x8c3608757d0f84eb%3A0x7891e3ceea281d80!2sQueen&#39;s%20Park%20Savannah%2C%2011%20Queen&#39;s%20Park%20E%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6687426!2d-61.514367699999994!5e0!3m2!1sen!2sus!4v1743990738788!5m2!1sen!2sus"
    />
  );

  const downtownMap = (
    <MapEmbed
      title="Downtown Port of Spain Map"
      url="https://www.google.com/maps/embed?pb=!1m52!1m12!1m3!1d15684.004408995012!2d-61.52428470154345!3d10.657021531751628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m37!3e2!4m5!1s0x8c36080e40b8d411%3A0x6208586c6f6dc38f!2sAriapita%20Ave%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6617622!2d-61.523201099999994!4m5!1s0x8c3607e0e1493be1%3A0x6309c523240869dd!2sMemorial%20Park%2C%20MF7R%2BC5V%2C%20Frederick%20St%2C%20Port%20of%20Spain%2C%20Trinidad%20%26%20Tobago!3m2!1d10.6636028!2d-61.509577799999995!4m5!1s0x8c3607e288036ef9%3A0x151605af19573381!2sDowntown%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.659713499999999!2d-61.5121439!4m5!1s0x8c3607fc4b99ed0b%3A0x98beed9e7918873d!2sTrinity%20Cathedral%2C%20Abercromby%20Street%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6521017!2d-61.5105016!4m5!1s0x8c3607005d63b933%3A0x6d53250b28d09a8!2sCathedral%20of%20the%20Immaculate%20Conception%2C%20Independence%20Square%20South%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6497878!2d-61.507347499999995!4m5!1s0x8c3607feaf1fecf5%3A0xdc1681a7e287d238!2sIndependence%20Square%2C%20Port%20of%20Spain%2C%20Trinidad%20and%20Tobago!3m2!1d10.6501178!2d-61.504768799999994!5e0!3m2!1sen!2sus!4v1744001699541!5m2!1sen!2sus"
    />
  );

  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            📍🇹🇹 Trinidad & Tobago: A Tale of Two Islands
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <div className="post-title">📌Port-of-Spain</div>

          <div className="post-subtitle">
            ⛱️10 days of Caribbean Charm: Uncovering the Soul and Beaches ✨
          </div>

          <div className="post-description">
            Our Trinidad & Tobago adventure was a spur-of-the-moment decision.
            When our cruise was unexpectedly rerouted (due to a hurricane), we
            embraced the unexpected and planned a last-minute island getaway.
            The idea of exploring these vibrant twin islands, fueled by my
            husband's friend's glowing descriptions of the culture and beaches,
            quickly took hold. And so, our Caribbean escape began.
          </div>

          {/* TODO: Wrap this in Link to Tips Page */}
          <div className="post-bolded-text post-tips-section-container">
            💥 Insider Tips: Your Key to an Unforgettable Trip (read more…)
          </div>

          <TwoColumnLayout
            leftPane={{
              type: "list",
              listTitle: "Itinerary 📍",
              listItems: [
                "📌 The BRIX, Autograph Collection",
                "📌 Queen's Hall",
                "📌 Stollmeyer's Castle Killarney",
                "📌 Memorial Park",
                "📌 Queen's Park Savannah",
              ],
            }}
            // To Retreive the Embeded map url you need:
            // 1. Go to the Google Maps created map
            // 2. Click on the hamburger / menu button on the top left
            // 3. Click on the "Share or embed map button
            // 4. Go to the "Embed a map" tab
            // 5. Copy just the link from the provided html code.
            // 5. Paste it in the url field
            rightPane={{
              type: "map",
              mapComponent: portOfSpainMap,
            }}
          />

          <ImageGrid images={images} />

          <TwoColumnLayout
            leftPane={{
              type: "image",
              imageUrl: background,
              imageAlt: "Port of Spain",
            }}
            rightPane={{
              type: "text",
              content:
                "The 🛩️ touched down in 📌Port of Spain just before noon. We hailed a 🚕taxi to our hotel, The #BRIX, Autograph Collection. We selected this 🏨for its upscale accommodations, great deal, and proximity to key attractions like 📌Queen's Park.",
            }}
          />

          <div className="post-description">
            We strolled down the street, passing the historic 📌Queen's Hall,
            heading towards the 📌Magnificent Seven, a collection of seven
            stunning Victorian-era mansions on Maraval Road in #PortofSpain.
            These 🏰architectural gems, built between 1902 and 1910, offer a
            glimpse into the island's opulent past. We strolled along the
            street, admiring their unique architectural styles, including French
            Colonial, Scottish baronial, and Indian Empire influences. The
            intricate details of each mansion while imagining the lives of the
            families who once resided within their walls.
          </div>

          <ImageGrid images={images} />

          <TwoColumnLayout
            leftPane={{
              type: "image",
              imageUrl: background,
              imageAlt: "Port of Spain",
            }}
            rightPane={{
              type: "text",
              content:
                "As we strolled leisurely through 📌Memorial Park and the iconic 📌Queen's Park Oval, we couldn't resist indulging in this cold, refreshing 🥥coconut water from street vendors.",
            }}
          />

          <div className="post-description">
            As it was still early afternoon, we hopped into a 🚕, heading
            downtown to the vibrant soul, a blend of history and culture.
            Downtown Port of Spain is a whirlwind of activity, where the city's
            rhythm pulses through the streets. Historic landmarks stand proudly
            alongside modern buildings while the air is filled with the sounds
            of lively chatter, soca music, and the tempting aromas of street
            food. It's a captivating blend of history and modernity with grand
            colonial buildings, bustling markets, and tranquil squares.
          </div>

          <TwoColumnLayout
            leftPane={{
              type: "list",
              listTitle: "Itinerary 📍",
              listItems: [
                "📌 Ariapita Avenue",
                "📌 Independence Square",
                "📌 Memorial Park",
                "📌 Downtown Port of Spain",
                "📌 Trinity Cathedral",
                "📌 Cathedral of the Immaculate Conception",
                "📌 Independence Square",
              ],
            }}
            rightPane={{
              type: "map",
              mapComponent: downtownMap,
            }}
          />

          <TwoColumnLayout
            leftPane={{
              type: "image",
              imageUrl: background,
              imageAlt: "Port of Spain",
            }}
            rightPane={{
              type: "text",
              content:
                "We asked the driver to drop us off few blocks from 📌Independence Square, so we could soak in the vibrant #atmosphere of downtown. Independence Square was a bustling hub of activity, with people going about their day and street vendors selling their wares. We wandered through the square, soaking up the vibrant atmosphere and admiring the architecture of the surrounding buildings. Towering government buildings, like silent sentinels, watched over the square. We passed the Red House, the seat of Parliament, a grand building that whispered tales of political history. The Supreme Court, a majestic edifice, stood nearby, a reminder of the island's legal system. It was a fascinating walk, a journey through the heart of Trinidad and Tobago's governance.",
            }}
          />

          <ImageGrid images={images} />

          <div className="post-description">
            The square pulsed with the vibrant energy of this Caribbean capital
            surrounded by historic government buildings. We approached the
            majestic 📌Cathedral of the Immaculate Conception⛪, which loomed
            against the lively Port of Spain skyline. As we approached, its
            imposing presence commanded attention by its intricate stonework,
            the soaring spires, and the sense of tranquility. Stepping inside
            was like entering another world of awe-inspiring beauty. Sunlight
            streamed through stained glass windows, casting colors across the
            polished marble floor.
          </div>

          <div className="post-description">
            We were drawn into the lively #market, a sensory explosion! We
            navigated the bustling crowds, captivated by the vibrant display of
            fruits and vegetables. Mountains of pineapples, peppers, and many
            other colorful produce overflowed from every stall, creating an
            exhilarating experience that immersed us in the local culture.
          </div>

          <div className="post-description">
            We continued our exploration, venturing towards 📌Trinity
            Cathedral⛪, architectural beauty, a breathtaking testament to the
            island's history. Stepping inside was like stepping back in time. We
            continued along the road, passing charming gardens adorned with
            sculptures, until we reached the traffic light where the police
            station was located, and our #journey came to an unexpected halt. A
            friendly 👮police officer advised us against proceeding further,
            citing safety concerns for tourists in that particular area.
          </div>

          <div className="post-description">
            We retraced our steps back towards the vibrant market and hailed
            another 🚕. Our destination? 📌#Ariapita Avenue, renowned as Port of
            Spain's "foodie street". We envisioned a lively culinary scene with
            many restaurants and some street vendors. Unfortunately, our
            expectations weren't fully met. The street seemed a bit subdued,
            with several establishments closed. We weren't sure if the time of
            day (around 7 PM) or perhaps the off-season (October) contributed to
            the quieter atmosphere.
          </div>

          <div className="post-description">
            Hungry, we followed the hotel's recommendation and returned to
            Memorial Park, eager to sample the local flavors. We paused at the
            Cenotaph Garden, paying our respects at this poignant memorial
            within Memorial Park. We were excited to discover a vibrant food
            truck scene, a delicious and lively way to experience the local
            cuisine at the southern point of the park across from the
            performance art center. It was the perfect place to experience
            authentic local cuisine.
          </div>

          <div className="post-description">
            Back at the hotel, we retreated to the rooftop 🍻bar of our 🏨hotel.
            Sipping on cool drinks🍹, we relaxed and enjoyed breathtaking
            panoramic views of the city sparkling below. A delightful surprise
            awaited us in our room! A beautifully arranged tray laden with
            decadent cakes sat on the table, a thoughtful gesture from the hotel
            to celebrate my husband's birthday and our anniversary. What a
            wonderful way to end the day!
          </div>

          <div className="post-description">
            A delightful surprise awaited us in our room! A beautifully arranged
            tray laden with decadent cakes sat on the table, a thoughtful
            gesture from the hotel to celebrate my husband's birthday and our
            anniversary. What a wonderful way to end the day!
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrinidadTobegoPost1;
