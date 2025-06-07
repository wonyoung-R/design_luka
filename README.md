# LUKA DESIGN - 인테리어 디자인 웹사이트

인테리어 디자인 업체를 위한 모던하고 인터랙티브한 웹사이트입니다. React와 Tailwind CSS를 사용하여 구현되었습니다.

## 주요 기능

- 반응형 디자인: 모든 디바이스에 최적화된 사용자 경험
- 인터랙티브 요소: 마이크로인터랙션, 애니메이션 등 사용자 참여도를 높이는 요소
- 공간별 브라우징: 주방, 거실, 침실 등 공간별 솔루션 탐색
- 비포/애프터 슬라이더: 인테리어 변화를 직관적으로 보여주는 비교 기능
- 프로세스 타임라인: 투명한 프로젝트 진행 과정 시각화
- 설문 형태의 상담 신청 폼: 단계별 맞춤형 상담 신청 기능

## 기술 스택

- React.js
- Tailwind CSS
- Framer Motion (애니메이션)
- React Intersection Observer
- React Lazy Load Image Component
- Headless UI
- Hero Icons

## 설치 및 실행 방법

1. 저장소 클론
```bash
git clone https://github.com/yourusername/luka-design.git
cd luka-design
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm start
```

4. 빌드
```bash
npm run build
```

## 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── Navbar.jsx        # 네비게이션 바
│   ├── Hero.jsx          # 히어로 섹션
│   ├── SpaceCategories.jsx # 공간별 카테고리
│   ├── BeforeAfter.jsx   # 비포/애프터 슬라이더
│   ├── ProcessTimeline.jsx # 프로세스 타임라인
│   ├── CaseStudies.jsx   # 케이스 스터디
│   ├── DesignerProfiles.jsx # 디자이너 프로필
│   ├── InteractiveFeatures.jsx # 인터랙티브 기능
│   ├── SurveyForm.jsx    # 설문 폼
│   ├── FloatingCTA.jsx   # 플로팅 CTA 버튼
│   └── Footer.jsx        # 푸터
├── App.jsx               # 메인 앱 컴포넌트
├── index.js              # 진입점
└── index.css             # 전역 스타일
```

## UI/UX 개선 포인트

- 사용자 중심 네비게이션: 공간별 브라우징, 플로팅 필터, 브레드크럼 등
- 시각적 스토리텔링: 비포/애프터 슬라이더, 영감 갤러리
- 신뢰 구축 요소: 투명한 프로세스 타임라인, 디자이너 프로필
- 성능 및 접근성 최적화: 스켈레톤 로딩, 프로그레시브 이미지 로딩
- 인터랙티브 요소: AR 가구 배치, 색상 팔레트 테스터
- 마이크로인터랙션: 피드백 애니메이션, 섬세한 호버 효과, 스크롤 프로그레스 바

## 라이센스

MIT

## 연락처

info@lukadesign.com 