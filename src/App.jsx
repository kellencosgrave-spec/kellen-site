import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/* =========================================================
   1) Site data
   ========================================================= */
const SITE = {
  name: "Kellen Cosgrave",
  email: "kellencosgrave@gmail.com",
  ig: "https://instagram.com/kellencosgrave",
};
// Language cycle order + human-readable names
const LANG_ORDER = ["es", "fr", "zh", "ar", "ru", "en"];
const LANG_NAMES = {
  es: "Español",
  fr: "Français",
  zh: "中文",
  ar: "العربية",
  ru: "Русский",
  en: "English",
};

// Translations for the Info paragraph (+ "more")
const INFO_I18N = {
  en: {
    para:
      "Kellen Cosgrave is a New York–based creative director and designer. His work sits at the intersection of fashion and music culture, pairing cinematic portraiture with a tactile, analog sensibility. Kellen studied marketing and business policy at Syracuse University, where he was also the editor-in-chief of SU's national award–winning fashion publication—ZIPPED Magazine (2023, 2024, 2025).",
    more:
      "Since launching his freelance practice in 2019, Kellen has partnered with artists and brands across creative direction, branding & identity, graphic design, UX/UI, photography, copywriting, styling, positioning, and AI integration. Frequent collaborators include The Alchemist, Local Hoops, Western Hydrodynamic Research, Leisure, and Annabelle Chairlegs."
  },
  es: {
    para:
      "Kellen Cosgrave es un director creativo y diseñador con base en Nueva York. Su trabajo se sitúa en la intersección de la moda y la cultura musical, combinando el retrato cinematográfico con una sensibilidad táctil y analógica. Kellen estudió marketing y políticas empresariales en la Universidad de Syracuse, donde también fue editor en jefe de la publicación de moda de SU, galardonada a nivel nacional—ZIPPED Magazine (2023, 2024, 2025).",
    more:
      "Desde que lanzó su práctica independiente en 2019, Kellen ha colaborado con artistas y marcas en dirección creativa, branding e identidad, diseño gráfico, UX/UI, fotografía, redacción, estilismo, posicionamiento e integración de IA. Entre sus colaboradores frecuentes se encuentran The Alchemist, Local Hoops, Western Hydrodynamic Research, Leisure y Annabelle Chairlegs."
  },
  fr: {
    para:
      "Kellen Cosgrave est un directeur de création et designer basé à New York. Son travail se situe à l’intersection de la mode et de la culture musicale, alliant portrait cinématographique à une sensibilité tactile et analogique. Kellen a étudié le marketing et la stratégie d’entreprise à l’Université de Syracuse, où il a également été rédacteur en chef du magazine de mode primé au niveau national de l’université—ZIPPED Magazine (2023, 2024, 2025).",
    more:
      "Depuis le lancement de son activité indépendante en 2019, Kellen a collaboré avec des artistes et des marques sur la direction créative, l’identité de marque, le design graphique, l’UX/UI, la photographie, la rédaction, le stylisme, le positionnement et l’intégration de l’IA. Parmi ses collaborateurs réguliers figurent The Alchemist, Local Hoops, Western Hydrodynamic Research, Leisure et Annabelle Chairlegs."
  },
  zh: {
    para:
      "凯伦·科斯格雷夫（Kellen Cosgrave）是一位常驻纽约的创意总监与设计师。他的创作位于时尚与音乐文化的交汇处，将电影式的人像与具触感的模拟审美相结合。Kellen 在雪城大学学习市场营销与商业政策，同时担任该校全国获奖时尚刊物 ZIPPED Magazine（2023、2024、2025）的主编。",
    more:
      "自 2019 年开启自由职业以来，他与众多艺术家与品牌合作，涉及创意指导、品牌与身份、平面设计、UX/UI、摄影、文案、造型、定位以及人工智能集成等领域。长期合作伙伴包括 The Alchemist、Local Hoops、Western Hydrodynamic Research、Leisure 和 Annabelle Chairlegs。"
  },
  ar: {
    para:
      "كيلن كوسغريف مدير إبداعي ومصمّم مقيم في نيويورك. يقع عمله عند تقاطع الموضة وثقافة الموسيقى، جامعًا بين بورتريه سينمائي وحسّ لمسيّ تناظري. درس كيلن التسويق وسياسات الأعمال في جامعة سيراكيوز، حيث شغل أيضًا منصب رئيس التحرير لمجلّة الموضة الحائزة على جوائز وطنية — ZIPPED Magazine (2023، 2024، 2025).",
    more:
      "منذ إطلاق عمله الحر عام 2019، تعاون كيلن مع فنانين وعلامات تجارية في الإخراج الإبداعي، والهوية والعلامة، والتصميم الغرافيكي، وتجربة/واجهة المستخدم، والتصوير، وكتابة المحتوى، والستايلينغ، والتموضع، ودمج تقنيات الذكاء الاصطناعي. من المتعاونين الدائمين: The Alchemist وLocal Hoops وWestern Hydrodynamic Research وLeisure وAnnabelle Chairlegs."
  },
  ru: {
    para:
      "Келлен Косгрейв — креативный директор и дизайнер из Нью-Йорка. Его работа находится на пересечении моды и музыкальной культуры, объединяя кинематографический портрет с тактильной, аналоговой чувствительностью. Келлен изучал маркетинг и бизнес-политику в Сиракьюзском университете, где также был главным редактором отмеченного национальными наградами модного издания — ZIPPED Magazine (2023, 2024, 2025).",
    more:
      "С 2019 года он сотрудничает с артистами и брендами в сферах креативной стратегии, брендинга и айдентики, графического дизайна, UX/UI, фотографии, копирайтинга, стайлинга, позиционирования и интеграции ИИ. Среди постоянных партнёров — The Alchemist, Local Hoops, Western Hydrodynamic Research, Leisure и Annabelle Chairlegs."
  }
};


