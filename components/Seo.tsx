import { jsonLdScript, normalizeSeo, seoToMetadata } from '@/lib/seo';

type Props = {
  jsonLd?: object | string | null;
  prev?: string;
  next?: string;
};

export default function Seo({ jsonLd, prev, next }: Props) {
  const script = jsonLdScript(jsonLd ?? undefined);
  return (
    <>
      {prev && <link rel="prev" href={prev} />}
      {next && <link rel="next" href={next} />}
      {script && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: script }}
        />
      )}
    </>
  );
}

export { normalizeSeo, seoToMetadata };
