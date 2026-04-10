import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════
//  DATA PAYLOAD — Update this object to change all portfolio content
// ═══════════════════════════════════════════════════════════════════
const DATA = {
  identity: {
    name: "HARRY NGUYEN",
    initials: "HN",
    title: "Electrical & Hardware Engineer",
    tagline: "Building at the intersection of silicon and software.",
    email: "nguye2cq@mail.uc.edu",
    phone: "+1 (513) 227-0739",
    university: "University of Cincinnati",
    year: "Freshman",
    major: "Electrical Engineering",
    status: "Available · Fall 2026 Co-op",
  },
  hobbies: [
    {
      id: "piano",
      title: "Piano",
      tag: "Virtuoso · By Ear",
      description: "Self-taught through listening. Classical, jazz, and everything in between — no sheet music required.",
      icon: "🎹",
      accent: "#FFE566",
      bg: "radial-gradient(ellipse at 20% 20%, #2a2000 0%, #0d0900 100%)",
      size: "large",
    },
    {
      id: "badminton",
      title: "Badminton",
      tag: "Competitive",
      description: "Court geometry and split-second decisions. Every rally is a physics problem.",
      icon: "🏸",
      accent: "#A8FF3E",
      bg: "radial-gradient(ellipse at 80% 20%, #152800 0%, #080d00 100%)",
      size: "small",
    },
    {
      id: "tennis",
      title: "Tennis",
      tag: "Precision · Power",
      description: "The angles of spin, serve placement, and approach — calculated in real time.",
      icon: "🎾",
      accent: "#FF8C6B",
      bg: "radial-gradient(ellipse at 80% 80%, #2a1000 0%, #0d0500 100%)",
      size: "small",
    },
  ],
  projects: [
    {
      id: "mark-i",
      title: "MARK I: KINETIC",
      subtitle: "Smart Glove Interface System",
      status: "In Development",
      description:
        "A gesture-recognition smart glove leveraging Wi-Fi for ML training data transmission and BLE for seamless HID device control. Move cursors, trigger macros, and interface with any device — hands-free.",
      highlights: [
        "Wi-Fi data pipeline for real-time ML training",
        "BLE HID — emulates wireless mouse & keyboard",
        "IMU + flex sensor fusion for gesture classification",
        "Custom 4-layer PCB designed in Altium Designer",
      ],
      tech: ["C++", "ESP32-S3", "BLE", "Wi-Fi", "Altium", "Python", "TFLite"],
      accent: "#FFE566",
    },
    {
      id: "desk-sentinel",
      title: "DESK SENTINEL",
      subtitle: "Multi-Screen ESP32 OLED Clock",
      status: "Complete",
      description:
        "A multi-panel ambient desk clock built on the ESP32. Three synchronized OLED displays render time, weather, and system metrics with a custom-drawn UI — from KiCad schematic to 3D-printed housing.",
      highlights: [
        "3x SSD1306 OLEDs multiplexed over I2C",
        "NTP time synchronization over Wi-Fi",
        "Real-time weather API with JSON parsing",
        "Custom KiCad PCB + 3D-printed enclosure",
      ],
      tech: ["MicroPython", "ESP32", "I2C", "KiCad", "Wi-Fi", "REST API"],
      accent: "#A8FF3E",
    },
  ],
  roadmap: [
    {
      id: "hs",
      year: "2024",
      season: "Summer",
      title: "High School Graduation",
      description: "Graduated with honors. First PCB designed. MARK I concept sketched on a napkin.",
      type: "milestone",
      side: "left",
    },
    {
      id: "uc",
      year: "2024",
      season: "August",
      title: "University of Cincinnati",
      description: "Declared Electrical Engineering. Joined IEEE student chapter. Embedded systems lab access unlocked.",
      type: "education",
      side: "right",
    },
    {
      id: "mark1",
      year: "2024",
      season: "Fall",
      title: "MARK I Development",
      description: "Began Altium PCB layout for the Kinetic glove. First hardware revision assembled and tested.",
      type: "project",
      side: "left",
    },
    {
      id: "clock",
      year: "2025",
      season: "Spring",
      title: "Desk Sentinel Ships",
      description: "Completed the multi-OLED ESP32 desk clock — first end-to-end hardware product from schematic to enclosure.",
      type: "project",
      side: "right",
    },
    {
      id: "coop",
      year: "2026",
      season: "Fall",
      title: "Co-op / Internship Target",
      description: "Seeking embedded systems, hardware design, or IoT engineering roles. Ready to contribute on day one.",
      type: "goal",
      side: "left",
    },
    {
      id: "future",
      year: "2027+",
      season: "",
      title: "The Next Chapter",
      description: "Advanced co-op rotations, research papers, and pushing the hardware frontier further.",
      type: "future",
      side: "right",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #080808;
      --bg-card: #101010;
      --accent: #FFE566;
      --green: #A8FF3E;
      --red: #FF8C6B;
      --text: #F0F0EE;
      --muted: #606060;
      --dim: #999994;
      --border: rgba(255,255,255,0.07);
      --border-accent: rgba(255,229,102,0.25);
    }

    html { scroll-behavior: smooth; }
    body { background: var(--bg); overflow-x: hidden; }
    ::selection { background: rgba(255,229,102,0.25); color: #fff; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.45; transform: scale(0.85); }
    }
    @keyframes drawLine { to { stroke-dashoffset: 0; } }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(14px) scale(0.95); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
      to   { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.95); }
    }
    @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    .tab-enter { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }

    .nav-link {
      position: relative; cursor: pointer; color: var(--muted);
      font-family: 'DM Mono', monospace; font-size: 10px;
      letter-spacing: 0.18em; text-transform: uppercase;
      padding: 8px 0; transition: color 0.3s ease; user-select: none;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 1px; background: var(--accent);
      transition: width 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .nav-link:hover { color: var(--text); }
    .nav-link:hover::after { width: 100%; }
    .nav-link.active { color: var(--accent); }
    .nav-link.active::after { width: 100%; }

    .bento-card {
      position: relative; overflow: hidden; border: 1px solid var(--border);
      border-radius: 18px; cursor: pointer;
      transition: border-color 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
    }
    .bento-card:hover { border-color: var(--border-accent); transform: translateY(-5px); }
    .bento-card .glow {
      position: absolute; inset: 0; opacity: 0;
      pointer-events: none; transition: opacity 0.4s ease;
    }
    .bento-card:hover .glow { opacity: 1; }

    .project-card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 20px; overflow: hidden; position: relative;
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease, box-shadow 0.4s ease;
    }
    .project-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 48px rgba(0,0,0,0.6);
    }
    .top-bar { height: 1px; width: 100%; opacity: 0; transition: opacity 0.4s ease; }
    .project-card:hover .top-bar { opacity: 1; }

    .copy-row {
      display: flex; align-items: center; gap: 14px;
      padding: 20px 22px; border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.02);
      cursor: pointer; transition: all 0.3s ease; margin-bottom: 8px;
    }
    .copy-row:last-child { margin-bottom: 0; }
    .copy-row:hover { border-color: var(--border-accent); background: rgba(255,229,102,0.04); transform: scale(1.01); }
    .copy-row:active { transform: scale(0.99); }

    .tech-tag {
      font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.05em;
      padding: 4px 10px; border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.09);
      background: rgba(255,255,255,0.04); color: var(--dim);
      display: inline-block; transition: border-color 0.2s, color 0.2s, background 0.2s; cursor: default;
    }
    .tech-tag:hover { border-color: var(--border-accent); color: var(--accent); background: rgba(255,229,102,0.05); }

    .timeline-node { transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
    .timeline-node.hidden { opacity: 0; transform: translateY(20px); }
    .timeline-node.visible { opacity: 1; transform: translateY(0); }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════════════════
const TABS = [
  { id: "home", label: "Home", num: "01" },
  { id: "projects", label: "Projects", num: "02" },
  { id: "roadmap", label: "Roadmap", num: "03" },
  { id: "contact", label: "Contact", num: "04" },
];

function Navbar({ active, onChange }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 64, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 40px",
      background: scrolled ? "rgba(8,8,8,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "background 0.4s, border-color 0.4s",
    }}>
      <div onClick={() => onChange("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{ width: 30, height: 30, border: "1.5px solid var(--accent)", borderRadius: 7,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--accent)", fontWeight: 500 }}>
          {DATA.identity.initials}
        </div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)", letterSpacing: "0.04em" }}>
          {DATA.identity.name}
        </span>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {TABS.map(t => (
          <div key={t.id} className={`nav-link${active === t.id ? " active" : ""}`} onClick={() => onChange(t.id)}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 8, opacity: 0.45 }}>{t.num}</span>{t.label}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 2.5s ease-in-out infinite" }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "var(--muted)" }}>
          {DATA.identity.status}
        </span>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  HOME TAB
// ═══════════════════════════════════════════════════════════════════
function BentoCard({ hobby, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="bento-card"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hobby.bg, padding: 28, height: "100%",
        minHeight: hobby.size === "large" ? 380 : 190,
        animation: `fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s both` }}>
      <div className="glow" style={{ background: `radial-gradient(circle at 25% 25%, ${hobby.accent}1A, transparent 60%)` }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span style={{ fontSize: hobby.size === "large" ? 48 : 36, lineHeight: 1, display: "block",
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
              transform: hov ? "scale(1.12) rotate(-8deg)" : "scale(1) rotate(0deg)" }}>
              {hobby.icon}
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.14em",
              padding: "4px 10px", borderRadius: 20, border: `1px solid ${hobby.accent}4D`,
              background: `${hobby.accent}14`, color: hobby.accent }}>
              {hobby.tag}
            </span>
          </div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "var(--text)", lineHeight: 1.1, marginBottom: 10,
            fontSize: hobby.size === "large" ? 30 : 22 }}>
            {hobby.title}
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "var(--dim)", lineHeight: 1.65 }}>
            {hobby.description}
          </p>
        </div>
        <div style={{ marginTop: 20, height: 2, background: hobby.accent, borderRadius: 1,
          width: hov ? "100%" : 28, transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
    </div>
  );
}