// Hero video (light is default)
const HERO = {
  light: { src: "webland-light.mp4", poster: "hero_light.jpg" },
  dark:  { src: "webland3.mp4",      poster: "hero_poster.jpg" },
};

// helper to build sequential file names: prefix_001.jpg ... prefix_0NN.jpg
const seq = (count, pad = 3, base = "work/zipped/zipped_", ext = ".jpg") =>
  Array.from({ length: count }, (_, i) => `${base}${String(i + 1).padStart(pad, "0")}${ext}`);

const WORKS = [
  {
    slug: "night-vision",
    title: "Night Vision",
    caption:
      "ZIPPED Magazine’s Night Vision edition fuses contemporary streetwear with nostalgic hip-hop culture through analog media, candid street photography, and a fast-paced editorial rhythm. The release extended beyond print via live music events, exclusive merchandise, and VHS behind-the-scenes pieces. Directed, designed, and assembled by Kellen Cosgrave (2024).",
    pdf: "/pdfs/night-vision.pdf",
    media: seq(41, 3, "work/night-vision/night-vision_", ".jpg"),
    thumb: "work/night-vision/night-vision_001.jpg",
  },
  {
    slug: "spaces",
    title: "Spaces",
    caption:
      "ZIPPED Magazine’s Spaces edition explores the return of mid-century silhouettes, textures, and imagery to contemporary fashion. This issue focuses on tactility, timelessness, craft, and how these motifs are being reintegrated by designers and desired by consumers today. Directed, designed, and assembled by Kellen Cosgrave (2025).",
    pdf: "/pdfs/spaces.pdf",
    media: seq(21, 3, "work/spaces/spaces_", ".jpg"),
    thumb: "work/spaces/spaces_001.jpg",
  },
  // Videos live as their own page:
  { slug: "videos", title: "Videos", caption: "", media: [], thumb: "videos/posters/cars.jpg" },
  {
    slug: "the-alchemist",
    title: "The Alchemist",
    caption:
      "Poster series commissioned by The Alchemist to promote The Great Escape, his collaborative album with Larry June. Designed by Kellen Cosgrave (2023).",
    media: seq(5, 3, "work/the-alchemist/the-alchemist_", ".jpg"),
    thumb: "work/the-alchemist/the-alchemist_001.jpg",
  },
  {
    slug: "metro-boomin",
    title: "Metro Boomin",
    caption:
      "Poster series for Metro Boomin & Future’s live show at the Great Pyramids of Giza. Designed by Kellen Cosgrave (2024).",
    media: seq(5, 3, "work/metro-boomin/metro-boomin_", ".jpg"),
    thumb: "work/metro-boomin/metro-boomin_001.jpg",
  },
  {
    slug: "the-cure",
    title: "The Cure",
    caption:
      "Poster series commissioned by The Cure to mark the 30th anniversary of Wish. Designed by Kellen Cosgrave (2022).",
    media: seq(4, 3, "work/the-cure/the-cure_", ".jpg"),
    thumb: "work/the-cure/the-cure_001.jpg",
  },
  {
    slug: "westside-gunn",
    title: "Westside Gunn",
    caption:
      "Tour merchandise and posters commissioned by Westside Gunn for the promotion of his studio album And Then You Pray For Me. Designed by Kellen Cosgrave (2023).",
    media: seq(6, 3, "work/westside-gunn/westside-gunn_", ".jpg"),
    thumb: "work/westside-gunn/westside-gunn_001.jpg",
  },
  {
    slug: "advisory-board-crystals",
    title: "Advisory Board Crystals",
    caption:
      "A cross-promotional campaign with Advisory Board Crystals that merges ZIPPED’s dark, analog ethos with ABC’s surreal, organic youthfulness.",
    media: seq(11, 3, "work/advisory-board-crystals/advisory-board-crystals_", ".jpg"),
    thumb: "work/advisory-board-crystals/advisory-board-crystals_001.jpg",
  },
  {
    slug: "nv-clothing",
    title: "NV Clothing",
    caption:
      "Merchandise developed for ZIPPED’s Night Vision edition, screen-printed live at ZIPPED events to extend the publication into physical space.",
    media: seq(15, 3, "work/nv-clothing/nv-clothing_", ".jpg"),
    thumb: "work/nv-clothing/nv-clothing_001.jpg",
  },
  {
    slug: "nine-jungles",
    title: "Nine Jungles",
    caption:
      "An experimental creative studio dedicated to activating and branding young artists through campaigns, design, and events—blending underground fashion and music culture with industrial surrealism. Founded and directed by Kellen Cosgrave (2025).",
    media: seq(20, 3, "work/nine-jungles/nine-jungles_", ".jpg"),
    thumb: "work/nine-jungles/nine-jungles_001.jpg",
  },
  {
    slug: "zipped",
    title: "ZIPPED",
    caption:
      "A suite of graphics, social posts, and ephemera designed to promote ZIPPED Magazine’s Night Vision edition. Designed by Kellen Cosgrave (2024).",
    media: seq(27, 3, "work/zipped/zipped_", ".jpg"),
    thumb: "work/zipped/zipped_001.jpg",
  },
];

