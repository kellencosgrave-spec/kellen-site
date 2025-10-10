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
  theme,
  setTheme,
  page,
  setPage,
  soundOpen,
  setSoundOpen,
  trackIdx,
  setTrackIdx,
  isPlaying,
  audioRef,
  navigate,
}) {
  // mobile menu open/close
  const [menuOpen, setMenuOpen] = useState(false);

  // close sounds if we change page (requested behavior)
  useEffect(() => {
    setSoundOpen(false);
  }, [page, setSoundOpen]);

  // toggle helpers
  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const onClickSounds = () => setSoundOpen((v) => !v);
  const onClickMenu = () => setMenuOpen((v) => !v);

  // picking a work from the condensed mobile menu
  const go = (to) => {
    setMenuOpen(false);
    if (to === "work" || to === "archive" || to === "info" || to === "home") {
      setPage(to);
      navigate(to);
    }
  };

  const currentTrack = trackIdx != null ? SOUNDS[trackIdx] : null;

  return (
    <header className="site-header">
      <div className="container row header-grid">
        {/* Left: Brand */}
        <button className="brand" onClick={() => go("home")} aria-label="Home">
          {SITE.name}
        </button>

        {/* Center: Mobile Menu trigger */}
        <button
          className="menu-trigger"
          onClick={onClickMenu}
          aria-expanded={menuOpen ? "true" : "false"}
          aria-controls="mobile-menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        {/* Right: Sounds control (also shows playing/paused) */}
        <div className="header-right">
          <button className="sound-toggle" onClick={onClickSounds}>
            Sounds {isPlaying ? "❚❚" : "▶"}
          </button>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Theme">
            {theme === "dark" ? "☾" : "☀"}
          </button>
        </div>
      </div>

      {/* Mobile drop panel (slides the site down visually via CSS) */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <nav className="mobile-nav">
          <button onClick={() => go("work")} className="navbig">Work</button>
          <button onClick={() => go("archive")} className="navbig">Archive</button>
          <button onClick={() => go("info")} className="navbig">Info</button>
        </nav>
      </div>

      {/* Sounds overlay */}
      <div className={`sounds-panel ${soundOpen ? "open" : ""}`}>
        <div className="container">
          <div className="sounds-list">
            {SOUNDS.map((t, i) => (
              <button
                key={t.title + i}
                className={`track ${trackIdx === i ? "active" : ""}`}
                onClick={() => {
                  setTrackIdx(i);
                  // load & play
                  if (audioRef.current) {
                    audioRef.current.src = t.src;
                    audioRef.current.play().catch(() => {});
                  }
                }}
              >
                {t.title}
              </button>
            ))}
          </div>

          {/* mini player */}
          <div className="mini-player">
            <span className="mp-title">
              {currentTrack ? currentTrack.title : "—"}
            </span>
            <div className="mp-controls">
              <button
                onClick={() => {
                  if (!audioRef.current) return;
                  if (audioRef.current.paused) audioRef.current.play();
                  else audioRef.current.pause();
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => {
                  const next = (trackIdx == null ? 0 : trackIdx + 1) % SOUNDS.length;
                  setTrackIdx(next);
                  if (audioRef.current) {
                    audioRef.current.src = SOUNDS[next].src;
                    audioRef.current.play().catch(() => {});
                  }
                }}
                aria-label="Next track"
              >
                Next
              </button>
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

function Home({ theme }) {
  // preload + no-jank and click-play fallback
  const lightRef = useRef(null);
  const darkRef = useRef(null);

  useEffect(() => {
    const ensurePlay = (v) => v && v.play().catch(() => {});
    [lightRef.current, darkRef.current].forEach((v) => {
      if (!v) return;
      v.preload = "auto";
      const tryPlay = () => ensurePlay(v);
      v.addEventListener("canplay", tryPlay, { once: true });
      tryPlay();
    });
    return () => {
      [lightRef.current, darkRef.current].forEach((v) => {
        if (v) v.removeEventListener("canplay", () => {});
      });
    };
  }, []);

  const showLight = theme !== "dark";
  const hero = HERO[theme] || HERO.light;

  return (
    <div className="container" style={{ paddingTop: 36 }}>
      {/* fixed-height wrapper prevents any layout jump */}
      <div className="hero-wrap">
        <video
          ref={lightRef}
          className="hero-video"
          src={HERO.light.src}
          poster={HERO.light.poster}
          playsInline
          muted
          autoPlay
          loop
          style={{ opacity: showLight ? 1 : 0 }}
        />
        <video
          ref={darkRef}
          className="hero-video"
          src={HERO.dark.src}
          poster={HERO.dark.poster}
          playsInline
          muted
          autoPlay
          loop
          style={{ opacity: showLight ? 0 : 1 }}
        />
        {/* overlay title safe area if you need it */}
      </div>
    </div>
  );
}

function Work({ navigate }) {
  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <ul className="work-list">
        {WORKS.map((w) => (
          <li key={w.slug}>
            <button className="work-link" onClick={() => navigate(`work/${w.slug}`)}>
              {w.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------- mobile swipe helper -------------------- */
function useSwipe({ onLeft, onRight, threshold = 40 }) {
  const startX = useRef(null);
  const startY = useRef(null);
  const dragging = useRef(false);

  const onTouchStart = (e) => {
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    startX.current = t.clientX;
    startY.current = t.clientY;
    dragging.current = true;
  };

  const onTouchEnd = (e) => {
    if (!dragging.current) return;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    dragging.current = false;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx < 0) onLeft && onLeft();
      else onRight && onRight();
    }
  };

  return { onTouchStart, onTouchEnd };
}
/* ------------------------------------------------------------- */

function Project({ slug, navigate }) {
  const work = WORKS.find((w) => w.slug === slug);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [slug]);

  if (!work) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        Not found.
      </div>
    );
  }

  const total = work.media.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  const swipe = useSwipe({ onLeft: next, onRight: prev });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [total]);

  return (
    <div className="container">
      <div className="slide-wrap">
        <figure
          className="slide click-zones"
          onTouchStart={swipe.onTouchStart}
          onTouchEnd={swipe.onTouchEnd}
        >
          {total > 0 ? (
            <>
              <div className="slide-viewport">
                <img
                  src={work.media[idx]}
                  alt={`${work.title} ${idx + 1}/${total}`}
                />
              </div>
              <button aria-label="Previous" onClick={prev} style={{ left: 0 }} />
              <button aria-label="Next" onClick={next} style={{ right: 0 }} />
            </>
          ) : null}
          <figcaption className="caption">
            {work.captions?.[idx] || work.title}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

function Archive({ navigate }) {
  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <ul className="work-list">
        {ARCHIVE.map((a) => (
          <li key={a.slug}>
            <button
              className="work-link"
              onClick={() => navigate(`archive/${a.slug}`)}
            >
              {a.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArchiveView({ aSlug, navigate }) {
  const findIndex = (slug) => ARCHIVE.findIndex((a) => a.slug === slug);
  const [idx, setIdx] = useState(Math.max(0, findIndex(aSlug)));

  useEffect(() => {
    const i = findIndex(aSlug);
    if (i !== -1) setIdx(i);
  }, [aSlug]);

  const prev = () =>
    setIdx((i) => {
      const ni = (i - 1 + ARCHIVE.length) % ARCHIVE.length;
      navigate(`archive/${ARCHIVE[ni].slug}`);
      return ni;
    });
  const next = () =>
    setIdx((i) => {
      const ni = (i + 1) % ARCHIVE.length;
      navigate(`archive/${ARCHIVE[ni].slug}`);
      return ni;
    });

  const swipe = useSwipe({ onLeft: next, onRight: prev });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") navigate("archive");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const a = ARCHIVE[idx];

  return (
    <div className="container">
      <div className="slide-wrap">
        <figure
          className="slide click-zones"
          onTouchStart={swipe.onTouchStart}
          onTouchEnd={swipe.onTouchEnd}
        >
          <div className="slide-viewport">
            <img
              key={a.slug}
              src={a.src}
              alt={a.caption || a.title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <button aria-label="Previous" onClick={prev} style={{ left: 0 }} />
          <button aria-label="Next" onClick={next} style={{ right: 0 }} />
        </figure>
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <p>{SITE.bio}</p>
    </div>
  );
}

/* =========================================================
   6) Footer (Now Playing marquee + links)
   ========================================================= */
function Footer({ isPlaying, trackIdx }) {
  return (
    <footer className="site-footer">
      <div className="container row footer-grid">
        <span className="foot-left">{SITE.name}</span>

        {/* Now Playing — with marquee title */}
        <div className="now-playing-wrap">
          <span className="np-label">Now Playing&nbsp;</span>
          <div className="np-track-mask" aria-live="polite">
            <div className={`np-track ${isPlaying ? "scroll" : ""}`}>
              <strong>
                {trackIdx != null ? SOUNDS[trackIdx].title : "—"}
              </strong>
              {!isPlaying && trackIdx != null ? " (paused)" : ""}
            </div>
          </div>
        </div>

        <span className="foot-right" style={{ display: "flex", gap: "14px", justifySelf: "end" }}>
          <a href={`mailto:${SITE.email}`}>Email</a>
          <a href={SITE.ig} target="_blank" rel="noreferrer">Instagram</a>
        </span>
      </div>
    </footer>
  );
}

/* =========================================================
   7) App (glue)
   ========================================================= */
function App() {
  const [theme, setTheme] = useState("light");
  const [page, setPage] = useState("home"); // home | work | project | archive | archiveView | info
  const [slug, setSlug] = useState(null);

  // very small hash-router (your project may already have navigate)
  useEffect(() => {
    const apply = () => {
      const hash = (location.hash || "#/").slice(2); // drop "#/"
      const [p, s] = hash.split("/");
      if (!p) { setPage("home"); setSlug(null); return; }
      setPage(p);
      setSlug(s || null);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const navigate = (to) => {
    if (to === "home") location.hash = "#/";
    else location.hash = `#/${to}`;
  };

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

  return (
    <div className={`app ${theme} ${soundOpen ? "sounds-open" : ""}`}>
      <Header
        theme={theme}
        setTheme={setTheme}
        page={page}
        setPage={setPage}
        soundOpen={soundOpen}
        setSoundOpen={setSoundOpen}
        trackIdx={trackIdx}
        setTrackIdx={setTrackIdx}
        isPlaying={isPlaying}
        audioRef={audioRef}
        navigate={navigate}
      />

      <main className="app-main">
        {page === "home" && <Home theme={theme} />}
        {page === "work" && <Work navigate={navigate} />}
        {page === "project" && slug && <Project slug={slug} navigate={navigate} />}
        {page === "archive" && <Archive navigate={navigate} />}
        {page === "archive" && slug && <ArchiveView aSlug={slug} navigate={navigate} />}
        {page === "info" && <Info />}
      </main>

      <Footer isPlaying={isPlaying} trackIdx={trackIdx} />

      {/* global audio element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}

export default App;
