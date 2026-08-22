export type Dictionary = {
  meta: {
    siteName: string;
    title: string;
    description: string;
  };
  nav: {
    top: string;
    rooms: string;
    gallery: string;
    access: string;
    faq: string;
    booking: string;
    checkAvailability: string;
    policy: string;
    tokushoho: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  statCards: {
    size: { label: string; value: string };
    guests: { label: string; value: string };
    stationOfuna: { label: string; value: string };
    stationKamakura: { label: string; value: string };
    wifi: { label: string; value: string };
  };
  searchForm: {
    heading: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    adults: string;
    children: string;
    submit: string;
  };
  availability: {
    heading: string;
    subheading: string;
    legendAvailable: string;
    legendFull: string;
    legendClosed: string;
    prevMonth: string;
    nextMonth: string;
    weekdays: string[];
  };
  results: {
    roomFee: string;
    extraGuestFee: string;
    cleaningFee: string;
    total: string;
    perNight: string;
    perPerson: string;
    perPersonNote: string;
    ctaBook: string;
    unavailable: string;
    selectDates: string;
    disclaimer: string;
  };
  facility: {
    heading: string;
    intro: string;
    points: string[];
  };
  rooms: {
    bedsHeading: string;
    beds: { room: string; desc: string }[];
    policiesHeading: string;
    policies: { label: string; value: string }[];
  };
  amenities: {
    heading: string;
    items: { label: string; sub?: string }[];
  };
  gallery: {
    heading: string;
    categories: Record<string, string>;
    viewAll: string;
  };
  access: {
    heading: string;
    lead: string;
    fromStation: string;
    note: string;
  };
  faq: {
    heading: string;
    items: { q: string; a: string }[];
  };
  reviews: {
    heading: string;
    note: string;
    items: { rating: number; text: string; source: string }[];
  };
  footer: {
    address: string;
    poweredBy: string;
  };
  stickyCta: {
    checkAvailability: string;
    bookNow: string;
  };
  guestInfo: {
    heading: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    agreePrefix: string;
    agreeLinkText: string;
    agreeSuffix: string;
    submit: string;
    submitting: string;
    errorGeneric: string;
    errorUnavailable: string;
    errorAgreeRequired: string;
  };
  policy: {
    heading: string;
    intro: string;
    cancellationHeading: string;
    cancellationRules: string[];
    paymentHeading: string;
    paymentBody: string;
    contactHeading: string;
    contactBody: string;
  };
  tokushoho: {
    heading: string;
    intro: string;
    labels: {
      operatorName: string;
      representativeName: string;
      address: string;
      phone: string;
      email: string;
      price: string;
      additionalFees: string;
      paymentMethods: string;
      paymentTiming: string;
      serviceTiming: string;
      cancellationPolicy: string;
    };
    priceNote: string;
    paymentMethodsValue: string;
  };
  confirm: {
    verifying: string;
    successHeading: string;
    successBody: string;
    bookingIdLabel: string;
    notPaidHeading: string;
    notPaidBody: string;
    backToTop: string;
  };
  language: {
    ja: string;
    en: string;
  };
};