const VIDEOS = [
  { slug: "cars",             src: "videos/cars.mov",             poster: "/videos/posters/cars.jpg",             title: "Car Shoot",       subtitle: "ZIPPED Magazine" },
  { slug: "corner-store-2",   src: "videos/corner-store-2.mov",   poster: "/videos/posters/corner-store-2.jpg",   title: "Corner Store 2",  subtitle: "ZIPPED Magazine" },
  { slug: "corner-store",     src: "videos/corner-store.mov",     poster: "/videos/posters/corner-store.jpg",     title: "Corner Store",    subtitle: "ZIPPED Magazine" },
  { slug: "latex-trailer-1",  src: "videos/latex-trailer-1.mov",  poster: "/videos/posters/latex-trailer-1.jpg",  title: "Latex Trailer 1", subtitle: "ZIPPED Magazine" },
  { slug: "latex-trailer-2",  src: "videos/latex-trailer-2.mov",  poster: "/videos/posters/latex-trailer-2.jpg",  title: "Latex Trailer 2", subtitle: "ZIPPED Magazine" },
  { slug: "laundromat",       src: "videos/laundromat.mov",       poster: "/videos/posters/laundromat.jpg",       title: "Laundromat",      subtitle: "ZIPPED Magazine" },
];

// Optional custom line under each archive image
const ARCHIVE_SUBTITLES = {
  "archive-001": "Jenny Lake — shot on Portra 400 film",
  "archive-002": "Old Faithful — shot on Portra 400 film",
  "archive-003": "Grand Prismatic Spring — shot on Portra 400 film",
  "archive-004": "Grand Prismatic Spring — shot on Portra 400 film",
  "archive-005": "Dogs at gas station — shot on Portra 400 film",
  "archive-006": "Virginia Falls Trail — shot on Portra 400 film",
  "archive-007": "Virginia Falls Trail — shot on Portra 400 film",
  "archive-008": "Flathead Lake sunset — shot on Portra 400 film",
  "archive-009": "School desks — shot on Portra 400 film",
  "archive-010": "Used hardware shop — shot on Portra 400 film",
  "archive-011": "Carmel beach — shot on Portra 400 film",
  "archive-012": "Roadside Mercedes — shot on Portra 400 film",
  "archive-013": "Santa Barbara Pier — shot on Portra 400 film",
  "archive-014": "Old VW bus — shot on Portra 400 film",
  "archive-015": "Blue hour amphitheater — shot on Portra 400 film",
  "archive-016": "Lone Joshua Tree — shot on Portra 400 film",
  "archive-017": "Desert gas pump — shot on Portra 400 film",
  "archive-018": "Cacti barrels — shot on Portra 400 film",
  "archive-019": "Car part sculpture — shot on Portra 400 film",
  "archive-020": "Lunch trays — shot on Portra 400 film",
  "archive-021": "Newspaper & plaster — shot on Portra 400 film",
  "archive-022": "Toilet archway — shot on Portra 400 film",
  "archive-023": "Metal window — shot on Portra 400 film",
  "archive-024": "Metallic sculpture — shot on Portra 400 film",
  "archive-025": "TV's — shot on Portra 400 film",
  "archive-026": "Prickly pear cactus — shot on Portra 400 film",
  "archive-027": "Pastel bus — shot on Portra 400 film",
  "archive-028": "Virgin plateau — shot on Portra 400 film",
  "archive-029": "Jumbo Rocks — shot on Portra 400 film",
  "archive-030": "Oregon Coast trail — shot on Portra 400 film",
  "archive-031": "Retired chair — shot on Portra 400 film",
  "archive-032": "Boat tour — shot on Portra 400 film",
  "archive-033": "Grand Prismatic Spring — shot on Portra 400 film",
  "archive-034": "Pastel bus — shot on Portra 400 film",
  "archive-035": "Beachfront bocce — shot on Portra 400 film",
  "archive-036": "Pike Place pigeon — shot on Portra 400 film",
};

