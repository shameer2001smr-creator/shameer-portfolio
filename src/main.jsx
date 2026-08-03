import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';
import {
  ArrowDown, ArrowUpRight, Check, Mail, Phone, Sparkles,
  Compass, Clapperboard, Megaphone, PenTool, Layers, Aperture
} from 'lucide-react';
import './styles.css';

/* ---------------- content ---------------- */
const services = [
  ['01', 'Creative Direction', 'Concept development, visual direction and campaign ideas shaped into a single coherent story.', Compass],
  ['02', 'Video Editing & Post', 'Cinematic edits, reels, colour grading and motion graphics that hold attention frame to frame.', Clapperboard],
  ['03', 'Digital Marketing', 'Social strategy, campaign planning and audience research built around what actually converts.', Megaphone],
  ['04', 'Content Creation', 'Social creatives, posters and short-form content designed to be shared, not scrolled past.', PenTool],
  ['05', 'Graphic & Visual Design', 'Posters, ad creatives, thumbnails and branding material with a consistent visual language.', Layers],
  ['06', 'Freelance Creative Services', 'Flexible end-to-end support, from a single creative to a full campaign build-out.', Aperture],
];
const skills = ['Creative Direction','Video Editing','Digital Marketing','Content Creation','Graphic Design','Social Media Marketing','Visual Storytelling','Brand Development','Content Strategy','Colour Grading','Motion Graphics','AI-Assisted Workflow'];
const process = [
  ['01','Discover','Understand the brand, audience and the real objective.'],
  ['02','Ideate','Develop concepts, references and possible directions.'],
  ['03','Create','Turn the chosen concept into visual content.'],
  ['04','Refine','Polish composition, colour, type and every small detail.'],
  ['05','Deliver','Optimise and hand off for the exact platform.'],
];
const work = [
  ['Brand & Social Media','Campaigns, promotional posters and visual branding built for feed and story alike.'],
  ['Video & Cinematic Content','Reels, advertisements and story-driven edits that carry a brand\u2019s tone.'],
  ['Digital Marketing','Strategies focused on reach, engagement and measurable awareness.'],
  ['Creative Direction','Concept to final frame \u2014 one point of view across the whole output.'],
];
const tools = ['Photoshop','Premiere Pro','After Effects','Illustrator','CorelDRAW','Canva','CapCut','AI Tools'];
const features = [
  ['Strong Concepts','Every project starts with an idea worth building on.'],
  ['Premium Visual Quality','Detail-level polish, not just a finished draft.'],
  ['Purposeful Content','Nothing shipped without a reason behind it.'],
  ['Modern Workflow','AI-assisted where it helps, hand-crafted where it matters.'],
  ['End-to-End Execution','From first sketch to final delivered file.'],
];

/* ---------------- reveal-on-scroll ---------------- */
function Reveal({as: Tag = 'div', className = '', children, ...rest}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } });
    }, {threshold: 0.2});
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <Tag ref={ref} className={'reveal ' + (inView ? 'in ' : '') + className} {...rest}>{children}</Tag>;
}

