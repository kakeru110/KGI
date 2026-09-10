export type BlogSection = {
  headingJa: string;
  headingEn: string;
  bodyJa: string;
  bodyEn: string;
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
    slug: "kannon-ofuna",
    publishedDate: "2026-09-10",
    titleJa: "大船の食堂「かんのん」",
    titleEn: "Kannon (かんのん): A Restaurant in Ofuna",
    excerptJa: "大船駅からほど近い、大船1-9-8にある食堂「かんのん」の基本情報をご紹介します。",
    excerptEn: "Basic information about Kannon (かんのん), a restaurant in Ofuna near the station.",
    sections: [
      {
        headingJa: "お店について",
        headingEn: "About This Restaurant",
        bodyJa:
          "「かんのん」は神奈川県鎌倉市大船1-9-8にある食堂です。お食事の際は、お電話(0467-45-1848)でのご予約・お問い合わせがおすすめです。営業時間や定休日、メニューなど最新の情報は、下記の食べログのページでご確認ください。",
        bodyEn:
          "Kannon (かんのん) is a restaurant located at 1-9-8 Ofuna, Kamakura, Kanagawa. We recommend calling ahead (0467-45-1848) for reservations or questions. For current hours, days closed, and menu details, please check its Tabelog page linked below.",
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
