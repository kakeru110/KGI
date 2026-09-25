export type BlogSection = {
  headingJa: string;
  headingEn: string;
  bodyJa: string;
  bodyEn: string;
};

export type BlogGalleryImage = {
  src: string;
  altJa: string;
  altEn: string;
};

export type BlogPost = {
  slug: string;
  /** ISO date (YYYY-MM-DD), used for display and JSON-LD - update when the post is meaningfully revised. */
  publishedDate: string;
  titleJa: string;
  titleEn: string;
  excerptJa: string;
  excerptEn: string;
  /** Omit when no real photo of the place is available yet - a placeholder or unrelated photo would be misleading. */
  heroImage?: string;
  /** Extra photos shown as a small grid after the hero image. */
  galleryImages?: BlogGalleryImage[];
  sections: BlogSection[];
  /** Optional source link shown under posts with researched facts (e.g. a temple's own site). */
  sourceUrl?: string;
  sourceLabelJa?: string;
  sourceLabelEn?: string;
};

/**
 * Kept newest-first, same convention as guestNotebook.entries - the /blog
 * index just renders this array in order.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "kamakura-family-group-itinerary",
    publishedDate: "2026-09-16",
    titleJa: "子連れ・グループ向け鎌倉1泊2日モデルコース",
    titleEn: "A 1-Night, 2-Day Kamakura Itinerary for Families and Groups",
    excerptJa:
      "大船を拠点に、子連れファミリーや友人グループにおすすめの鎌倉1泊2日モデルコースをご紹介します。",
    excerptEn:
      "A 1-night, 2-day model itinerary for families with kids or groups of friends, based out of Ofuna.",
    heroImage: "/photos/blog/living-room-friends.png",
    galleryImages: [
      {
        src: "/photos/sightseeing/tsurugaoka-hachimangu.jpg",
        altJa: "鶴岡八幡宮",
        altEn: "Tsurugaoka Hachimangu",
      },
      {
        src: "/photos/sightseeing/komachi-dori.jpg",
        altJa: "小町通り",
        altEn: "Komachi-dori",
      },
      {
        src: "/photos/sightseeing/kotokuin-daibutsu.jpg",
        altJa: "鎌倉大仏(高徳院)",
        altEn: "The Great Buddha of Kamakura (Kotoku-in)",
      },
      {
        src: "/photos/sightseeing/yuigahama.jpg",
        altJa: "由比ヶ浜",
        altEn: "Yuigahama beach",
      },
    ],
    sections: [
      {
        headingJa: "こんな旅行におすすめ",
        headingEn: "Who This Course Is For",
        bodyJa:
          "子連れファミリーや友人グループでの鎌倉旅行に、大船を拠点にした1泊2日のモデルコースをご紹介します。移動時間を抑えつつ、鎌倉の定番スポットをしっかり楽しめる内容です。",
        bodyEn:
          "Here's a 1-night, 2-day model itinerary for families with kids or groups of friends visiting Kamakura, based out of Ofuna. It keeps travel time short while still covering Kamakura's classic sights.",
      },
      {
        headingJa: "1日目 — 到着してのんびり",
        headingEn: "Day 1 - Arrive and Relax",
        bodyJa:
          "15:00からセルフチェックインができるので、フロントでのやり取りを待たずにすぐお部屋に入れます。荷物を置いて身軽になったら、徒歩圏内の大船観音へ。高さ25mの観音像は大船駅からもすぐの距離です(詳しくは観音様のブログ記事をご覧ください)。夕方は徒歩5〜6分のスーパーやコンビニで買い出しをして、キッチンで簡単な夕食を。リビングの大型ソファと65インチテレビで、映画を見たりゲームをしたりしながら、初日はゆっくり過ごすのがおすすめです。",
        bodyEn:
          "Check-in opens at 15:00 and is fully self-service, so you can head straight to the room without waiting at a front desk. Once you've dropped off your bags, Ofuna Kannon - the 25m statue - is an easy walk from the station (see our separate guide for details). In the evening, pick up groceries at a nearby supermarket or convenience store, both 5-6 minutes on foot, and put together a simple dinner in the kitchen. With a large sofa and a 65-inch TV in the living room, it's a great spot to unwind with a movie or a game night on your first evening.",
      },
      {
        headingJa: "2日目 — 鎌倉観光へ",
        headingEn: "Day 2 - Exploring Kamakura",
        bodyJa:
          "チェックアウトは11:00までです。お荷物をお預かりする設備はないため、大船駅のコインロッカーへ預けてから身軽に出発するのがおすすめです。JRで鎌倉駅まで乗り換えなし約6分。鶴岡八幡宮を参拝したら、小町通りで食べ歩きやお土産探しを楽しめます。そこから江ノ電に乗り換えて長谷駅へ向かえば、鎌倉大仏(高徳院)や由比ヶ浜での散策も。海沿いを走る江ノ電は、子どもも喜ぶ景色です。大船駅に戻ってコインロッカーの荷物を回収すれば、旅の締めくくりです。",
        bodyEn:
          "Check-out is by 11:00. Since there's no luggage storage at the property, we recommend leaving your bags in a coin locker at Ofuna Station before heading out. From there, it's about a 6-minute ride on JR to Kamakura Station with no transfer. Visit Tsurugaoka Hachimangu, then browse the food stalls and shops along Komachi-dori. From Kamakura Station, the Enoden line takes you to Hase Station for the Great Buddha at Kotoku-in, plus a stroll along Yuigahama beach - the coastal Enoden ride is a treat for kids, too. Head back to Ofuna Station to collect your luggage before wrapping up the trip.",
      },
      {
        headingJa: "持ち物・注意点",
        headingEn: "A Few Tips",
        bodyJa:
          "お子様連れの方には、人数分のお子様用食器もご用意しています。セルフチェックインなので、小さなお子様がぐずってしまっても、フロントでのやり取りを気にせず落ち着いて対応できるのも利点です。グループでの旅行なら、キッチンで買い出したものを一緒に調理したり、リビングでゆっくり語り合ったり、一棟貸しならではの自由な時間を楽しめます。",
        bodyEn:
          "For families, we provide children's tableware for the whole group. Self-check-in also means you're not navigating a front desk if a little one is having a moment - one less thing to manage. For groups of friends, the kitchen makes it easy to cook something together with what you picked up nearby, and the living room gives you space to relax and catch up - the kind of freedom a whole-house rental is made for.",
      },
    ],
  },
  {
    slug: "kitakamakura-autumn-leaves-guide",
    publishedDate: "2026-09-15",
    titleJa: "北鎌倉の紅葉ガイド — 見頃と明月院「悟りの窓」",
    titleEn: "Kitakamakura Autumn Leaves Guide: Meigetsu-in's Window of Enlightenment",
    excerptJa:
      "鎌倉の紅葉は例年11月下旬〜12月上旬が見頃。北鎌倉を代表する紅葉スポット明月院の「悟りの窓」を中心に、円覚寺・建長寺・東慶寺の拝観情報や混雑を避けるコツもご紹介します。",
    excerptEn:
      "Kamakura's autumn colors typically peak from late November to early December. A guide centered on Kitakamakura's signature spot, Meigetsu-in's \"Window of Enlightenment,\" plus visiting details for Engaku-ji, Kencho-ji, and Tokei-ji, and tips for avoiding the crowds.",
    heroImage: "/photos/blog/meigetsuin-madoka.jpg",
    galleryImages: [
      {
        src: "/photos/blog/kitakamakura-autumn-courtyard.jpg",
        altJa: "北鎌倉エリアの紅葉",
        altEn: "Autumn leaves in the Kitakamakura area",
      },
    ],
    sections: [
      {
        headingJa: "鎌倉の紅葉、見頃はいつ？",
        headingEn: "When Do the Leaves Peak in Kamakura?",
        bodyJa:
          "鎌倉の紅葉は例年11月下旬〜12月上旬が見頃です。関東の他エリアと比べると少し遅めなので、都心の紅葉が終わった後でも楽しめます。円覚寺は12月上旬、建長寺は11月末〜12月初めがピークの目安です。",
        bodyEn:
          "Kamakura's autumn colors typically peak from late November to early December - a bit later than much of the Tokyo area, so it's worth a visit even after the leaves elsewhere have passed. Engaku-ji tends to peak in early December, and Kencho-ji in late November to early December.",
      },
      {
        headingJa: "明月院の「悟りの窓」",
        headingEn: "Meigetsu-in's \"Window of Enlightenment\"",
        bodyJa:
          "北鎌倉を代表する紅葉スポットが明月院です。本堂の丸窓は「悟りの窓」と呼ばれ、後庭園の景色を額縁のように切り取る人気の撮影スポットになっています。この後庭園は通常非公開で、紅葉期とハナショウブ期のみ特別公開されます(拝観料とは別に500円が必要)。紅葉シーズンには丸窓の前に行列ができるほどの人気です。拝観時間は9:00〜16:00、拝観料は高校生以上500円、小中学生300円。最寄りはJR北鎌倉駅で、徒歩約10分です。",
        bodyEn:
          "Meigetsu-in is Kitakamakura's signature spot for autumn leaves. The round window in its main hall, known as the \"Window of Enlightenment,\" frames the rear garden like a picture - a hugely popular photo spot. That garden is normally closed to the public and only opens specially during the autumn leaves and iris seasons (an extra ¥500 on top of admission). During peak leaf season, a line forms in front of the window. Hours are 9:00-16:00, admission ¥500 for high school age and up and ¥300 for elementary and junior high students. The nearest station is JR Kitakamakura, about a 10-minute walk away.",
      },
      {
        headingJa: "北鎌倉エリアの他の紅葉スポット",
        headingEn: "Other Spots in the Kitakamakura Area",
        bodyJa:
          "明月院のほかにも、北鎌倉には紅葉の名所が点在しています。円覚寺は拝観時間8:30〜16:30(12〜2月は16:00まで)、拝観料は高校生以上500円・小中学生200円で、例年11月下旬〜12月上旬が見頃です。境内の妙香池に紅葉が映り込む景色が人気の撮影スポットになっています。建長寺も拝観時間8:30〜16:30、拝観料は同じく500円・200円。総門から奥に進むほど人が少なくなり、最奥の半僧坊まで足を延ばすと落ち着いて紅葉を楽しめます。東慶寺は拝観時間9:00〜16:00で、本堂拝観料は特に定められていません(お心づけをお納めください)。いずれも北鎌倉駅を起点に歩いて回れる距離にあります。",
        bodyEn:
          "Beyond Meigetsu-in, Kitakamakura has several other well-known spots for fall colors. Engaku-ji is open 8:30-16:30 (until 16:00 from December through February), with admission of ¥500 for high school age and up and ¥200 for elementary and junior high students; it typically peaks from late November to early December, and the reflection of the leaves in Myoko-chi pond is a popular photo spot. Kencho-ji keeps similar hours (8:30-16:30) and the same admission (¥500/¥200) - the crowds thin out the further you walk from the main gate, and the innermost Hansobo shrine is a quiet spot to enjoy the colors. Tokei-ji is open 9:00-16:00 with no set admission fee for the main hall (a small donation is customary). All three are within walking distance of Kitakamakura Station.",
      },
      {
        headingJa: "混雑を避けるコツ",
        headingEn: "Tips for Avoiding the Crowds",
        bodyJa:
          "紅葉シーズンの鎌倉は土日祝日を中心に大変混雑し、混雑のピークは午前9時〜14時頃と言われています。ゆっくり紅葉を楽しみたいなら、平日、それも開門直後の午前中がおすすめです。11月上旬や12月上旬など、ピークを少し外した時期を選ぶのも一つの方法です。当宿はセルフチェックインで到着時間の融通がきくので、朝一番の拝観に合わせて早めに出発することもできます。",
        bodyEn:
          "Kamakura gets very crowded during leaf season, especially on weekends and holidays, with the busiest hours typically between 9am and 2pm. For a calmer visit, aim for a weekday morning right after opening, or consider going slightly before or after the peak (early November or early December). Since check-in at our property is self-service, you're free to head out early for a first-thing visit without waiting around for a front desk.",
      },
      {
        headingJa: "アクセス",
        headingEn: "Access",
        bodyJa:
          "大船駅からJRで北鎌倉駅までは1駅、乗り換えなし約3分です。当宿からもアクセスしやすいので、紅葉シーズンの日帰り観光にもぴったりです。",
        bodyEn:
          "From Ofuna Station, it's just one stop on JR to Kitakamakura - about 3 minutes, no transfer needed. It's an easy trip from our property, making it a great outing during leaf season.",
      },
    ],
  },
  {
    slug: "access-guide-kamakura-enoshima",
    publishedDate: "2026-09-15",
    titleJa: "大船駅から鎌倉・江ノ島へのアクセス完全ガイド",
    titleEn: "Complete Access Guide: Ofuna to Kamakura and Enoshima",
    excerptJa:
      "大船駅を拠点に、鎌倉・江ノ島へどう向かうかをまとめました。JR・湘南モノレール・江ノ電、それぞれの所要時間とルートをご紹介します。",
    excerptEn:
      "How to get from Ofuna Station to Kamakura and Enoshima, using JR, the Shonan Monorail, and the Enoden line - with travel times for each route.",
    heroImage: "/photos/blog/enoden-kamakurakoko.jpg",
    galleryImages: [
      {
        src: "/photos/blog/shonan-monorail.jpg",
        altJa: "湘南モノレール(大船〜江の島)",
        altEn: "The Shonan Monorail (Ofuna to Enoshima)",
      },
    ],
    sections: [
      {
        headingJa: "大船駅から鎌倉駅へ(JR)",
        headingEn: "Ofuna to Kamakura Station (JR)",
        bodyJa:
          "大船駅から鎌倉駅へは、JR横須賀線・湘南新宿ラインで乗り換えなし約6分。鎌倉の中心部(鶴岡八幡宮や小町通りなど)へ向かう際は、まずこのルートが一番シンプルです。",
        bodyEn:
          "From Ofuna Station, it's about a 6-minute ride to Kamakura Station on the JR Yokosuka or Shonan-Shinjuku Line, no transfer needed. This is the simplest route if you're headed to central Kamakura - Tsurugaoka Hachimangu, Komachi-dori, and the like.",
      },
      {
        headingJa: "大船駅から江ノ島方面へ(湘南モノレール)",
        headingEn: "Ofuna to Enoshima (Shonan Monorail)",
        bodyJa:
          "大船駅から江ノ島方面へは、懸垂式(ぶら下がり式)の湘南モノレールが便利です。終点の湘南江の島駅まで約14分。車体がレールから吊り下がった状態で走る珍しい乗り物なので、乗車自体が観光の一部になります。",
        bodyEn:
          "For Enoshima, the Shonan Monorail is the way to go - a suspended monorail that hangs from the rail above, about a 14-minute ride to the last stop, Shonan-Enoshima Station. It's an unusual way to travel, so the ride itself is part of the sightseeing.",
      },
      {
        headingJa: "鎌倉駅から江ノ島へ(江ノ電)",
        headingEn: "Kamakura to Enoshima (Enoden)",
        bodyJa:
          "鎌倉駅から江ノ島駅へは、海沿いを走るローカル線・江ノ電で約25分(運賃は大人260円、12分間隔で運行)。由比ヶ浜や長谷など、鎌倉の海側の観光スポットにもこの路線でアクセスできます。途中の鎌倉高校前駅は、青い海を背景にした踏切の風景で知られ、アニメ「スラムダンク」の聖地として国内外から多くの観光客が訪れます(撮影時は交通ルールにご注意ください)。",
        bodyEn:
          "From Kamakura Station to Enoshima Station, the Enoden - a scenic local line that runs along the coast - takes about 25 minutes (adult fare ¥260, trains every 12 minutes). It also serves Kamakura's beach-side spots like Yuigahama and Hase along the way. Kamakura-Koko-mae Station, partway along the line, is known for its railway crossing with the ocean as a backdrop - a famous spot from the anime Slam Dunk that draws visitors from Japan and abroad (please follow traffic rules if you stop to take photos).",
      },
      {
        headingJa: "おすすめの周り方",
        headingEn: "A Good Way to Combine Both",
        bodyJa:
          "大船から湘南モノレールで江ノ島へ向かい、江ノ島を観光した後は江ノ電で鎌倉へ、最後にJRで大船へ戻る、というルートなら同じ道を引き返さずに一周できます。当宿は大船駅から徒歩7分なので、このルートの起点・終点としても便利です。",
        bodyEn:
          "A good loop: take the Shonan Monorail from Ofuna to Enoshima, explore Enoshima, ride the Enoden to Kamakura, then take JR back to Ofuna - no backtracking needed. Since our property is a 7-minute walk from Ofuna Station, it makes a convenient start and end point for this route.",
      },
    ],
  },
  {
    slug: "kannon-ofuna",
    publishedDate: "2026-09-10",
    titleJa: "大船の食堂「かんのん」",
    titleEn: "Kannon (かんのん): A Restaurant in Ofuna",
    excerptJa: "大船駅からほど近い、大船1-9-8にある活魚料理のお店「かんのん」をご紹介します。",
    excerptEn: "Kannon (かんのん), a fresh-fish restaurant in Ofuna near the station.",
    heroImage: "/photos/blog/kannon-ofuna-exterior.jpg",
    galleryImages: [
      {
        src: "/photos/blog/kannon-ofuna-dish.jpg",
        altJa: "かんのんの定食",
        altEn: "A set meal at Kannon",
      },
    ],
    sections: [
      {
        headingJa: "お店について",
        headingEn: "About This Restaurant",
        bodyJa:
          "「かんのん」は神奈川県鎌倉市大船1-9-8にある食堂です。お食事の際は、お電話(0467-45-1848)でのご予約・お問い合わせがおすすめです。営業時間や定休日、メニューなど最新の情報は、下記の食べログのページでご確認ください。",
        bodyEn:
          "Kannon (かんのん) is a restaurant located at 1-9-8 Ofuna, Kamakura, Kanagawa. We recommend calling ahead (0467-45-1848) for reservations or questions. For current hours, days closed, and menu details, please check its Tabelog page linked below.",
      },
      {
        headingJa: "活魚料理のお店",
        headingEn: "A Fresh Fish Restaurant",
        bodyJa:
          "店頭の看板には「活魚料理」とあり、新鮮な魚介を使った料理が中心のお店です。Googleマップのクチコミ(評価4.0、659件)では、厚切りで新鮮な刺身、特にサーモンや中トロが好評で、アジフライなどの魚料理も評価されています。手頃な価格や活気ある雰囲気、親しみやすいスタッフを挙げる声がある一方、スタッフの対応がそっけないという意見も一部見られました。",
        bodyEn:
          "The sign outside reads \"活魚料理\" (fresh/live-fish cuisine), and the restaurant centers on dishes made with fresh seafood. According to Google Maps reviews (4.0 stars, 659 reviews), guests praise the thick-cut, fresh sashimi - especially salmon and medium fatty tuna - as well as fish dishes like aji fry (fried horse mackerel). Reviewers also mention reasonable prices, a lively atmosphere, and friendly staff, though a few reviews note the staff can come across as curt.",
      },
    ],
    sourceUrl: "https://tabelog.com/kanagawa/A1404/A140401/14002799/",
    sourceLabelJa: "かんのん(食べログ)",
    sourceLabelEn: "Kannon on Tabelog",
  },
  {
    slug: "group-travel-whole-house",
    publishedDate: "2026-09-08",
    titleJa: "大人数・グループ旅行に一棟貸しがおすすめな理由",
    titleEn: "Why a Whole-House Rental Is Perfect for Group Trips",
    excerptJa:
      "友人同士や三世代旅行、合宿など、大人数での鎌倉・大船旅行なら一棟貸しの民泊がおすすめです。ホテルとの違いやKamakura Gate Innならではの魅力をご紹介します。",
    excerptEn:
      "For friend groups, multi-generation trips, or a team retreat to Kamakura and Ofuna, a whole-house rental beats splitting up across hotel rooms. Here's why - and what makes Kamakura Gate Inn a good fit.",
    heroImage: "/photos/living-2.jpg",
    sections: [
      {
        headingJa: "ホテルの「部屋を分ける」問題",
        headingEn: "The Problem with Splitting Up Hotel Rooms",
        bodyJa:
          "大人数でホテルに泊まる場合、複数の部屋に分かれて宿泊することになりがちです。せっかくみんなで旅行に来たのに、部屋に戻ると別々というのは少し寂しいもの。一棟貸しの宿なら、最後まで同じ空間で過ごせるので、旅の余韻をそのまま楽しめます。",
        bodyEn:
          "Booking a hotel for a large group usually means splitting up across several rooms. After a day out together, it's a bit of a letdown to head back to separate rooms. With a whole-house rental, everyone stays under one roof the entire time, so the trip doesn't have to end the moment you get back.",
      },
      {
        headingJa: "リビングでみんなで過ごせる時間",
        headingEn: "One Living Room, Everyone Together",
        bodyJa:
          "当宿は最大6名まで宿泊可能な一棟貸しの住宅です。大型ソファのあるリビングと65インチの大型テレビがあるので、夜は映画を見たりゲームをしたりと、ホテルの一室では難しい「みんなで過ごす時間」を作れます。キッチンも備えているので、近くのスーパーで買い出しをして、部屋で簡単な食事や飲み会を楽しむことも可能です。",
        bodyEn:
          "Our property is a whole house that sleeps up to 6 guests. The living room has a large sofa and a 65-inch TV, so evenings can turn into a movie night or game night - the kind of shared time that's hard to recreate in a single hotel room. There's also a full kitchen, so you can pick up groceries nearby and put together a casual meal or drinks together in the room.",
      },
      {
        headingJa: "気を遣わない、自分たちだけの空間",
        headingEn: "A Private Space, All to Yourselves",
        bodyJa:
          "セルフチェックインなので、フロントでのやり取りを気にせず、好きな時間に到着・出発できます。他の宿泊者とロビーや廊下で顔を合わせることもないので、大きな声で話したりパジャマのまま過ごしたりと、気兼ねなくくつろげるのも一棟貸しならではの魅力です。",
        bodyEn:
          "Check-in is self-service, so you can arrive and leave whenever suits your group without coordinating around a front desk. There's no shared lobby or hallway where you might run into other guests, so you're free to talk loudly, hang out in pajamas, and generally relax without worrying about anyone else.",
      },
      {
        headingJa: "こんな旅行におすすめ",
        headingEn: "Great for Trips Like These",
        bodyJa:
          "友人同士の旅行、三世代での家族旅行、部活やサークルの合宿、結婚式や誕生日のお祝い前泊など、様々なグループ旅行で選ばれています。鎌倉・江ノ島・横浜へのアクセスも良い大船エリアなので、観光の拠点としてもおすすめです。",
        bodyEn:
          "Guests choose our place for all kinds of group trips - a friends' getaway, a three-generation family vacation, a club or team retreat, or a night before a wedding or birthday celebration. Ofuna also has great access to Kamakura, Enoshima, and Yokohama, making it a convenient base for sightseeing too.",
      },
    ],
  },
  {
    slug: "ofuna-kannon-guide",
    publishedDate: "2026-09-08",
    titleJa: "大船観音の見どころガイド — 大船駅すぐの街のシンボル",
    titleEn: "Ofuna Kannon Guide: The Symbol of Ofuna, Steps from the Station",
    excerptJa:
      "大船駅西口から徒歩約5分。高さ25mの白衣観音像が街を見守る大船観音寺の歴史、見どころ、拝観情報をまとめました。",
    excerptEn:
      "Just a 5-minute walk from Ofuna Station's west exit: the history, highlights, and visitor info for the 25m Ofuna Kannon statue that watches over the town.",
    heroImage: "/photos/sightseeing/ofuna-kannon.jpg",
    sourceUrl: "https://oofuna-kannon.or.jp/",
    sourceLabelJa: "大船観音寺 公式サイト",
    sourceLabelEn: "Ofuna Kannon-ji official site",
    sections: [
      {
        headingJa: "大船駅からのアクセス",
        headingEn: "Getting There from Ofuna Station",
        bodyJa:
          "大船観音寺は、JR大船駅西口から徒歩約5分。南改札を出て西口方面へ進み、信号を渡ってローソンの裏手にある参道を進むと山門に到着します。参道から山門にかけては急な坂道があるので、歩きやすい靴がおすすめです。当宿からもすぐの距離なので、チェックイン前後の空き時間に立ち寄るのにぴったりです。",
        bodyEn:
          "Ofuna Kannon-ji is about a 5-minute walk from Ofuna Station's west exit. Leave through the south ticket gate, head toward the west exit, cross the signal, and follow the approach path behind the Lawson convenience store to reach the temple gate. The path has a fairly steep slope, so comfortable shoes are a good idea. It's an easy stop before or after check-in, since it's so close to our property.",
      },
      {
        headingJa: "25mの観音像 — 実は「胸像」",
        headingEn: "A 25m Statue - Actually a Bust",
        bodyJa:
          "観音様の高さは約25m。実は下半身のある立像ではなく、地上に見えている上半身だけの「胸像」です。当初は奈良の大仏の約2倍という巨大な立像として計画されましたが、建設地の地質調査で立像にすると地山が崩れる可能性があると分かり、胸像に変更された経緯があります。建設は1929年に始まりましたが、世界恐慌や戦争で工事が中断し、再開したのは1957年。実に30年近い歳月をかけて完成し、寺として正式に創建されたのは1981年(昭和56年)です。",
        bodyEn:
          "The statue stands about 25 meters tall - but it's actually a bust, showing only the upper body above ground rather than a full standing figure. It was originally planned as a full standing statue nearly twice the size of the Great Buddha of Nara, but a geological survey found the hillside risked collapsing under that weight, so the design was changed to a bust. Construction began in 1929, was interrupted by the Great Depression and wartime, and didn't resume until 1957 - taking almost 30 years in total. The temple was formally established in 1981.",
      },
      {
        headingJa: "境内の見どころ",
        headingEn: "What to See on the Grounds",
        bodyJa:
          "観音像の背中側には洞窟のような入口があり、中に入ると祭壇に祀られた観音像を間近で拝観できる「胎内拝観」ができます。子宝・安産・子どもの健やかな成長を願う参拝スポットとして親しまれています。境内にはほかにも、縁結びの木や、子育て・厄除け地蔵、平和への願いが込められた千体仏など、見どころが点在しています。桜の名所としても知られ、ソメイヨシノやオオシマザクラ、シダレザクラ、河津桜など複数の品種が植えられているので、春に訪れるのもおすすめです。",
        bodyEn:
          "Behind the statue is a cave-like entrance leading to an area where visitors can view the enshrined Kannon altar up close - a spot popular for prayers about conceiving, safe childbirth, and children's healthy growth. The grounds also have a \"matchmaking tree,\" Jizo statues for child-rearing and warding off bad luck, and a thousand small Buddha statues dedicated to peace. It's also a well-known cherry blossom spot, with several varieties - Someiyoshino, Oshima cherry, weeping cherry, and around 15 Kawazu cherry trees - making spring an especially good time to visit.",
      },
      {
        headingJa: "拝観情報",
        headingEn: "Visitor Information",
        bodyJa:
          "拝観時間は2月〜10月が9:00〜17:00、11月〜1月が9:00〜16:30。拝観料は高校生以上300円、小中学生100円、幼児は無料です(20名以上の団体は200円)。最新の情報は必ず大船観音寺の公式サイトでご確認ください。",
        bodyEn:
          "Opening hours are 9:00-17:00 from February to October, and 9:00-16:30 from November to January. Admission is ¥300 for high school age and up, ¥100 for elementary and junior high students, and free for young children (groups of 20 or more pay ¥200). Please check the temple's official website for the latest details before you go.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
