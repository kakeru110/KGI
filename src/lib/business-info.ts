/**
 * Real business details for the legal disclosure page (/[locale]/tokushoho),
 * required under Japan's Act on Specified Commercial Transactions (特定商取引法)
 * for any online sale with card payment.
 *
 * `address` and `phone` are intentionally NOT rendered on the page - the
 * 2022 revision to the Act lets an online-only seller withhold these and
 * instead disclose them "without delay upon request" (ご請求があれば遅滞なく開示
 * いたします), which is what /tokushoho shows instead. They're kept here
 * so whoever handles a disclosure request has the real values on hand.
 * `phone` is currently empty (no business phone line) - confirm with an
 * advisor whether email-only contact is acceptable here before launch.
 */
export const BUSINESS_INFO = {
  operatorName: "クリプトマネージ合同会社",
  representativeName: "瀬野尾翔",
  address: "東京都港区高輪4丁目21-29",
  phone: "",
  email: "cryptomanagegodo@gmail.com",
  businessPermitNumber: "M140059694",
};