function HomeTab() {
  const [charIdx, setCharIdx] = useState(0);
  const name = DATA.identity.name;
  useEffect(() => {
    if (charIdx < name.length) {
      const t = setTimeout(() => setCharIdx(i => i + 1), 65);
      return () => clearTimeout(t);
    }
  }, [charIdx, name.length]);

  const tickers = ["Electrical Engineering", "PCB Design", "Embedded Systems", "BLE / Wi-Fi", "ESP32", "C++", "MicroPython", "Altium Designer", "KiCad", "Hardware Engineering"];

  return (
    <div className="tab-enter" style={{ paddingTop: 64 }}>
      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,229,102,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,229,102,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px" }} />
        <div style={{ position: "absolute", right: "8%", top: "10%", width: 1, height: "45%",
          background: "linear-gradient(to bottom, transparent, var(--accent), transparent)", opacity: 0.2, animation: "fadeIn 2s ease 0.4s both" }} />
        <div style={{ position: "absolute", right: "13%", top: "28%", width: 1, height: "28%",
          background: "linear-gradient(to bottom, transparent, var(--green), transparent)", opacity: 0.14, animation: "fadeIn 2s ease 0.7s both" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 960 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.22em",
            color: "var(--accent)", marginBottom: 24, animation: "fadeUp 0.5s ease 0.1s both" }}>
            &lt;electrical_hardware_engineer /&gt;
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(70px, 12vw, 164px)", lineHeight: 0.88,
            letterSpacing: "0.02em", color: "var(--text)", animation: "fadeUp 0.55s ease 0.2s both" }}>
            {name.substring(0, charIdx)}
            <span style={{ display: "inline-block", width: 6, height: "0.85em", background: "var(--accent)",
              marginLeft: 4, verticalAlign: "middle",
              animation: charIdx >= name.length ? "blink 1.1s step-end infinite" : "none" }} />
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24, marginBottom: 14,
            animation: "fadeUp 0.55s ease 0.38s both" }}>
            <div style={{ height: 1, width: 36, background: "var(--accent)" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 500, color: "var(--dim)", letterSpacing: "0.04em" }}>
              {DATA.identity.title}
            </span>
          </div>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: "var(--muted)",
            maxWidth: 440, lineHeight: 1.75, animation: "fadeUp 0.55s ease 0.48s both" }}>
            {DATA.identity.tagline}
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 36, animation: "fadeUp 0.55s ease 0.58s both" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em",
              padding: "7px 14px", background: "rgba(255,229,102,0.07)", border: "1px solid rgba(255,229,102,0.2)",
              borderRadius: 6, color: "var(--accent)" }}>
              {DATA.identity.university} · {DATA.identity.year}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em",
              padding: "7px 14px", background: "rgba(168,255,62,0.06)", border: "1px solid rgba(168,255,62,0.18)",
              borderRadius: 6, color: "var(--green)" }}>
              {DATA.identity.major}
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: 40, display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 1s ease 1.2s both" }}>
          <div style={{ width: 1, height: 52, background: "linear-gradient(to bottom, transparent, var(--accent))", animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.22em", color: "var(--muted)", writingMode: "vertical-rl" }}>SCROLL</span>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        overflow: "hidden", padding: "14px 0", background: "rgba(255,229,102,0.015)" }}>
        <div style={{ display: "flex", width: "max-content", animation: "ticker 26s linear infinite" }}>
          {[...tickers, ...tickers].map((t, i) => (
            <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em",
              color: "var(--muted)", whiteSpace: "nowrap", padding: "0 28px",
              display: "flex", alignItems: "center", gap: 28 }}>
              {t}<span style={{ color: "var(--accent)", opacity: 0.4 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* BENTO GRID */}
      <section style={{ padding: "90px 40px 120px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.22em", color: "var(--muted)", marginBottom: 12 }}>
            — BEYOND THE BENCH
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)", color: "var(--text)", lineHeight: 1.1 }}>
            Life outside the lab.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gridTemplateRows: "1fr 1fr", gap: 14, maxWidth: 1100 }}>
          <div style={{ gridColumn: 1, gridRow: "1 / 3" }}><BentoCard hobby={DATA.hobbies[0]} delay={0.1} /></div>
          <div style={{ gridColumn: 2, gridRow: 1 }}><BentoCard hobby={DATA.hobbies[1]} delay={0.2} /></div>
          <div style={{ gridColumn: 2, gridRow: 2 }}><BentoCard hobby={DATA.hobbies[2]} delay={0.3} /></div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  THREE.JS CANVAS
// ═══════════════════════════════════════════════════════════════════
function ThreeCanvas() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Wireframe cube
    const edgesGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.8, 2.8, 2.8));
    const wireframe = new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({ color: 0xFFE566 }));
    scene.add(wireframe);

    // Inner solid cube
    const solid = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 2.5, 2.5),
      new THREE.MeshPhongMaterial({ color: 0x0c0c0c, transparent: true, opacity: 0.92, shininess: 60 })
    );
    scene.add(solid);

    // Vertex corner dots
    const dotGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xFFE566 });
    const dotGroup = new THREE.Group();
    [[-1.4,-1.4,-1.4],[-1.4,-1.4,1.4],[-1.4,1.4,-1.4],[-1.4,1.4,1.4],
     [1.4,-1.4,-1.4],[1.4,-1.4,1.4],[1.4,1.4,-1.4],[1.4,1.4,1.4]].forEach(([x,y,z]) => {
      const d = new THREE.Mesh(dotGeo, dotMat); d.position.set(x,y,z); dotGroup.add(d);
    });
    scene.add(dotGroup);

    // Floating particles
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(90 * 3);
    for (let i = 0; i < pos.length; i++) pos[i] = (Math.random() - 0.5) * 14;
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xFFE566, size: 0.025, transparent: true, opacity: 0.35 }));
    scene.add(particles);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const pl1 = new THREE.PointLight(0xFFE566, 5, 18); pl1.position.set(5, 5, 5); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xA8FF3E, 2, 14); pl2.position.set(-5, -4, -3); scene.add(pl2);

    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.007;
      const tx = mouseRef.current.y * 0.9, ty = mouseRef.current.x * 0.9;
      wireframe.rotation.x += (tx - wireframe.rotation.x) * 0.04 + 0.003;
      wireframe.rotation.y += (ty - wireframe.rotation.y) * 0.04 + 0.006;
      solid.rotation.x = wireframe.rotation.x; solid.rotation.y = wireframe.rotation.y;
      dotGroup.rotation.x = wireframe.rotation.x; dotGroup.rotation.y = wireframe.rotation.y;
      const s = 1 + Math.sin(t) * 0.016;
      wireframe.scale.set(s, s, s);
      particles.rotation.y += 0.0008;
      pl1.position.x = Math.sin(t * 0.6) * 5;
      pl1.position.y = Math.cos(t * 0.4) * 4;
      renderer.render(scene, camera);
    };
    animate();

    const onMouse = (e) => {
      const r = mount.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - r.left) / W - 0.5) * 2;
      mouseRef.current.y = -((e.clientY - r.top) / H - 0.5) * 2;
    };
    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    mount.addEventListener("mousemove", onMouse);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      mount.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: 420 }} />;
}

