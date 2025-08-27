import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSeo, seoToMetadata } from '../lib/seo';

test('seoToMetadata maps basic fields', () => {
  const seo = normalizeSeo({
    seo: {
      title: 'Example',
      metaDesc: 'Desc',
      opengraphImage: { sourceUrl: '/img.jpg' },
    },
    url: '/example',
    siteName: 'Site',
    siteUrl: 'https://example.com',
  });
  const meta = seoToMetadata(seo);
  assert.equal(meta.title, 'Example');
  assert.equal(meta.description, 'Desc');
  assert.equal(meta.openGraph?.images?.[0].url, 'https://example.com/img.jpg');
});

test('normalizeSeo strips /wp prefix from URLs', () => {
  const seo = normalizeSeo({
    seo: {
      canonical: 'https://cms.example.com/wp/sample',
      opengraphUrl: 'https://cms.example.com/wp/sample',
    },
    siteUrl: 'https://example.com',
  });
  assert.equal(seo.canonical, 'https://example.com/sample');
  assert.equal(seo.og.url, 'https://example.com/sample');
});
