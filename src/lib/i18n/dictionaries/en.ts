import type { Dictionary } from "../dictionary-type";

const en: Dictionary = {
  meta: {
    siteName: "Kamakura Gate Inn",
    title: "Kamakura Gate Inn | 7-min walk from Ofuna Station, sleeps 6",
    description:
      "Your base for exploring Kamakura and Shonan. A private 58sqm stay for up to 6 guests, 7 minutes on foot from Ofuna Station. Book direct with Kamakura Gate Inn.",
  },
  nav: {
    top: "Home",
    rooms: "The Place",
    gallery: "Gallery",
    access: "Access",
    faq: "FAQ",
    booking: "Check Availability",
    checkAvailability: "Check Availability",
  },
  hero: {
    title: "Kamakura Gate Inn",
    subtitle:
      "Your base for exploring Kamakura and Shonan. A private 58sqm stay for up to 6 guests, 7 minutes on foot from Ofuna Station.",
  },
  statCards: {
    size: { label: "Size", value: "58 sqm" },
    guests: { label: "Sleeps up to", value: "6 guests" },
    stationOfuna: { label: "Ofuna Station", value: "7 min walk" },
    stationKamakura: { label: "Kamakura Station", value: "~6 min" },
    wifi: { label: "Wi-Fi", value: "~820 Mbps" },
  },
  searchForm: {
    heading: "Check Availability & Price",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    adults: "Adults",
    children: "Children",
    submit: "Check Availability",
  },
  availability: {
    heading: "Availability Calendar",
    subheading:
      "Daily availability and indicative pricing. Fully booked dates cannot be selected.",
    legendAvailable: "Available",
    legendFull: "Full",
    legendClosed: "Not bookable",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  results: {
    roomFee: "Room fee",
    extraGuestFee: "Extra guest fee",
    cleaningFee: "Cleaning fee",
    total: "Total",
    perNight: "Per night",
    perPerson: "Per person",
    perPersonNote: "The more guests in your group, the lower the cost per person.",
    ctaBook: "Book these dates",
    unavailable: "These dates are not available. Please try different dates.",
    selectDates: "Please select check-in, check-out, and number of guests.",
    disclaimer:
      "Prices shown are indicative. Please confirm the final amount on the Beds24 booking page.",
  },
  facility: {
    heading: "About the Place",
    intro:
      "A whole-house terrace stay just 7 minutes on foot from Ofuna Station, ideal as a base for exploring Kamakura. The 58sqm 1LDK + loft layout sleeps up to 6, perfect for families and groups.",
    points: [
      "Sleeps up to 6 guests",
      "58 sqm whole-house rental, 1LDK + loft",
      "Great for families and groups",
      "65-inch TV",
      "Washer/dryer included",
      "High-speed Wi-Fi (~820 Mbps)",
      "7-minute walk from Ofuna Station",
      "Easy access to Kamakura sightseeing",
    ],
  },
  rooms: {
    bedsHeading: "Bed Configuration",
    beds: [
      { room: "1F Bedroom", desc: "2 single beds" },
      { room: "Loft", desc: "2 double futons" },
    ],
    policiesHeading: "House Rules",
    policies: [
      { label: "Check-in", value: "15:00–22:00" },
      { label: "Check-out", value: "11:00" },
      { label: "Smoking", value: "Not allowed" },
      { label: "Pets", value: "Not allowed" },
      { label: "Children", value: "Welcome" },
    ],
  },
  amenities: {
    heading: "Amenities",
    items: [
      { label: "Wi-Fi", sub: "~820 Mbps" },
      { label: "TV", sub: "65 inch" },
      { label: "Washer / Dryer" },
      { label: "Bathroom Dryer" },
      { label: "Air Conditioning", sub: "in every room" },
      { label: "Washlet" },
      { label: "Kitchen" },
      { label: "Large Sofa" },
      { label: "Self Check-in" },
    ],
  },
  gallery: {
    heading: "Photo Gallery",
    categories: {
      living: "Living",
      bedroom: "Bedroom",
      loft: "Loft",
      kitchen: "Kitchen",
      bathroom: "Bathroom",
      exterior: "Exterior",
    },
    viewAll: "View all photos",
  },
  access: {
    heading: "Access",
    lead: "A 7-minute walk from JR Ofuna Station. Kamakura Station is about 6 minutes by train, making this an ideal base for sightseeing in Kamakura and Shonan.",
    fromStation: "7-minute walk from Ofuna Station",
    note: "Detailed directions will be sent after booking.",
  },
  faq: {
    heading: "FAQ",
    items: [
      {
        q: "What time is check-in?",
        a: "Check-in is between 15:00 and 22:00. Self check-in is available.",
      },
      {
        q: "What time is check-out?",
        a: "Check-out is by 11:00.",
      },
      {
        q: "What is the maximum number of guests?",
        a: "Up to 6 guests. The base rate covers up to 3 guests; an extra fee per person applies from the 4th guest onward.",
      },
      {
        q: "Can I store my luggage?",
        a: "The property generally cannot store luggage. Please use the coin lockers near Ofuna Station.",
      },
      {
        q: "Is parking available?",
        a: "Parking availability depends on the property. Please contact us for details.",
      },
      {
        q: "Are pets allowed?",
        a: "Pets are not allowed.",
      },
      {
        q: "Can we stay with children?",
        a: "Yes, children are welcome.",
      },
    ],
  },
  reviews: {
    heading: "Guest Reviews",
    note: "Reviews shown are from actual guests.",
    items: [],
  },
  footer: {
    address: "Sakae Ward, Yokohama, Kanagawa, Japan",
    poweredBy: "Availability, pricing, and bookings are powered by Beds24.",
  },
  stickyCta: {
    checkAvailability: "Check Availability",
    bookNow: "Book Now",
  },
  language: {
    ja: "日本語",
    en: "English",
  },
};

export default en;
