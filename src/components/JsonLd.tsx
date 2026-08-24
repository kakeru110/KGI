/**
 * Renders a JSON-LD block. Server component - the data is built during
 * rendering and never changes in the browser.
 */
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