// ═══════════════════════════════════════════════════════════════════
//  PROJECTS TAB
// ═══════════════════════════════════════════════════════════════════
function ProjectCard({ project, delay }) {
  return (
    <div className="project-card" style={{ animation: `fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s both` }}>
      <div className="top-bar" style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }} />
      <div style={{ padding: "30px 34px 34px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.22em", color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" }}>
              {project.subtitle}
            </div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: "0.04em", color: "var(--text)", lineHeight: 1 }}>
              {project.title}
            </h3>
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.14em",
            padding: "5px 12px", borderRadius: 20, border: `1px solid ${project.accent}45`,
            background: `${project.accent}12`, color: project.accent, whiteSpace: "nowrap", marginTop: 4 }}>
            {project.status}
          </span>
        </div>

        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13.5, color: "var(--dim)", lineHeight: 1.7, marginBottom: 22 }}>
          {project.description}
        </p>

        <div style={{ height: 1, background: "var(--border)", marginBottom: 22 }} />

        <div style={{ marginBottom: 26 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: project.accent, marginBottom: 12 }}>
            KEY FEATURES
          </div>
          {project.highlights.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: project.accent, marginTop: 7, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "var(--dim)", lineHeight: 1.55 }}>{h}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: "var(--muted)", marginBottom: 10 }}>
            TECH STACK
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsTab() {
  return (
    <div className="tab-enter" style={{ paddingTop: 64 }}>
      <section style={{ padding: "72px 40px 40px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.22em", color: "var(--muted)", marginBottom: 10 }}>— 3D WORKSPACE</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 44px)", color: "var(--text)" }}>Interactive Demo</h2>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.08em", color: "var(--muted)", textAlign: "right", lineHeight: 2 }}>
            <div>Move mouse to rotate</div>
            <div style={{ color: "var(--accent)", opacity: 0.55 }}>Custom geometry coming soon</div>
          </div>
        </div>

        <div style={{ borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden",
          background: "radial-gradient(ellipse at center, #0f0f0f 0%, #080808 100%)", position: "relative" }}>
          {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
            <div key={v+h} style={{ position: "absolute", [v]: 12, [h]: 12, width: 18, height: 18,
              borderTop: v==="top" ? "1px solid var(--accent)" : "none",
              borderBottom: v==="bottom" ? "1px solid var(--accent)" : "none",
              borderLeft: h==="left" ? "1px solid var(--accent)" : "none",
              borderRight: h==="right" ? "1px solid var(--accent)" : "none",
              opacity: 0.4, zIndex: 2, pointerEvents: "none" }} />
          ))}
          <ThreeCanvas />
          <div style={{ position: "absolute", bottom: 14, left: 18, fontFamily: "'DM Mono', monospace",
            fontSize: 8, letterSpacing: "0.14em", color: "var(--muted)", opacity: 0.4 }}>
            THREE.JS r128 · WEBGL · REACT
          </div>
        </div>
      </section>

      <section style={{ padding: "72px 40px 110px" }}>
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.22em", color: "var(--muted)", marginBottom: 12 }}>— HARDWARE PROJECTS</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)", color: "var(--text)", lineHeight: 1.1 }}>
            Built, not imagined.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 20 }}>
          {DATA.projects.map((p, i) => <ProjectCard key={p.id} project={p} delay={i * 0.12} />)}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ROADMAP TAB
