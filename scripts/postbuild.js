#!/usr/bin/env node
/**
 * gh-pages 딥링크 대응 — 빌드 후(postbuild) 자동 실행.
 * build/sitemap.xml의 각 경로에 대해 build/<경로>.html로 index.html 사본을 만든다.
 * GitHub Pages는 /insight/abc 요청을 insight/abc.html로 200 응답하므로
 * 크롤러가 404 없이 색인할 수 있다. (사본에 없는 신규 글은 404.html 트릭이 처리)
 */
const fs = require('fs');
const path = require('path');

const BUILD = path.join(__dirname, '..', 'build');
const indexHtml = fs.readFileSync(path.join(BUILD, 'index.html'));
const sitemap = fs.readFileSync(path.join(BUILD, 'sitemap.xml'), 'utf8');

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
let count = 0;

for (const loc of locs) {
  const pathname = new URL(loc).pathname;
  if (pathname === '/') continue;
  const target = path.join(BUILD, pathname.replace(/^\//, '') + '.html');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, indexHtml);
  count += 1;
}

console.log(`postbuild: 라우트 html 사본 ${count}개 생성`);
