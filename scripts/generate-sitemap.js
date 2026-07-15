#!/usr/bin/env node
/**
 * sitemap.xml 생성기 — 빌드 전(prebuild) 자동 실행.
 * 정적 라우트 + RTDB의 인사이트/포트폴리오 개별 URL을 public/sitemap.xml로 출력한다.
 * postbuild.js가 이 sitemap의 URL 목록을 읽어 gh-pages용 html 사본을 만든다.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE = 'https://designluka.co.kr';
const RTDB = 'https://design-luka-default-rtdb.asia-southeast1.firebasedatabase.app';

// App.jsx 공개 라우트와 동기화할 것 (admin/debug 제외)
const STATIC_ROUTES = [
  '/',
  '/about',
  '/business',
  '/business/residential/total-living',
  '/business/residential/relite-living',
  '/business/commercial/total-biz',
  '/business/commercial/biz-consulting',
  '/portfolio',
  '/insight',
  '/contact',
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function isoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  // 한글 날짜("2025년 12월 16일 ...") 대응
  const m = String(value).match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
  return null;
}

async function main() {
  const today = new Date().toISOString().split('T')[0];
  const urls = STATIC_ROUTES.map((route) => ({ loc: BASE + route, lastmod: today }));

  try {
    const insights = await fetchJson(`${RTDB}/insights.json`);
    if (insights) {
      for (const [id, item] of Object.entries(insights)) {
        urls.push({ loc: `${BASE}/insight/${id}`, lastmod: isoDate(item.date) || today });
      }
    }
  } catch (e) {
    console.warn('sitemap: 인사이트 목록 로드 실패 — 정적 라우트만 포함:', e.message);
  }

  // NOTE: /portfolio/:id 상세 페이지는 미완성(contents 없는 프로젝트에서 크래시)이라
  // sitemap에서 제외한다. 상세 페이지 정비 후 다시 포함할 것.

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) =>
      [
        '  <url>',
        `    <loc>${u.loc}</loc>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    ),
    '</urlset>',
    '',
  ].join('\n');

  const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(out, xml);
  console.log(`sitemap: ${urls.length}개 URL → ${path.relative(process.cwd(), out)}`);
}

main().catch((e) => {
  console.error('sitemap 생성 실패:', e);
  process.exit(1);
});
