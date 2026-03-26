const baseUrl = import.meta.env.SITE ?? 'https://fincal.id';

export async function GET() {
  const text = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap-index.xml
`;

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