const ARCHIVE = Array.from({ length: 36 }, (_, i) => {
  const n = String(i + 1).padStart(3, "0");
  const captions = [
    "Grand Tetons, Wyoming","Yellowstone, Wyoming","Yellowstone, Wyoming","Yellowstone, Wyoming",
    "Helena, Montana","Glacier, Montana","Glacier, Montana","Glacier, Montana",
    "Portland, Oregon","Portland, Oregon","Carmel, California","Santa Cruz, California",
    "Santa Barbara, California","San Clemente, California","Joshua Tree, California",
    "Joshua Tree, California","Joshua Tree, California","Joshua Tree, California",
    "Joshua Tree, California","Joshua Tree, California","Joshua Tree, California",
    "Joshua Tree, California","Joshua Tree, California","Joshua Tree, California",
    "Joshua Tree, California","Joshua Tree, California","Joshua Tree, California",
    "Zion, Utah","Joshua Tree, California","Oregon Coast, Oregon","Joshua Tree, California",
    "Glacier, Montana","Yellowstone, Wyoming","Joshua Tree, California",
    "San Clemente, California","Seattle, Washington",
  ];
  const slug = `archive-${n}`;
  return {
    slug,
    src: `archive/archive_${n}.jpg`,
    title: `Archive ${n}`,               // label
    caption: captions[i] || "",          // location (top line)
    subtitle: ARCHIVE_SUBTITLES[slug] ?? `Archive ${n}`,  // bottom line
  };
});

const SOUNDS = [
  { id: "t01", title: "Seven Seals Of Affirmation - Dean Blunt", src: "/audio/track_01.mp3" },
  { id: "t02", title: "Should be! - MIKE", src: "/audio/track_02.mp3" },
  { id: "t03", title: "Cement Shoes - DJ Spanish Fly", src: "/audio/track_03.mp3" },
  { id: "t04", title: "Ups And Downs - Madlib", src: "/audio/track_04.mp3" },
  { id: "t05", title: "Satellite Anthem Icarus - Boards of Canada", src: "/audio/track_05.mp3" },
  { id: "t06", title: "Drifting On Power - Cities Aviv", src: "/audio/track_06.mp3" },
  { id: "t07", title: "Rhodes, 3AM - Hokuto Sato", src: "/audio/track_07.mp3" },  
  { id: "t08", title: "Tourmaline (instrumental) - Earl Sweatshirt", src: "/audio/track_08.mp3" },
  { id: "t09", title: "Summer Gypsy - Nujabes", src: "/audio/track_09.mp3" },
  { id: "t10", title: "Oh My Babe - Park Hye Jin", src: "/audio/track_10.mp3" },
  { id: "t11", title: "Alvar Aalto - Kurtiss", src: "/audio/track_11.mp3" },
  { id: "t12", title: "Air - Yakkle", src: "/audio/track_12.mp3" },
  { id: "t13", title: "Shutyomouth - DJibouti", src: "/audio/track_13.mp3" },  
  { id: "t14", title: "the absence - _BY.ALEXANDER", src: "/audio/track_14.mp3" },
  { id: "t15", title: "Ocean Sounds - The Alchemist", src: "/audio/track_15.mp3" },
  { id: "t16", title: "Mermaid - Sade", src: "/audio/track_16.mp3" },
  { id: "t17", title: "Red Tops - Camoflauge Monk", src: "/audio/track_17.mp3" },
  { id: "t18", title: "pain 1 - dj blackpower", src: "/audio/track_18.mp3" },
];

