type SeoEntry = { title: string; description: string };

export type Dictionary = {
  meta: {
    siteName: string;
    title: string;
    description: string;
    /** Short label on the generated social-share image (opengraph-image.tsx). */
    ogBadge: string;
    /** One line of selling points under the name on that image - keep it short enough to fit. */
    ogTagline: string;
  };
  seo: {
    rooms: SeoEntry;
    gallery: SeoEntry;
    access: SeoEntry;
    parking: SeoEntry;
    sightseeing: SeoEntry;
    faq: SeoEntry;
    reviews: SeoEntry;
    booking: SeoEntry;
    policy: SeoEntry;
    tokushoho: SeoEntry;
    contact: SeoEntry;
    privacy: SeoEntry;
  };
  nav: {
    top: string;
    rooms: string;
    gallery: string;
    access: string;
    parking: string;
    sightseeing: string;
    faq: string;
    reviews: string;
    booking: string;
    checkAvailability: string;
    policy: string;
    tokushoho: string;
    contact: string;
    privacy: string;
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
    bestValue: string;
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
    note: string;
  };
  parking: {
    heading: string;
    intro: string;
    addressLabel: string;
    distanceSuffix: string;
    priceLabel: string;
    mapLinkLabel: string;
    disclaimer: string;
  };
  sightseeing: {
    heading: string;
    intro: string;
    accessLabel: string;
    mapLinkLabel: string;
    areas: {
      kamakura: string;
      fujisawaEnoshima: string;
      yokohama: string;
    };
  };
  faq: {
    heading: string;
    items: { q: string; a: string }[];
  };
  reviews: {
    heading: string;
    note: string;
    viewAll: string;
    ratingWonderful: string;
    ratingVeryGood: string;
    ratingGood: string;
    ratingPleasant: string;
    outOf10: string;
  };
  trackRecord: {
    heading: string;
    groupsLabel: string;
    guestsLabel: string;
    avgGroupSizeLabel: string;
    childRateLabel: string;
    countriesHeading: string;
  };
  footer: {
    poweredBy: string;
  };
  stickyCta: {
    checkAvailability: string;
    bookNow: string;
  };
  guestInfo: {
    steps: string[];
    heading: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    agreePrefix: string;
    agreeLinkText: string;
    agreeSuffix: string;
    privacyPrefix: string;
    privacyLinkText: string;
    privacySuffix: string;
    securePaymentNote: string;
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
  privacy: {
    heading: string;
    intro: string;
    sections: { heading: string; body: string }[];
    contactHeading: string;
    revisionHeading: string;
    revisionBody: string;
  };
  tokushoho: {
    heading: string;
    intro: string;
    labels: {
      operatorName: string;
      representativeName: string;
      businessPermitNumber: string;
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
    noAdditionalFees: string;
    disclosureOnRequest: string;
    contactViaForm: string;
  };
  confirm: {
    verifying: string;
    successHeading: string;
    successBody: string;
    checkinInfoNote: string;
    bookingIdLabel: string;
    notPaidHeading: string;
    notPaidBody: string;
    notPaidContactPrefix: string;
    notPaidContactSuffix: string;
    backToTop: string;
  };
  contact: {
    heading: string;
    intro: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    submitting: string;
    success: string;
    errorGeneric: string;
  };
  language: {
    ja: string;
    en: string;
  };
};