/* ---------------- animated counter ---------------- */
function Counter({to, suffix = ''}) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const dur = 1200;
          const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      });
    }, {threshold: 0.4});
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ---------------- 3D tilt hook ---------------- */
function useTilt(strength = 10) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(x * strength).toFixed(2)}deg) translateZ(6px)`;
  };
  const onMouseLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'; };
  return {ref, onMouseMove, onMouseLeave};
}

/* ---------------- three.js background scene ---------------- */
function Scene3D() {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 9;
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const colors = [0x7c5cff, 0xffb648, 0x7c5cff];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.IcosahedronGeometry(1.6 - i * 0.35, 0);
      const mat = new THREE.MeshBasicMaterial({color: colors[i], wireframe: true, transparent: true, opacity: 0.32 - i * 0.07});
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
    }

    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.022, transparent: true, opacity: 0.45});
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    let mouseX = 0, mouseY = 0, scrollY = 0;
    const onMove = (e) => { mouseX = e.clientX / window.innerWidth - 0.5; mouseY = e.clientY / window.innerHeight - 0.5; };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll);

    let raf;
    const animate = () => {
      group.children.forEach((m, i) => { m.rotation.x += 0.0011 * (i + 1); m.rotation.y += 0.0017 * (i + 1); });
      points.rotation.y += 0.0004;
      camera.position.x += (mouseX * 1.3 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 1.3 - camera.position.y) * 0.03;
      group.rotation.y = scrollY * 0.0007;
      group.position.y = -scrollY * 0.0012;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return <div ref={mountRef} className="scene3d" />;
}

/* ---------------- app ---------------- */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll); onScroll();
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      {rootMargin: '-40% 0px -50%'}
    );
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s));
    return () => { window.removeEventListener('scroll', onScroll); obs.disconnect(); };
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});

  return (
    <div className="root">
      <Scene3D />
      <div className="grain" />

      <nav className={scrolled ? 'nav scrolled' : 'nav'}>
        <div className="logo" onClick={() => go('home')} style={{cursor: 'pointer'}}>SHAMEER<em>.</em></div>
        <div className="navlinks">
          {[['about', 'About'], ['services', 'Services'], ['work', 'Work'], ['contact', 'Contact']].map(([id, l]) => (
            <button key={id} className={active === id ? 'active' : ''} onClick={() => go(id)}>{l}</button>
          ))}
        </div>
        <button className="navcta" onClick={() => go('contact')}>Let's talk <ArrowUpRight size={15} /></button>
      </nav>

      <section id="home" className="hero">
        <div className="eyebrow"><Sparkles size={13} /> Available for new projects</div>
        <h1>
          <span className="line"><span style={{animationDelay: '.05s'}}>B. Muhammad</span></span>
          <span className="line"><span className="grad" style={{animationDelay: '.18s'}}>Shameer</span></span>
        </h1>
        <p className="roles">
          <b>Creative Direction.</b> <b>Video Editing.</b> <b>Digital Marketing.</b> Freelance creator turning
          ideas into visual experiences worth stopping for.
        </p>
        <div className="ctaRow">
          <button className="btn-primary" onClick={() => go('work')}>See the work <ArrowDown size={16} /></button>
          <button className="btn-ghost" onClick={() => go('contact')}>Start a project</button>
        </div>
        <div className="scrollcue"><span>Scroll</span><div className="stick" /></div>
      </section>

      <section id="about" className="section">
        <Reveal><p className="kicker">About</p></Reveal>
        <Reveal as="h2" className="sec-title">
          One creator, <span className="grad">six disciplines</span>,<br />a single point of view.
        </Reveal>
        <div className="about-grid">
          <Reveal>
            <p className="about-lead">
              My work sits at the intersection of <b>creative direction</b>, <b>video editing</b> and{' '}
              <b>digital marketing</b> — built to help brands and individuals say something people actually
              remember. Every project moves through the same discipline: understand, ideate, create, refine, deliver.
            </p>
            <div className="stat-grid">
              <div className="stat"><div className="num"><Counter to={6} suffix="" /></div><div className="lbl">Core service lines</div></div>
              <div className="stat"><div className="num"><Counter to={12} /></div><div className="lbl">Creative skills</div></div>
              <div className="stat"><div className="num"><Counter to={8} /></div><div className="lbl">Tools mastered</div></div>
              <div className="stat"><div className="num"><Counter to={5} /></div><div className="lbl">Step workflow</div></div>
            </div>
          </Reveal>
          <Reveal>
            <div className="orbitwrap">
              <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
              <img src="/portrait.jpg" alt="B. Muhammad Shameer" />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="services" className="section">
        <Reveal><p className="kicker">What I Do</p></Reveal>
        <Reveal as="h2" className="sec-title">Every discipline,<br /><span className="grad">one workflow.</span></Reveal>
        <div className="svc-list">
          {services.map(([num, title, desc, Icon]) => {
            const tilt = useTilt(4);
            return (
              <Reveal as="div" className="svc-row" key={num} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} ref={tilt.ref}>
                <div className="svc-num">{num}</div>
                <div className="svc-body"><h3>{title}</h3><p>{desc}</p></div>
                <ArrowUpRight className="svc-arrow" size={22} />
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section">
        <Reveal><p className="kicker">Creative Skills</p></Reveal>
        <Reveal as="h2" className="sec-title">Built for modern<br />creative work.</Reveal>
        <Reveal className="tagcloud">
          {skills.map((s) => <span key={s}>{s}</span>)}
        </Reveal>
      </section>

      <section className="section">
        <Reveal><p className="kicker">My Process</p></Reveal>
        <Reveal as="h2" className="sec-title">From first thought<br />to <span className="grad">final frame.</span></Reveal>
        <div className="timeline">
          <div className="tl-track">
            {process.map(([num, title, desc]) => (
              <Reveal className="tl-item" key={num}>
                <div className="tl-dot">{num}</div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="section">
        <Reveal><p className="kicker">Selected Work</p></Reveal>
        <Reveal as="h2" className="sec-title">Ideas, made <span className="grad">visible.</span></Reveal>
        <div className="work-scroller">
          {work.map(([title, desc], i) => {
            const tilt = useTilt(6);
            return (
              <div className="work-card" key={title} ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
                <div className="wnum">0{i + 1}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <div className="work-foot">View direction <ArrowUpRight size={14} /></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <Reveal><p className="kicker">Why Work With Me</p></Reveal>
        <Reveal as="h2" className="sec-title">Creativity + strategy<br />+ <span className="grad">technology.</span></Reveal>
        <div className="feat-grid">
          {features.map(([title, desc]) => (
            <Reveal className="feat" key={title}>
              <div className="ic"><Check size={18} /></div>
              <div><h4>{title}</h4><p>{desc}</p></div>
            </Reveal>
          ))}
        </div>
        <Reveal className="tagcloud" style={{marginTop: 50}}>
          {tools.map((t) => <span key={t}>{t}</span>)}
        </Reveal>
      </section>

      <section className="quote-sec">
        <Reveal as="blockquote">
          <span className="mark">"</span>I don't just create content. I transform ideas into digital experiences.<span className="mark">"</span>
        </Reveal>
        <Reveal as="cite">— B. Muhammad Shameer</Reveal>
      </section>

      <section id="contact" className="section" style={{paddingTop: 0}}>
        <Reveal className="contact-card">
          <p className="kicker" style={{justifyContent: 'center'}}>Available for new projects</p>
          <h2>Let's create<br />something great.</h2>
          <p>Have an idea, a brand or a project in mind? Let's turn it into something people remember.</p>
          <div className="contact-links">
            <a href="mailto:shameer2001smr@gmail.com"><Mail size={16} /> shameer2001smr@gmail.com</a>
            <a href="tel:+916383458200"><Phone size={16} /> +91 63834 58200</a>
          </div>
          <div className="avail-tags">
            {['Freelance Projects', 'Brand Collaborations', 'Creative Direction', 'Video Editing', 'Digital Marketing'].map((x) => <span key={x}>{x}</span>)}
          </div>
        </Reveal>
      </section>

      <footer>
        <div>
          <div className="fb">B. Muhammad Shameer</div>
          <span>Digital Creator · Creative Director · Video Editor · Freelancer</span>
        </div>
        <span>© 2026 Shameer. Crafted with purpose.</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
