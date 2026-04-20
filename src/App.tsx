/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import {
  MapPin,
  Play,
  ShieldCheck,
  Facebook,
  Instagram,
  X,
  Maximize2,
  BookOpen,
  Globe,
  Landmark,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

/* ══════════════════════════════════════════════
   TYPING TEXT COMPONENT
══════════════════════════════════════════════ */
const TypingText = ({
  text,
  delay = 0,
  speed = 28,
  className = "",
  once = true,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  once?: boolean;
}) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        } else if (!once && !entry.isIntersecting) {
          setStarted(false);
          setDisplayed("");
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, once]);

  useEffect(() => {
    if (!started) return;
    setDisplayed("");
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, text, delay, speed]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-[2px] h-[1em] bg-gold-accent align-middle ml-[1px] animate-pulse" />
      )}
    </span>
  );
};

/* ══════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════ */
const Modal = ({
  isOpen,
  onClose,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  content: { src: string; title: string; type: "image" | "video" } | null;
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen || !content) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 p-4 md:p-12 backdrop-blur-2xl"
        onClick={onClose}
      >
        <motion.button
          whileHover={{ rotate: 90, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-8 right-8 text-white/40 hover:text-white z-[110] w-12 h-12 flex items-center justify-center border border-white/10 rounded-full"
          onClick={onClose}
        >
          <X size={20} />
        </motion.button>

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative w-full flex flex-col items-center justify-center max-w-6xl mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {content.type === "video" ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden relative bg-white/5 border border-gold-accent/20 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
              <video
                src={content.src}
                controls
                autoPlay
                className="w-full h-full object-cover"
                style={{ opacity: 1, filter: "none" }}
              />
            </div>
          ) : (
            /* ── IMAGE: full size, no filters, prominent ── */
            <div className="w-full flex items-center justify-center">
              <img
                src={content.src}
                alt={content.title}
                className="rounded-2xl shadow-[0_0_120px_rgba(0,0,0,0.95)] border border-white/8"
                style={{
                  opacity: 1,
                  filter: "none",
                  maxHeight: "78vh",
                  maxWidth: "100%",
                  width: "auto",
                  objectFit: "contain",
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="mt-6 text-center">
            <h2 className="text-gold-accent font-display text-2xl md:text-4xl uppercase tracking-tighter">
              {content.title}
            </h2>
            <p className="text-white/30 font-mono text-[9px] uppercase tracking-[0.5em] mt-2">
              Professional Historical Archive • Istiqlol Taqdimoti
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════
   SLIDE TITLE
══════════════════════════════════════════════ */
const SlideTitle = ({
  title,
  subtitle,
  bgText,
}: {
  title: string;
  subtitle?: string;
  bgText?: string;
}) => (
  <div className="relative">
    {bgText && (
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 0.035, x: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute -left-4 md:-left-10 -top-10 md:-top-20 text-[80px] sm:text-[130px] md:text-[260px] font-display leading-none select-none pointer-events-none whitespace-nowrap text-white"
      >
        {bgText}
      </motion.div>
    )}
    <motion.h2
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="font-display text-[50px] sm:text-[80px] md:text-[140px] leading-[0.85] tracking-tighter uppercase text-white mb-4"
    >
      {title}
      <span className="text-gold-accent">.</span>
    </motion.h2>
    {subtitle && (
      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-white/35 mb-6 md:mb-10">
        {subtitle}
      </p>
    )}
  </div>
);

/* ══════════════════════════════════════════════
   TIMELINE ENTRY
══════════════════════════════════════════════ */
const TimelineEntry = ({
  year,
  title,
  desc,
  icon: Icon,
}: {
  year: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    }}
    className="border-l-2 border-gold-accent/35 pl-6 space-y-3 group"
  >
    <Icon size={18} className="text-gold-accent/60 mb-2" />
    <span className="font-display text-5xl text-gold-accent leading-none block">{year}</span>
    <h3 className="font-display text-lg uppercase tracking-wider text-white">{title}</h3>
    <p className="text-white/40 text-sm font-light leading-relaxed">{desc}</p>
  </motion.div>
);

/* ══════════════════════════════════════════════
   SIDE RAIL
══════════════════════════════════════════════ */
const SideRail = ({ text1, text2 }: { text1: string; text2: string }) => (
  <div className="col-span-1 hidden md:flex border-r border-white/8 flex-col items-center justify-center py-10 space-y-10">
    <div className="rotate-[-90deg] whitespace-nowrap text-[9px] uppercase tracking-[0.5em] opacity-30">
      {text1}
    </div>
    <div className="w-[1px] h-20 bg-white/15" />
    <div className="rotate-[-90deg] whitespace-nowrap text-[9px] uppercase tracking-[0.5em] opacity-30">
      {text2}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   PARALLAX IMAGE — FIXED (no grayscale, full opacity)
══════════════════════════════════════════════ */
const ParallaxImage = ({
  src,
  title,
  year,
  factor = 1,
  onClick,
}: {
  src: string;
  title: string;
  year: string;
  factor?: number;
  onClick?: () => void;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRange = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-12 * factor}%`, `${12 * factor}%`]
  );
  const y = useSpring(yRange, { stiffness: 90, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5 border border-white/6 shadow-[0_30px_80px_rgba(0,0,0,0.7)] cursor-pointer"
    >
      <motion.img
        style={{ y, scale: 1.25 }}
        src={src}
        alt={title}
        referrerPolicy="no-referrer"
        /* Full brightness, no desaturation. Hover: slight pop */
        className="w-full h-full object-cover transition-[filter,transform] duration-700 brightness-[0.92] group-hover:brightness-105"
      />

      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <Maximize2 size={13} className="text-white/70" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent flex flex-col justify-end p-5 md:p-8 z-10">
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <span className="text-gold-accent font-display text-lg md:text-2xl mb-1 block uppercase tracking-tight">
            {title}
          </span>
          <span className="text-white/45 font-mono text-[9px] uppercase tracking-[0.35em]">
            {year}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════ */
const StatCard = ({ num, label, sub }: { num: string; label: string; sub: string }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
    className="border border-white/8 rounded-xl p-6 bg-white/3 hover:border-gold-accent/30 transition-colors"
  >
    <div className="font-display text-5xl text-gold-accent leading-none mb-2">{num}</div>
    <div className="text-white font-display text-sm uppercase tracking-widest">{label}</div>
    <div className="text-white/35 text-xs mt-1 font-light">{sub}</div>
  </motion.div>
);

/* ══════════════════════════════════════════════
   APP
══════════════════════════════════════════════ */
export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    src: string;
    title: string;
    type: "image" | "video";
  } | null>(null);

  const openModal = (src: string, title: string, type: "image" | "video") => {
    setModalContent({ src, title, type });
    setModalOpen(true);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  /* ── Real asset paths ── */
  const galleryImages = [
    {
      src: "./../assets/images/img1.jpg",
      title: "Registon Majmuasi",
      year: "XV–XVII Asr Me'morchiligi",
      desc: "Samarqanddagi Registon maydoni O'rta Osiyo islom me'morchiligining durdonasi hisoblanadi. Uch madrasadan iborat bu majmua — Ulugbek, Sher-Dor va Tillakori — asrlar davomida ilm va ma'rifat markazi bo'lib kelgan.",
    },
    {
      src: "./../assets/images/img2.jpg",
      title: "Ichan Qal'a",
      year: "Xiva Xonligi Me'rosi",
      desc: "UNESCO ro'yxatiga kiritilgan Ichan Qal'a — O'zbekistonning eng yaxshi saqlangan qadimiy shahridir. Minoralar, madrasalar va saroylar bilan to'la bu qo'rg'on Xiva xonligining shon-shuhratini bugun ham namoyon etadi.",
    },
    {
      src: "./../assets/images/img3.jpg",
      title: "Amir Temur Davlati",
      year: "Buyuk Mo'g'ul Imperiyasi",
      desc: "Sohibqiron Amir Temur XIV asrda buyuk imperiya qurdi. Samarqandni poytaxt qilib, u yerda ilm, san'at va me'morchilik gulladi. Temuriylar davrida O'rta Osiyo jahon sivilizatsiyasining markaziga aylandi.",
    },
    {
      src: "./../assets/images/img4.jpg",
      title: "Shohi Zinda",
      year: "Abadiy San'at Namunasi",
      desc: "Samarqanddagi Shohi Zinda maqbaralar ansambli islom me'morchiligi va bezak san'atining eng noyob namunalaridan biridir. Ko'k va oltin ranglar bilan bezatilgan gumbazlar osmon bilan uyg'un muloqotda turadi.",
    },
  ];

  const videos = [
    {
      src: "./../assets/videos/video-t-1.mp4",
      title: "Mustaqillik Yo'li",
      num: "01",
      desc: "1991-yil 1-sentabr — O'zbekiston mustaqilligining tantanali e'lon qilinishi. Tarixiy Oliy Kengash sessiyasi, xalqning quvonchi va yangi davlatning tug'ilishi haqidagi nodir hujjatli lavhalar.",
    },
    {
      src: "./../assets/videos/video-t-2.mp4",
      title: "Yangi Renessans",
      num: "02",
      desc: "Uchinchi Renessans g'oyasi: zamonaviy O'zbekiston qanday qilib ilm-fan, san'at va texnologiyani milliy taraqqiyotning asosiga aylantirib bormoqda. Ekspertlar, olimlar va yoshlar nigohidan.",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="presentation-container scroll-smooth selection:bg-gold-accent selection:text-black"
    >
      <div className="noise" />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} content={modalContent} />

      {/* ── Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold-accent z-50 origin-left"
        style={{ scaleX }}
      />

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 md:px-12 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-10 h-10 border border-gold-accent flex items-center justify-center rounded-full"
          >
            <span className="text-gold-accent font-display text-[10px] tracking-wider">UZ</span>
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display tracking-[0.3em] text-[10px] uppercase text-white">
              Istiqlol Taqdimoti
            </span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-gold-accent/60">
              Professional Nashr • 2026
            </span>
          </div>
        </div>
        <nav className="hidden md:flex space-x-10 text-[9px] uppercase tracking-[0.3em] font-semibold text-white/35">
          {["Sovereignty", "Media Hub", "Chronology", "Artifacts"].map((n) => (
            <span key={n} className="hover:text-gold-accent transition-colors cursor-pointer flex items-center gap-1.5">
              <ChevronRight size={8} className="text-gold-accent/40" />
              {n}
            </span>
          ))}
        </nav>
      </header>

      {/* ══════════════════════════════════════════
          SLIDE 1 — HERO
      ══════════════════════════════════════════ */}
      <section className="slide grid grid-cols-12 overflow-hidden items-center">
        <SideRail text1="PRESTIGE EDITION" text2="ACADEMIC VIEW 2.0" />
        <div className="col-span-11 flex flex-col justify-center px-8 md:px-20 relative">
          <SlideTitle
            title="ISTIQLOL"
            subtitle="O'zbekiston Davlatchiligi: Tarix, Bugun va Istiqbol"
            bgText="SOVEREIGNTY"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-lg md:text-xl font-light text-white/55 leading-relaxed mb-4 border-l-2 border-gold-accent/40 pl-8">
              <TypingText
                text="Davlat mustaqilligi — bu millatning o'z taqdirini o'zi belgilash, o'z madaniy va ijtimoiy qadriyatlarini himoya qilish va kelajak avlodlar uchun ulug' merosni saqlab qolish huquqidir."
                delay={1000}
                speed={22}
              />
            </p>

            <p className="text-sm text-white/35 leading-relaxed mb-10 pl-8 font-light">
              <TypingText
                text="Ushbu ilmiy taqdimot O'zbekistonning mustaqillikka erishish yo'lidagi strategik bosqichlarini, tarixiy yodgorliklar va madaniy merosni, hamda yangi Renessans siyosatini yoritadi."
                delay={4000}
                speed={18}
              />
            </p>

            <div className="flex items-center space-x-8 pl-8">
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: "#b8960a" }}
                className="px-10 py-5 bg-gold-accent text-black font-display text-[10px] uppercase tracking-[0.4em]"
              >
                Tahlilni Boshlash
              </motion.button>
              <span className="serif-italic text-gold-accent text-base opacity-70">
                Ilmiy Kengash Uchun Maxsus
              </span>
            </div>
          </motion.div>

          {/* stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex gap-10 mt-16 pl-8"
          >
            {[
              { n: "35+", l: "Yil" },
              { n: "38M+", l: "Aholi" },
              { n: "4", l: "Qadimiy shahar" },
            ].map((s) => (
              <div key={s.l} className="border-l border-gold-accent/25 pl-4">
                <div className="font-display text-3xl text-gold-accent">{s.n}</div>
                <div className="text-white/30 text-[9px] uppercase tracking-widest mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 2 — DAVLAT
      ══════════════════════════════════════════ */}
      <section className="slide grid grid-cols-12 items-center bg-[#070707]">
        <SideRail text1="GENESIS" text2="DATA ANALYSIS" />
        <div className="col-span-11 px-8 md:px-20 grid md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <SlideTitle
              title="DAVLAT"
              subtitle="Siyosiy va Ijtimoiy Transformatsiya"
              bgText="STATE"
            />
            <div className="space-y-5 text-white/50 text-sm leading-[1.9] font-light">
              <p>
                <TypingText
                  text="O'zbekiston mustaqilligi shunchaki siyosiy o'zgarish emas, balki chuqur sivilizatsiyaviy transformatsiya jarayonidir. 1991-yilgi tarixiy qaror mintaqani to'la yangi davrga olib chiqdi."
                  speed={20}
                />
              </p>
              <p>
                <TypingText
                  text="Bugungi O'zbekiston — tez sur'atlar bilan rivojlanayotgan, iqtisodiy islohotlar amalga oshirayotgan va jahon hamjamiyatiga integratsiyalashayotgan zamonaviy davlatdir."
                  delay={200}
                  speed={20}
                />
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  "Suveren davlat institutlari shakllanishi va mustahkamlanishi.",
                  "Milliy o'zlikni anglash va madaniy merosni tiklash.",
                  "Global iqtisodiy tizimga muvaffaqiyatli integratsiya.",
                  "Ta'lim va ilm-fan sohasida tub islohotlar.",
                  "Raqamli transformatsiya va IT-sektori rivojlanishi.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ShieldCheck size={14} className="text-gold-accent mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="glass p-10 rounded-2xl flex flex-col justify-center space-y-8 border-gold"
            >
              <h3 className="font-display text-3xl text-gold-accent uppercase tracking-tight italic">
                Uchinchi Renessans
              </h3>
              <p className="text-white/55 font-light italic text-base leading-relaxed">
                <TypingText
                  text="Yangi O'zbekiston strategiyasi — bu nafaqat iqtisodiy ko'rsatkichlar, balki inson kapitalini rivojlantirish va ilm-fanni davlat siyosatining ustuvor yo\'nalishiga aylantirishdir."
                  speed={18}
                  delay={300}
                />
              </p>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-gold-accent/40" />
                ))}
              </div>
            </motion.div>

            {/* stat cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 gap-4"
            >
              <StatCard num="185+" label="Davlat" sub="Diplomatik munosabatlar" />
              <StatCard num="7.5%" label="YaIM" sub="Yillik o'sish sur'ati" />
              <StatCard num="140+" label="Oliy o'quv" sub="Muassasalar soni" />
              <StatCard num="3X" label="IT eksport" sub="So'nggi 3 yilda" />
            </motion.div>
          </div>
        </div>
      </section>

      {videos.map((v, idx) => (
        <section
          key={`video-${idx}`}
          className="slide grid grid-cols-12 bg-black overflow-hidden relative"
        >
          <SideRail text1="MEDIA ARCHIVE" text2={`FOCUS VIDEO `} />
          <div className="col-span-11 px-6 md:px-20 grid md:grid-cols-2 gap-10 items-center">
            {/* text */}
            <div className="z-10 space-y-6">
              <SlideTitle
                title={`VIDEO `}
                subtitle="Hujjatli Tarixiy Lavhalar"
                bgText={`ARCHIVE `}
              />
              <h3 className="font-display text-3xl text-gold-accent uppercase tracking-tight">
                {v.title}
              </h3>
              <p className="text-white/45 text-base font-light leading-relaxed max-w-md">
                <TypingText text={v.desc} speed={16} />
              </p>
              <div className="flex gap-4 mt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  onClick={() => openModal(v.src, v.title, "video")}
                  className="px-7 py-3.5 border border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black transition-all flex items-center gap-2.5 uppercase font-display text-[10px] tracking-widest"
                >
                  <Play size={12} className="fill-current" /> To'liq ko'rish
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  onClick={() => openModal(v.src, v.title, "video")}
                  className="px-7 py-3.5 bg-white/5 text-white/60 hover:bg-white/10 transition-all flex items-center gap-2.5 uppercase font-display text-[10px] tracking-widest border border-white/10"
                >
                  <Maximize2 size={12} /> Kengaytirish
                </motion.button>
              </div>
            </div>

            {/* video card */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              onClick={() => openModal(v.src, v.title, "video")}
              className="relative h-[55vh] rounded-2xl overflow-hidden border border-gold-accent/20 cursor-pointer group shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-white/4"
            >
              <video
                src={v.src}
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-full object-cover opacity-55 group-hover:opacity-70 transition-opacity duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-20 h-20 rounded-full border border-gold-accent/40 bg-gold-accent/12 flex items-center justify-center backdrop-blur-sm"
                >
                  <Play className="text-gold-accent fill-gold-accent/30 ml-1" size={28} />
                </motion.div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                <div>
                  <p className="text-gold-accent font-display text-lg uppercase">{v.title}</p>
                  <p className="text-white/40 text-[9px] uppercase tracking-[0.4em] mt-1">
                    Play Archive • {v.num}
                  </p>
                </div>
                <div className="text-[9px] uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1.5 rounded-full">
                  HD Video
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* ══════════════════════════════════════════
          SLIDE 4 — TIMELINE
      ══════════════════════════════════════════ */}
      <section className="slide grid grid-cols-12 bg-[#0a0a0a]">
        <SideRail text1="CHRONOLOGY" text2="FACTUAL DATA" />
        <div className="col-span-11 px-6 md:px-20 flex flex-col justify-center py-16">
          <SlideTitle title="DAVR" subtitle="Ilmiy va Tarixiy Xronologiya" bgText="TIMELINE" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-8"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <TimelineEntry
              year="1991"
              title="Suverenitet"
              icon={Landmark}
              desc="1-sentabr — Mustaqillik deklaratsiyasi qabul qilindi. Yangi davlat ramzlari, Konstitutsiya va milliy institutlar shakllana boshladi. Qoʻshimcha uch mamlakat bilan bir vaqtda mustaqllik eʼlon qilindi."
            />
            <TimelineEntry
              year="1992"
              title="Global Tan Olish"
              icon={Globe}
              desc="O'zbekiston BMT va XVJga a'zo bo'ldi. 185 davlat bilan diplomatik munosabatlar o'rnatildi. Birinchi elchixonalar ochildi, xalqaro shartnomalar imzolandi."
            />
            <TimelineEntry
              year="2000s"
              title="Iqtisodiy O'sish"
              icon={BookOpen}
              desc="'O'zbek modeli' bozor iqtisodiyotiga yumshoq o'tishni ta'minladi. Energetika, qishloq xo'jaligi va sanoat sektorlari modernizatsiya qilindi. Xorijiy investitsiyalar jadal oshdi."
            />
            <TimelineEntry
              year="2020+"
              title="Raqamli Kelajak"
              icon={Cpu}
              desc="IT-eksport 3 barobarga oshdi. AI va raqamli transformatsiya davlat siyosatining markaziga chiqdi. Yangi Renessans platformasi doirasida 500+ startap qo'llab-quvvatlandi."
            />
          </motion.div>

          {/* milestones strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { y: "1992", e: "BMT a'zolik" },
              { y: "2001", e: "SCO asoschisi" },
              { y: "2017", e: "Yangi O'zbekiston" },
              { y: "2022", e: "Konstitutsiya yangilandi" },
            ].map((m) => (
              <div key={m.y} className="flex items-center gap-3 border-l border-gold-accent/25 pl-4 py-2">
                <div>
                  <div className="text-gold-accent font-display text-xl">{m.y}</div>
                  <div className="text-white/35 text-[10px] uppercase tracking-wider mt-0.5">{m.e}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 5 — GALLERY IMAGES (real paths)
      ══════════════════════════════════════════ */}
      {galleryImages.map((img, idx) => (
        <section
          key={`gallery-${idx}`}
          className="slide grid grid-cols-12 bg-zinc-950 overflow-hidden relative"
        >
          <SideRail text1="CULTURAL HERITAGE" text2={`ARTIFACT`} />
          <div className="col-span-11 grid md:grid-cols-2 h-full items-center px-6 md:px-20 gap-10 py-16">
            {/* text */}
            <div className="relative z-10 space-y-5">
             
              <h3 className="text-3xl md:text-5xl font-display text-gold-accent uppercase tracking-tight">
                {img.title}
              </h3>
              <p className="text-white/45 text-base font-light leading-[1.9] max-w-md">
                <TypingText text={img.desc} speed={17} />
              </p>
              <div className="h-[1px] w-20 bg-gold-accent/35 mt-4" />
              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={() => openModal(img.src, img.title, "image")}
                className="mt-2 px-7 py-3 border border-gold-accent/50 text-gold-accent hover:bg-gold-accent hover:text-black transition-all flex items-center gap-2 uppercase font-display text-[10px] tracking-widest"
              >
                <Maximize2 size={12} /> Yirik ko'rish
              </motion.button>
            </div>

            {/* image */}
            <div className="relative h-full flex items-center justify-center p-2 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.82, rotate: 4 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full h-[68vh]"
              >
                <ParallaxImage
                  src={img.src}
                  title={img.title}
                  year={img.year}
                  factor={1.4}
                  onClick={() => openModal(img.src, img.title, "image")}
                />
              </motion.div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 text-[280px] font-display text-white/4 leading-none pointer-events-none select-none">
            0{idx + 1}
          </div>
        </section>
      ))}

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="slide grid grid-cols-12 bg-black border-t border-white/5">
        <SideRail text1="CONTACT" text2="OFFICIAL DATA" />
        <div className="col-span-11 px-8 md:px-20 flex flex-col justify-center py-16">
          <div className="grid md:grid-cols-2 gap-16 items-end border-b border-white/6 pb-16 mb-10">
            <div className="space-y-8">
              <h2 className="font-display text-[70px] md:text-[110px] leading-none uppercase">
                XULOSA<span className="text-gold-accent">.</span>
              </h2>
              <p className="font-display italic text-xl text-gold-accent max-w-md leading-relaxed">
                <TypingText
                  text='"Vatan — bu faqat zamin emas, balki unda yashayotgan xalqning mangu ruhiyati va kelajak avlodlarga qoldiradigan bebahoizimizdir."'
                  speed={18}
                />
              </p>
              <p className="text-white/35 text-sm font-light leading-relaxed max-w-sm">
                <TypingText
                  text="Ushbu taqdimot O'zbekiston mustaqilligiga bag'ishlangan ilmiy-hujjatli materiallar asosida tayyorlangan. Barcha ma'lumotlar arxiv manbalarga asoslangan."
                  speed={16}
                  delay={300}
                />
              </p>
              <div className="flex gap-3 items-start">
                <MapPin className="text-gold-accent mt-0.5 shrink-0" size={16} />
                <span className="text-sm text-white/45 uppercase tracking-widest leading-loose">
                  Surxandaryo viloyati Termiz shahri
                  <br />
                  Joylinks IT Academy, 101-uy
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5 bg-white/4 p-10 rounded-2xl border border-white/6">
                <div className="space-y-1.5">
                  <p className="text-[9px] uppercase tracking-widest text-white/25">Telefon</p>
                  <p className="text-base font-display text-white">+998 94 300 30 51</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] uppercase tracking-widest text-white/25">Email</p>
                  <p className="text-xs font-mono text-gold-accent break-all">
                    musulmonmamatov36@gmail.com
                  </p>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <p className="text-[9px] uppercase tracking-widest text-white/25">Telegram</p>
                  <p className="text-sm text-white/70 font-mono">
                    @Musulmon_Mamatov_Asliddin_ogli
                  </p>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <p className="text-[9px] uppercase tracking-widest text-white/25">Muassasa</p>
                  <p className="text-sm text-white/70">Joylinks IT Academy, Termiz</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["Tarix", "Me'morchilik", "Mustaqillik"].map((tag) => (
                  <div
                    key={tag}
                    className="border border-white/8 rounded-lg px-3 py-2 text-center text-[9px] uppercase tracking-widest text-white/30"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center opacity-20 text-[9px] uppercase tracking-[0.4em] font-semibold">
            <p>© 2026 Istiqlol Taqdimoti • Professorlar uchun maxsus nashr</p>
            <div className="flex gap-5">
              <Facebook size={11} />
              <Instagram size={11} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}