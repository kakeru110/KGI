export const PROPERTY_ADDRESS = "神奈川県横浜市栄区笠間3-41-8 fika大船2";
export const PROPERTY_COORDS = { lat: 35.3594576, lng: 139.5306779 };

export const PROPERTY_MAP_EMBED_SRC = `https://www.google.com/maps?q=${PROPERTY_COORDS.lat},${PROPERTY_COORDS.lng}&z=17&output=embed`;
export const PROPERTY_MAP_LINK = "https://maps.app.goo.gl/nYhp4T12ZPz6KR536";

export type ParkingLot = {
  name: string;
  address: string;
  distanceMeters: number;
  priceJa: string;
  priceEn: string;
};

/**
 * Real coin-parking lots near the property, closest first. Sourced from
 * 特P's nearby-parking search (toku-p.earth-car.com) for the property's
 * coordinates, cross-checked against each operator's own listing pages.
 * Rates and availability change over time - see disclaimer on the parking page.
 */
export const NEARBY_PARKING: ParkingLot[] = [
  {
    name: "P&P大船笠間2丁目パーキング",
    address: "神奈川県横浜市栄区笠間2-16-40",
    distanceMeters: 340,
    priceJa: "日中最大1,200円 / 夜間最大300円",
    priceEn: "Daytime max ¥1,200 / Nighttime max ¥300",
  },
  {
    name: "タイムズセサミスポーツクラブ大船",
    address: "神奈川県横浜市栄区笠間2-14",
    distanceMeters: 380,
    priceJa: "24時間最大1,200円",
    priceEn: "24-hour max ¥1,200",
  },
  {
    name: "マイパーキング大船第9",
    address: "神奈川県横浜市栄区笠間1-10-8",
    distanceMeters: 440,
    priceJa: "12時間最大1,200円",
    priceEn: "12-hour max ¥1,200",
  },
  {
    name: "スペース 横浜笠間第1",
    address: "神奈川県横浜市栄区笠間3-564-1",
    distanceMeters: 450,
    priceJa: "24時間最大1,000円",
    priceEn: "24-hour max ¥1,000",
  },
  {
    name: "ショウワパーク笠間3丁目",
    address: "神奈川県横浜市栄区笠間3-2-25",
    distanceMeters: 460,
    priceJa: "日中最大1,100円 / 夜間最大400円",
    priceEn: "Daytime max ¥1,100 / Nighttime max ¥400",
  },
];

export function mapSearchUrl(lot: ParkingLot): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lot.name} ${lot.address}`)}`;
}
