export type SightseeingArea = "kamakura" | "fujisawaEnoshima" | "yokohama";

export type SightseeingSpot = {
  name: string;
  area: SightseeingArea;
  descJa: string;
  descEn: string;
  accessJa: string;
  accessEn: string;
};

/**
 * Real nearby sightseeing spots grouped by area, with access times measured
 * from Ofuna Station (the property's nearest station). Sourced from each
 * spot's own site / transit search where possible - see the access field
 * for the specific route used.
 */
export const SIGHTSEEING_SPOTS: SightseeingSpot[] = [
  // Kamakura - Ofuna Station to Kamakura Station is ~6 min by train.
  {
    name: "大船観音寺",
    area: "kamakura",
    descJa: "高さ約25mの白衣観音像。大船駅からすぐの、街のシンボル的存在です。",
    descEn: "A 25m-tall white bodhisattva statue, the symbol of the Ofuna area - visible right from the station.",
    accessJa: "大船駅西口から徒歩5〜10分",
    accessEn: "5–10 min walk from Ofuna Station (west exit)",
  },
  {
    name: "鶴岡八幡宮",
    area: "kamakura",
    descJa: "鎌倉のシンボルとも言える神社。若宮大路の参道が有名です。",
    descEn: "Kamakura's iconic shrine, at the end of the famous Wakamiya-oji approach road.",
    accessJa: "大船駅から鎌倉駅まで電車で約6分、鎌倉駅から徒歩約10分",
    accessEn: "~6 min by train from Ofuna to Kamakura Station, then ~10 min walk",
  },
  {
    name: "高徳院(鎌倉大仏)",
    area: "kamakura",
    descJa: "国宝の鎌倉大仏で知られる寺院。",
    descEn: "Home to the Great Buddha of Kamakura, a National Treasure.",
    accessJa: "鎌倉駅から江ノ電で長谷駅(約4分)、徒歩約7分",
    accessEn: "From Kamakura Station, Enoden train to Hase Station (~4 min), then ~7 min walk",
  },
  {
    name: "由比ヶ浜",
    area: "kamakura",
    descJa: "鎌倉を代表する海水浴場。夏は賑わい、それ以外の季節も散策に人気です。",
    descEn: "Kamakura's best-known beach - lively in summer, popular for a stroll year-round.",
    accessJa: "鎌倉駅から江ノ電で由比ヶ浜駅まで約3分",
    accessEn: "~3 min by Enoden train from Kamakura Station",
  },
  {
    name: "小町通り",
    area: "kamakura",
    descJa: "食べ歩きやお土産店が並ぶ、鎌倉観光の定番ストリート。",
    descEn: "Kamakura's classic shopping street, lined with street food and souvenir shops.",
    accessJa: "鎌倉駅東口すぐ",
    accessEn: "Right by Kamakura Station's east exit",
  },
  // Fujisawa / Enoshima
  {
    name: "江島神社・江の島",
    area: "fujisawaEnoshima",
    descJa: "日本三大弁財天のひとつ。参道の仲見世通りではしらすグルメも楽しめます。",
    descEn: "One of Japan's three great Benzaiten shrines; the approach street has local shirasu (whitebait) food stalls.",
    accessJa: "大船駅から湘南モノレールで湘南江の島駅まで約14分、徒歩約16分",
    accessEn: "~14 min by Shonan Monorail from Ofuna to Shonan-Enoshima Station, then ~16 min walk",
  },
  {
    name: "江の島シーキャンドル",
    area: "fujisawaEnoshima",
    descJa: "江の島の展望灯台。晴れた日は富士山やみなとみらいまで一望できます。",
    descEn: "Enoshima's observation lighthouse - on a clear day you can see Mt. Fuji and Minato Mirai.",
    accessJa: "江の島内、江島神社から徒歩圏内",
    accessEn: "On Enoshima island, walking distance from Enoshima Shrine",
  },
  // Yokohama
  {
    name: "横浜赤レンガ倉庫・みなとみらい",
    area: "yokohama",
    descJa: "赤レンガ倉庫やランドマークタワーなど、横浜港のウォーターフロントエリア。",
    descEn: "Yokohama's waterfront district, home to the Red Brick Warehouse and Landmark Tower.",
    accessJa: "大船駅からJR東海道線で横浜駅まで約18分(乗り換えなし)、みなとみらい線へ乗り換え",
    accessEn: "~18 min direct by JR Tokaido Line from Ofuna to Yokohama Station, then transfer to the Minatomirai Line",
  },
];

export function sightseeingMapUrl(spot: SightseeingSpot): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}`;
}