// ═══════════════════════════════════════════════════════════════════
const TYPE_COLOR = {
  milestone: "#FFE566",
  education: "#A8FF3E",
  project: "#7EB8FF",
  goal: "#FF8C6B",
  future: "#555550",
};

function useInView() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function NodeContent({ item, color }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.55 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.16em", color, opacity: 0.9 }}>
          {item.season} {item.year}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, padding: "2px 7px", borderRadius: 10,
          border: `1px solid ${color}35`, background: `${color}10`, color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {item.type}
        </span>
      </div>
      <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 7 }}>
        {item.title}
      </h4>
      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: "var(--muted)", lineHeight: 1.65 }}>
        {item.description}
      </p>
    </div>
  );
}

function TimelineNode({ item, index }) {
  const [ref, vis] = useInView();
  const color = TYPE_COLOR[item.type] || "#FFE566";
  const isLeft = item.side === "left";

  return (
    <div ref={ref} className={`timeline-node ${vis ? "visible" : "hidden"}`}
      style={{ transitionDelay: `${index * 0.11}s`, display: "grid", gridTemplateColumns: "1fr 72px 1fr", marginBottom: 44 }}>
      <div style={{ paddingRight: 28, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        {isLeft && <NodeContent item={item} color={color} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: color,
          border: "2px solid var(--bg)", boxShadow: `0 0 0 4px ${color}22, 0 0 18px ${color}44`, zIndex: 1, flexShrink: 0 }} />
      </div>
      <div style={{ paddingLeft: 28, display: "flex", alignItems: "center" }}>
        {!isLeft && <NodeContent item={item} color={color} />}
      </div>
    </div>
  );
}

function RoadmapTab() {
  const containerRef = useRef(null);
  const [height, setHeight] = useState(1800);

  useEffect(() => {
    const update = () => containerRef.current && setHeight(containerRef.current.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="tab-enter" style={{ paddingTop: 64 }}>
      <section style={{ padding: "72px 40px 110px", maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.22em", color: "var(--muted)", marginBottom: 12 }}>— CHRONOLOGICAL ARCHITECTURE</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)", color: "var(--text)", lineHeight: 1.1 }}>
            The roadmap ahead.
          </h2>
        </div>

        <div ref={containerRef} style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-1px)",
            width: 2, height: height, pointerEvents: "none", zIndex: 0, overflow: "visible" }}>
            <defs>
              <linearGradient id="tlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE566" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#A8FF3E" stopOpacity="0.6" />
                <stop offset="75%" stopColor="#7EB8FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#555550" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <line x1="1" y1="0" x2="1" y2={height} stroke="url(#tlGrad)" strokeWidth="2"
              style={{ strokeDasharray: height, strokeDashoffset: height,
                animation: "drawLine 3.5s cubic-bezier(0.22,1,0.36,1) 0.3s forwards" }} />
          </svg>

          {DATA.roadmap.map((item, i) => <TimelineNode key={item.id} item={item} index={i} />)}
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", marginTop: 48,
          padding: "20px 28px", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)" }}>
          {Object.entries(TYPE_COLOR).map(([type, color]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase" }}>
                {type}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  CONTACT TAB
// ═══════════════════════════════════════════════════════════════════
function Toast({ msg, visible }) {
  return (
    <div style={{ position: "fixed", bottom: 28, left: "50%",
      background: "rgba(8,8,8,0.92)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255,229,102,0.3)", borderRadius: 50,
      padding: "11px 22px", fontFamily: "'DM Mono', monospace", fontSize: 10,
      letterSpacing: "0.1em", color: "var(--accent)", zIndex: 200, pointerEvents: "none",
      display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
      boxShadow: "0 8px 32px rgba(255,229,102,0.12)",
      animation: `${visible ? "toastIn" : "toastOut"} 0.3s cubic-bezier(0.22,1,0.36,1) forwards` }}>
      <span style={{ fontSize: 13 }}>✓</span> {msg}
    </div>
  );
}

function ContactTab() {
  const [toast, setToast] = useState(null);
  const [toastVis, setToastVis] = useState(false);

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label} copied to clipboard`);
      setToastVis(true);
      setTimeout(() => { setToastVis(false); setTimeout(() => setToast(null), 350); }, 2600);
    } catch (_) {}
  };

  return (
    <div className="tab-enter" style={{ paddingTop: 64 }}>
      <section style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "72px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 40%, rgba(255,229,102,0.04) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,229,102,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,229,102,0.018) 1px, transparent 1px)",
          backgroundSize: "64px 64px" }} />

        <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.22em", color: "var(--muted)", marginBottom: 14 }}>
              — GET IN TOUCH
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(54px, 10vw, 108px)",
              letterSpacing: "0.03em", color: "var(--text)", lineHeight: 0.88, marginBottom: 18 }}>
              Let's<br />Connect
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.75 }}>
              Open to co-ops, internships, and conversations about hardware.<br />
              <span style={{ color: "var(--accent)", opacity: 0.7 }}>Click any field to copy.</span>
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 24, padding: 10,
            boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            {[
              { icon: "✉", label: "EMAIL", value: DATA.identity.email, accent: "var(--accent)", iconBg: "rgba(255,229,102,0.08)", copyLabel: "Email", r: "14px 14px 8px 8px" },
              { icon: "☎", label: "PHONE", value: DATA.identity.phone, accent: "var(--green)", iconBg: "rgba(168,255,62,0.07)", copyLabel: "Phone", r: "8px 8px 14px 14px" },
            ].map(c => (
              <div key={c.label} className="copy-row" style={{ borderRadius: c.r }} onClick={() => copy(c.value, c.copyLabel)}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: c.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.18em", color: "var(--muted)", marginBottom: 4 }}>
                    {c.label}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                    {c.value}
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.12em", color: c.accent, opacity: 0.55, paddingRight: 4 }}>
                  COPY
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 28, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.12em", color: "var(--muted)", lineHeight: 2.2 }}>
            <div>{DATA.identity.university} · {DATA.identity.major}</div>
            <div style={{ color: "var(--accent)", opacity: 0.55 }}>↳ {DATA.identity.status}</div>
          </div>
        </div>
      </section>
      {toast && <Toast msg={toast} visible={toastVis} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("home");
  const [key, setKey] = useState(0);

  const changeTab = (t) => {
    if (t === tab) return;
    setTab(t);
    setKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const views = {
    home: <HomeTab />,
    projects: <ProjectsTab />,
    roadmap: <RoadmapTab />,
    contact: <ContactTab />,
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'Syne', sans-serif", position: "relative" }}>
      <GlobalStyles />
      {/* Film-grain noise overlay */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "180px 180px" }} />
      <Navbar active={tab} onChange={changeTab} />
      <main key={key}>{views[tab]}</main>
    </div>
  );
}