// Global playlist for "Sounds" (put your mp3/wav in /public/audio)
const TRACKS = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i + 1}`,
  title: `Untitled ${String(i + 1).padStart(2, "0")}`,
  src: `/audio/untitled-${String(i + 1).padStart(2, "0")}.mp3`,
}));

/* =========================================================
   2) Tiny hash router
   ========================================================= */
const useHashRoute = () => {
  const get = () =>
    typeof window !== "undefined" ? window.location.hash.slice(1) || "home" : "home";
  const [route, setRoute] = useState(get());
  useEffect(() => {
    const onHash = () => setRoute(get());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (r) => (window.location.hash = r);
  const parts = route.split("/").filter(Boolean); // [page, slug?, subslug?]
  return { route, parts, navigate };
};

/* =========================================================
   3) Theme toggle (sun/moon)
   ========================================================= */
function ThemeToggle({ theme, setTheme }) {
  return (
    <div className="theme-chooser" role="group" aria-label="Theme">
      {/* Sun = Light */}
      <button
        type="button"
        title="Light"
        aria-pressed={theme === "light"}
        className={`icon-btn ${theme === "light" ? "active" : ""}`}
        onClick={() => setTheme("light")}
      >
        <svg viewBox="0 0 24 24" className="icon">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
            <line x1="12" y1="1"  x2="12" y2="4"  />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="1"  y1="12" x2="4"  y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="4.22"  x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22" />
          </g>
        </svg>
      </button>

      {/* Moon = Dark */}
      <button
        type="button"
        title="Dark"
        aria-pressed={theme === "dark"}
        className={`icon-btn ${theme === "dark" ? "active" : ""}`}
        onClick={() => setTheme("dark")}
      >
        <svg viewBox="0 0 24 24" className="icon">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

/* =========================================================
   4) Header (Work overlay + Sounds overlay + mini player)
   ========================================================= */
function Header({
  current, navigate,
  theme, setTheme,
  soundOpen, setSoundOpen,
  isPlaying, togglePlay,
  tracks, playTrack, trackIdx,
}) {
  const [workOpen, setWorkOpen] = useState(false);
  const [hoverSlug, setHoverSlug] = useState(WORKS[0]?.slug || null);

  const hoveredWork = WORKS.find(w => w.slug === hoverSlug) || WORKS[0];

  // ESC closes Sounds overlay (audio keeps playing)
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") setSoundOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSoundOpen]);

  return (
    <header className="site-header" onMouseLeave={() => setWorkOpen(false)}>
      <div className="ticks" />
      <div className="container row">
        <nav className="nav">
          <a onClick={() => navigate("home")}>Kellen Cosgrave</a>

          <button
            className={current === "work" ? "active" : ""}
            onMouseEnter={() => setWorkOpen(true)}
            onClick={() => navigate("work/night-vision")}
          >
            Work
          </button>

          <a className={current === "archive" ? "active" : ""} onClick={() => navigate("archive")}>
            Archive
          </a>

          <a className={current === "info" ? "active" : ""} onClick={() => navigate("info")}>
            Info
          </a>

          {/* Sounds cell: text + play/pause button */}
          <div className="sounds-cell">
            <button
              className={(current === "sounds" || soundOpen) ? "active" : ""}
              onClick={() => setSoundOpen(v => !v)}
              aria-expanded={soundOpen}
              aria-controls="sound-overlay"
            >
              Sounds
            </button>

            <button className="sound-pp" aria-label={isPlaying ? "Pause" : "Play"} onClick={togglePlay}>
              {isPlaying ? "❚❚" : "►"}
            </button>

          </div>
        </nav>
      </div>

      {/* Work overlay (hover) */}
      <div className={`work-overlay ${workOpen ? "open" : ""}`} onMouseEnter={() => setWorkOpen(true)}>
        <div className="sheet">
          <div className="container inner">
            <div className="work-thumb">
              {hoveredWork?.thumb ? <img src={hoveredWork.thumb} alt="" /> : null}
            </div>
            <div className="work-list">
              {WORKS.filter(w => w.slug !== "videos").map((w) => (
                <div
                  key={w.slug}
                  className="work-item"
                  onMouseEnter={() => setHoverSlug(w.slug)}
                  onClick={() => { setWorkOpen(false); navigate(`work/${w.slug}`); }}
                >
                  {w.title}
                </div>
              ))}
              <div
                className="work-item"
                onMouseEnter={() => setHoverSlug("videos")}
                onClick={() => { setWorkOpen(false); navigate(`work/videos`); }}
              >
                Videos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sounds overlay (click outside closes) */}
      <div
        id="sound-overlay"
        className={`sound-overlay ${soundOpen ? "open" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseLeave={() => setSoundOpen(false)}
      >
        <div className="sheet" onMouseDown={(e) => e.stopPropagation()}>
          <div className="container inner">
            <div className="disc-grid">
              {SOUNDS.map((t, i) => (
                <button
                  key={t.title + i}
                  className={`disc ${trackIdx === i ? "active" : ""}`}
                  onClick={() => playTrack(i)}
                >
                  <svg viewBox="0 0 100 100" className="disc-svg" aria-hidden="true">
                    <defs>
                      <radialGradient id={`g${i}`} cx="50%" cy="50%">
                        <stop offset="0%"   stopColor="#eee"/>
                        <stop offset="100%" stopColor="#c2c6cc"/>
                      </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill={`url(#g${i})`} stroke="currentColor" strokeWidth="0.6"/>
                    <circle cx="50" cy="50" r="7"  fill="var(--bg)" stroke="currentColor" strokeWidth="0.6"/>
                  </svg>
                  <div className="disc-title">{t.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   5) Pages
   ========================================================= */
function Home({ theme, setTheme }) {
  const lightRef = React.useRef(null);
  const darkRef  = React.useRef(null);

  React.useEffect(() => {
    [lightRef.current, darkRef.current].forEach(v => {
      if (!v) return;
      v.preload = "auto";
      const tryPlay = () => v.play().catch(()=>{});
      v.addEventListener("canplay", tryPlay, { once:true });
      tryPlay();
    });
  }, []);

  const showLight = theme !== "dark";

  return (
    <div className="container" style={{ paddingTop: 36 }}>
      {/* fixed-height box prevents any vertical jump */}
      <div className="hero-wrap">
        <video
          ref={lightRef}
          className="hero-video"
          src="/webland-light.mp4"
          poster="/hero_light.jpg"
          playsInline muted autoPlay loop
          style={{ opacity: showLight ? 1 : 0 }}
        />
        <video
          ref={darkRef}
          className="hero-video"
          src="/webland3.mp4"
          poster="/hero_poster.jpg"
          playsInline muted autoPlay loop
          style={{ opacity: showLight ? 0 : 1 }}
        />
      </div>

      {/* stays below; no more “jump to center” */}
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </div>
  );
}



function VideosGrid({ navigate }) {
  const supportsHover =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onEnter = (e) => {
    if (!supportsHover) return;
    const v = e.currentTarget;
    v.muted = true;
    try { v.currentTime = 0; v.play().catch(()=>{}); } catch {}
  };
  const onLeave = (e) => {
    const v = e.currentTarget;
    try { v.pause(); v.currentTime = 0; } catch {}
  };

  return (
    <div className="container">
      <div className="grid videos" style={{ marginTop: 24 }}>
        {VIDEOS.map((v) => (
          <div className="card video-card" key={v.slug}>
            <div
              className="video-frame"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`work/videos/${v.slug}`)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`work/videos/${v.slug}`)}
            >
              <video
                src={v.src}
                poster={v.poster}
                preload="metadata"
                playsInline
                muted
                controls={false}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              />
            </div>

            <div className="video-meta">
              <div className="video-title">{v.title}</div>
              {v.subtitle && <div className="video-subtitle">{v.subtitle}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoView({ vidSlug, navigate }) {
  const findIndex = (slug) => VIDEOS.findIndex(v => v.slug === slug);
  const initial = findIndex(vidSlug);
  const [idx, setIdx] = useState(initial >= 0 ? initial : 0);

  useEffect(() => {
    const i = findIndex(vidSlug);
    setIdx(i >= 0 ? i : 0);
  }, [vidSlug]);

  const prev = () => setIdx(i => {
    const ni = (i - 1 + VIDEOS.length) % VIDEOS.length;
    navigate(`work/videos/${VIDEOS[ni].slug}`);
    return ni;
  });

  const next = () => setIdx(i => {
    const ni = (i + 1) % VIDEOS.length;
    navigate(`work/videos/${VIDEOS[ni].slug}`);
    return ni;
  });

  // Arrow keys only
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") navigate("work/videos");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const v = VIDEOS[idx];

  return (
    <div className="container">
      <div className="slide-wrap">
        <figure className="slide">
          <div className="slide-viewport">
            <video
              key={v.slug}
              src={v.src}
              poster={v.poster}
              playsInline
              controls
              autoPlay
            />
          </div>
        </figure>

        <div className="title">{v.title}</div>
        {v.subtitle && <div className="counter">{v.subtitle}</div>}
      </div>
    </div>
  );
}


function Project({ slug }) {
  const work = WORKS.find((w) => w.slug === slug);
  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [slug]);

  if (!work) {
    return <div className="container" style={{ paddingTop: 40 }}>Not found.</div>;
  }

  const total = work.media.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [total]);

  return (
    <div className="container">
      <div className="slide-wrap">
        <figure className="slide click-zones">
          {total > 0 ? (
            <>
              <div className="slide-viewport">
                <img src={work.media[idx]} alt={`${work.title} ${idx + 1}/${total}`} />
              </div>
              <button aria-label="Previous" onClick={prev} style={{ left: 0 }} />
              <button aria-label="Next" onClick={next} style={{ right: 0 }} />
            </>
          ) : (
            <div style={{ aspectRatio: '3/2', background: '#f3f4f6' }} />
          )}
        </figure>

        <div className="counter">{total ? `${idx + 1} / ${total}` : ""}</div>
        <div className="title">{work.title}</div>

        {work.caption && (
          <p className="caption">
            {work.caption}
            {work.pdf ? (<> <a href={work.pdf} target="_blank" rel="noopener noreferrer" className="pdf-link">click here for full magazine pdf</a></>) : null}
          </p>
        )}
      </div>
    </div>
  );
}

function ArchiveGrid({ navigate }) {
  return (
    <div className="container" style={{ marginTop: 24 }}>
      <div className="grid archive">
        {ARCHIVE.map((item) => (
          <button
            key={item.slug}
            className="card archive-cell"
            onClick={() => navigate(`archive/${item.slug}`)}
            aria-label={`Open ${item.title}`}
            style={{ aspectRatio: "3/4", padding: 0, border: 0, background: "transparent", cursor: "zoom-in" }}
          >
            <img src={item.src} alt={item.caption || item.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div className="archive-overlay"><div className="archive-overlay-label">{item.caption}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ArchiveView({ aSlug, navigate }) {
  const findIndex = (slug) => ARCHIVE.findIndex((a) => a.slug === slug);
  const [idx, setIdx] = useState(Math.max(0, findIndex(aSlug)));

  useEffect(() => { const i = findIndex(aSlug); if (i !== -1) setIdx(i); }, [aSlug]);

  const prev = () => setIdx((i) => { const ni = (i - 1 + ARCHIVE.length) % ARCHIVE.length; navigate(`archive/${ARCHIVE[ni].slug}`); return ni; });
  const next = () => setIdx((i) => { const ni = (i + 1) % ARCHIVE.length; navigate(`archive/${ARCHIVE[ni].slug}`); return ni; });

  useEffect(() => {
    const onKey = (e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); if (e.key === "Escape") navigate("archive"); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const a = ARCHIVE[idx];

  return (
    <div className="container">
      <div className="slide-wrap">
        <figure className="slide click-zones">
          <div className="slide-viewport"><img key={a.slug} src={a.src} alt={a.caption || a.title} /></div>
          <button aria-label="Previous" onClick={prev} style={{ left: 0 }} />
          <button aria-label="Next" onClick={next} style={{ right: 0 }} />
        </figure>

        {/* Top line = location */}
        <div className="title">{a.caption || a.title}</div>
        {/* Bottom line = label/custom subtitle */}
        <div className="counter">{a.subtitle ?? a.title}</div>
      </div>
    </div>
  );
}


function Info() {
  // language + expand state
  const [lang, setLang] = useState("en");
  const [expanded, setExpanded] = useState(false);

  // rotate through languages on logo click
  const cycleLang = () => {
    const idx = LANG_ORDER.indexOf(lang);
    const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
    setLang(next);
  };

  const data = INFO_I18N[lang] || INFO_I18N.en;
  const hasMore = !!(data.more && data.more.trim().length);

  return (
    <section className="info-page">
      <div className="info-container">
        <p className="info-body">
          {data.para}
          {expanded && hasMore ? " " + data.more : ""}
        </p>

        {hasMore && (
          <button
            type="button"
            className="info-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded(v => !v)}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}

        <div className="info-contacts">
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
          Instagram: <a href={SITE.ig} target="_blank" rel="noreferrer">@kellencosgrave</a>
        </div>

        {/* logo button that cycles language */}
        <button
          type="button"
          className="info-logo-ghost"
          onClick={cycleLang}
          aria-label="Change language"
          title="Change language"
        >
          <img src="/logo.svg" alt="" className="info-logo" />
        </button>
      </div>
    </section>
  );
}

function ComingSoon() {
  return <div className="container" style={{ marginTop: 40, color: 'var(--muted)' }}>Coming soon.</div>;
}

/* =========================================================
   Intro (overlay animation)  ——— paste above export default App
   ========================================================= */
function Intro({ onDone, navLeft = "Kellen Cosgrave", navRight = "Creative Works" }) {
  // match your CSS timing: line draws (1.1s), slight hold, then slide/fade out (~0.6s)
  useEffect(() => {
    const total = 1700; // safe overall window before we call onDone (adjust to taste)
    const t = setTimeout(() => onDone?.(), total);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="intro" role="presentation" aria-hidden="true">
      <div className="intro-inner">
        <div className="intro-ticks" />
        <div className="intro-row">
          <div>{navLeft}</div>
          <div>{navRight}</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   6) App shell
   ========================================================= */
export default function App(){
  const { parts, navigate } = useHashRoute();
  const [page, slug] = parts.length ? parts : ["home", null];

  // THEME (persisted, light default)
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // SOUNDS (global audio)
  const audioRef = useRef(null);
  const [soundOpen, setSoundOpen] = useState(false);
  const [trackIdx, setTrackIdx] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  const playTrack = async (i) => {
    const a = audioRef.current;
    if (!a) return;

    // same disc toggles play/pause
    if (trackIdx === i && a.src) {
      if (a.paused) { try { await a.play(); } catch {} }
      else { a.pause(); }
      return;
    }

    setTrackIdx(i);
    a.src = SOUNDS[i].src;
    a.currentTime = 0;

    try { await a.play(); } catch {}
  };

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;

    // if nothing selected yet, default to the first (or current) track
    if (!a.src) {
      const i = trackIdx ?? 0;
      setTrackIdx(i);
      a.src = SOUNDS[i].src;
    }

    if (a.paused) { try { await a.play(); } catch {} }
    else { a.pause(); }
  };

  // close Sounds overlay with ESC (audio keeps playing)
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSoundOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const current = useMemo(() => (page === "work" && slug ? "work" : page), [page, slug]);

  const Page = useMemo(() => {
    if (page === "home") return <Home theme={theme} setTheme={setTheme} />;
    if (page === "archive") {
      const aSlug = parts[1] ?? null;
      return aSlug ? <ArchiveView aSlug={aSlug} navigate={navigate} /> : <ArchiveGrid navigate={navigate} />;
    }
    if (page === "info") return <Info />;
    if (page === "sounds") return <ComingSoon />;

    if (page === "work" && slug === "videos") {
      const vidSlug = parts[2] ?? null;
      return vidSlug ? <VideoView vidSlug={vidSlug} navigate={navigate} /> : <VideosGrid navigate={navigate} />;
    }
    if (page === "work" && slug) return <Project slug={slug} />;

    return <Home theme={theme} setTheme={setTheme} />;
  }, [page, slug, parts, navigate, theme]);

  /* ===== JSX #3 — intro state + effect (A) ===== */
  const [showIntro, setShowIntro] = useState(() => {
    // play on hard refresh / first load on home
    return window.location.hash.replace("#", "") === "" || page === "home";
  });

  useEffect(() => {
    // optional: replay intro when landing on home via browser refresh
    if (page === "home" && performance?.navigation?.type === 1) {
      setShowIntro(true);
    }
  }, [page]);

  return (
    <div className={`app ${showIntro ? "is-intro" : "is-ready"}`}>
      {/* ===== JSX #3 — render Intro overlay (B) ===== */}
      {showIntro && (
        <Intro
          navLeft="Kellen Cosgrave"
          navRight="Creative Works"
          onDone={() => setShowIntro(false)}
        />
      )}

      <Header
        current={current}
        navigate={navigate}
        theme={theme}
        setTheme={setTheme}
        soundOpen={soundOpen}
        setSoundOpen={setSoundOpen}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        tracks={SOUNDS}
        playTrack={playTrack}
        trackIdx={trackIdx}
      />

      {/* hidden global audio element */}
      <audio ref={audioRef} preload="metadata" onEnded={() => setIsPlaying(false)} />

      <main className="app-main">{Page}</main>

      <footer className="site-footer">
        <div className="container row">
          <span className="foot-left">{SITE.name}</span>

          {/* centered now-playing line */}
          <span className="now-playing">
            Now Playing:&nbsp;
            <strong>{trackIdx != null ? SOUNDS[trackIdx].title : "—"}</strong>
            {!isPlaying && trackIdx != null ? " (paused)" : ""}
          </span>

          <span className="foot-right" style={{ display: "flex", gap: "14px", justifySelf: "end" }}>
            <a href={`mailto:${SITE.email}`}>Email</a>
            <a href={SITE.ig} target="_blank" rel="noreferrer">Instagram</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
