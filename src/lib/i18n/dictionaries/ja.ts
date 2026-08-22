import type { Dictionary } from "../dictionary-type";

const ja: Dictionary = {
  meta: {
    siteName: "Kamakura Gate Inn",
    title: "Kamakura Gate Inn | 大船駅徒歩7分・最大6名の一棟貸し",
    description:
      "鎌倉・湘南観光の拠点に。大船駅徒歩7分、最大6名で泊まれる58㎡のプライベートステイ、Kamakura Gate Innの公式予約サイトです。",
  },
  nav: {
    top: "トップ",
    rooms: "施設紹介",
    gallery: "写真",
    access: "アクセス",
    faq: "よくある質問",
    booking: "空室・料金を確認",
    checkAvailability: "空室・料金を確認",
  },
  hero: {
    title: "Kamakura Gate Inn",
    subtitle:
      "鎌倉・湘南観光の拠点に。大船駅徒歩7分、最大6名で泊まれる58㎡のプライベートステイ。",
  },
  statCards: {
    size: { label: "広さ", value: "58㎡" },
    guests: { label: "最大", value: "6名" },
    stationOfuna: { label: "大船駅", value: "徒歩7分" },
    stationKamakura: { label: "鎌倉駅", value: "約6分" },
    wifi: { label: "Wi-Fi", value: "約820Mbps" },
  },
  searchForm: {
    heading: "空室・料金を確認",
    checkIn: "チェックイン",
    checkOut: "チェックアウト",
    guests: "人数",
    adults: "大人",
    children: "子供",
    submit: "空室・料金を確認",
  },
  availability: {
    heading: "空室カレンダー",
    subheading: "日付ごとの空室状況と料金の目安です。満室日は選択できません。",
    legendAvailable: "空室あり",
    legendFull: "満室",
    legendClosed: "宿泊不可",
    prevMonth: "前の月",
    nextMonth: "次の月",
    weekdays: ["月", "火", "水", "木", "金", "土", "日"],
  },
  results: {
    roomFee: "宿泊料金",
    extraGuestFee: "人数追加料金",
    cleaningFee: "清掃料金",
    total: "合計",
    perNight: "1泊あたり",
    perPerson: "1人あたり",
    perPersonNote: "グループで泊まるほど、お一人あたりの料金がお得になります。",
    ctaBook: "この日程で予約する",
    unavailable: "選択された日程は予約できません。他の日程をお試しください。",
    selectDates: "チェックイン・チェックアウト・人数を選択してください。",
    disclaimer:
      "表示価格は目安です。最終的なお支払い金額はBeds24予約ページでご確認ください。",
  },
  facility: {
    heading: "施設について",
    intro:
      "大船駅から徒歩約7分、鎌倉観光の拠点に最適な一棟貸しのテラスハウスです。58㎡・1LDK＋ロフトの空間に最大6名まで宿泊でき、家族やグループでゆったりと過ごせます。",
    points: [
      "最大6名まで宿泊可能",
      "58㎡・1LDK＋ロフトの一棟貸し",
      "家族・グループ旅行に最適",
      "65インチの大型TV",
      "洗濯乾燥機完備",
      "高速Wi-Fi(約820Mbps)",
      "大船駅徒歩7分",
      "鎌倉観光へのアクセス良好",
    ],
  },
  rooms: {
    bedsHeading: "ベッド構成",
    beds: [
      { room: "1F 寝室", desc: "シングルベッド × 2" },
      { room: "ロフト", desc: "ダブル布団 × 2" },
    ],
    policiesHeading: "宿泊ルール",
    policies: [
      { label: "チェックイン", value: "15:00〜22:00" },
      { label: "チェックアウト", value: "11:00" },
      { label: "喫煙", value: "禁煙" },
      { label: "ペット", value: "不可" },
      { label: "子供", value: "宿泊可" },
    ],
  },
  amenities: {
    heading: "設備・アメニティ",
    items: [
      { label: "Wi-Fi", sub: "約820Mbps" },
      { label: "TV", sub: "65インチ" },
      { label: "洗濯乾燥機" },
      { label: "浴室乾燥" },
      { label: "エアコン", sub: "各室完備" },
      { label: "ウォシュレット" },
      { label: "キッチン" },
      { label: "大型ソファ" },
      { label: "セルフチェックイン" },
    ],
  },
  gallery: {
    heading: "フォトギャラリー",
    categories: {
      living: "リビング",
      bedroom: "ベッドルーム",
      loft: "ロフト",
      kitchen: "キッチン",
      bathroom: "バスルーム",
      exterior: "外観",
    },
    viewAll: "すべての写真を見る",
  },
  access: {
    heading: "アクセス",
    lead: "JR大船駅から徒歩約7分。鎌倉駅までは電車で約6分と、鎌倉・湘南観光の拠点に最適な立地です。",
    fromStation: "大船駅 徒歩約7分",
    note: "詳しいアクセス方法はご予約後にご案内します。",
  },
  faq: {
    heading: "よくある質問",
    items: [
      {
        q: "チェックインは何時ですか？",
        a: "15:00〜22:00です。セルフチェックインに対応しています。",
      },
      {
        q: "チェックアウトは何時ですか？",
        a: "11:00までにお願いしております。",
      },
      {
        q: "最大何名まで宿泊できますか？",
        a: "最大6名まで宿泊いただけます。基本料金は3名までで、4人目以降はお一人につき追加料金がかかります。",
      },
      {
        q: "荷物を預けることはできますか？",
        a: "施設では原則としてお荷物をお預かりできません。大船駅周辺のコインロッカーをご利用ください。",
      },
      {
        q: "駐車場はありますか？",
        a: "駐車場の有無は施設条件によります。詳細はお問い合わせください。",
      },
      {
        q: "ペットは連れて行けますか？",
        a: "ペットの同伴はご遠慮いただいております。",
      },
      {
        q: "子供と宿泊できますか？",
        a: "お子様とのご宿泊も可能です。",
      },
    ],
  },
  reviews: {
    heading: "ゲストの声",
    note: "掲載しているレビューは実際の宿泊者によるものです。",
    items: [],
  },
  footer: {
    address: "神奈川県横浜市栄区",
    poweredBy: "在庫・料金・ご予約情報はBeds24と連携しています。",
  },
  stickyCta: {
    checkAvailability: "空室を確認",
    bookNow: "予約する",
  },
  language: {
    ja: "日本語",
    en: "English",
  },
};

export default ja;
