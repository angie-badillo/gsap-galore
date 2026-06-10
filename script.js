/* ============================================================
   GSAP Galore — animated demos for each GSAP tool.
   Plugins reliably loaded from cdnjs (ScrollTrigger, MotionPath,
   Draggable, Flip). The club plugins' effects (DrawSVG, MorphSVG,
   SplitText, ScrambleText) are recreated with core GSAP so the
   page works entirely from one CDN.
   ============================================================ */
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, Draggable, Flip);

const SVGNS = "http://www.w3.org/2000/svg";
const COLORS = ["#0ae448", "#9b5cff", "#27c1ff", "#ff5da2"];

/* Each demo is a factory: given its card root it returns a
   `play()` function. The returned function (re)starts the demo. */
const demos = {

    /* ---------- Tween ---------- */
    tween(root) {
        const box = root.querySelector(".js-box");
        const tl = gsap.timeline({ paused: true });
        tl.to(box, { x: 110, rotation: 180, duration: 0.9, ease: "power2.inOut" })
          .to(box, { scale: 1.5, fill: "#9b5cff", transformOrigin: "50% 50%", duration: 0.6 })
          .to(box, { x: 0, rotation: 360, scale: 1, fill: "#0ae448", duration: 0.9, ease: "back.inOut(1.6)" });
        return () => tl.restart();
    },

    /* ---------- Timeline ---------- */
    timeline(root) {
        const bars = root.querySelectorAll(".bar");
        const ball = root.querySelector(".ball");
        const tl = gsap.timeline({ paused: true });
        tl.to(bars, {
            attr: { height: (i) => 40 + i * 30, y: (i) => 180 - (40 + i * 30) },
            duration: 0.5, ease: "power3.out", stagger: 0.15
        })
        .from(ball, { cy: 40, scale: 0, transformOrigin: "50% 50%", duration: 0.4 }, "<")
        .to(ball, { cy: 165, duration: 0.7, ease: "bounce.out" });
        return () => {
            gsap.set(bars, { attr: { height: 0, y: 180 } });
            tl.restart();
        };
    },

    /* ---------- Stagger ---------- */
    stagger(root) {
        const svg = root.querySelector(".js-grid");
        const cols = 6, rows = 6, gap = 30, start = 25;
        if (!svg.childNodes.length) {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const dot = document.createElementNS(SVGNS, "circle");
                    dot.setAttribute("cx", start + c * gap);
                    dot.setAttribute("cy", start + r * gap);
                    dot.setAttribute("r", 8);
                    dot.setAttribute("fill", "#0ae448");
                    svg.appendChild(dot);
                }
            }
        }
        const dots = svg.querySelectorAll("circle");
        return () => gsap.fromTo(dots,
            { scale: 0.2, transformOrigin: "50% 50%", opacity: 0.3 },
            {
                scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)",
                stagger: { each: 0.05, grid: [rows, cols], from: "center" },
                yoyo: true, repeat: 1
            });
    },

    /* ---------- Eases ---------- */
    eases(root) {
        const g = root.querySelector(".js-ease-rows");
        const eases = [
            ["none", "linear"], ["power3.out", "power"],
            ["back.out(2)", "back"], ["elastic.out(1,0.4)", "elastic"],
            ["bounce.out", "bounce"]
        ];
        if (!g.childNodes.length) {
            eases.forEach((_, i) => {
                const y = 30 + i * 38;
                const track = document.createElementNS(SVGNS, "line");
                track.setAttribute("x1", 30); track.setAttribute("y1", y);
                track.setAttribute("x2", 190); track.setAttribute("y2", y);
                track.setAttribute("stroke", "#2a342f"); track.setAttribute("stroke-width", 2);
                g.appendChild(track);
                const dot = document.createElementNS(SVGNS, "circle");
                dot.setAttribute("cx", 30); dot.setAttribute("cy", y);
                dot.setAttribute("r", 9); dot.setAttribute("fill", COLORS[i % COLORS.length]);
                dot.classList.add("js-ease-dot");
                g.appendChild(dot);
            });
        }
        const dots = g.querySelectorAll(".js-ease-dot");
        return () => dots.forEach((dot, i) => {
            gsap.fromTo(dot, { attr: { cx: 30 } },
                { attr: { cx: 190 }, duration: 1.6, ease: eases[i][0] });
        });
    },

    /* ---------- ScrollTrigger ---------- */
    scrolltrigger(root) {
        const shapes = root.querySelectorAll(".st-shape");
        gsap.fromTo(shapes,
            { y: 70, rotation: -45, opacity: 0, transformOrigin: "50% 50%" },
            {
                y: 0, rotation: 0, opacity: 1, stagger: 0.2,
                scrollTrigger: {
                    trigger: root,
                    start: "top 85%",
                    end: "center 40%",
                    scrub: true
                }
            });
        return null; // driven by scroll, no replay button
    },

    /* ---------- DrawSVG ---------- */
    drawsvg(root) {
        const lines = root.querySelectorAll(".draw-line");
        // pathLength=1 lets us use a normalized dash for any shape.
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        const tl = gsap.timeline({ paused: true });
        tl.to(lines, { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut", stagger: 0.5 });
        return () => {
            gsap.set(lines, { strokeDashoffset: 1 });
            tl.restart();
        };
    },

    /* ---------- MorphSVG ---------- */
    morphsvg(root) {
        const poly = root.querySelector(".js-morph");
        // 10-point star (initial) and a 10-point rounded blob — same point count
        // so GSAP can interpolate the `points` attribute numerically.
        const star = "110,40 130,90 184,90 140,124 156,178 110,146 64,178 80,124 36,90 90,90";
        const blob = "110,46 138,58 172,70 168,108 178,150 138,160 110,176 78,158 44,150 56,96";
        return () => {
            gsap.fromTo(poly,
                { attr: { points: star }, fill: "#9b5cff" },
                { attr: { points: blob }, fill: "#27c1ff", duration: 1, ease: "power2.inOut",
                  yoyo: true, repeat: 1 });
        };
    },

    /* ---------- MotionPath ---------- */
    motionpath(root) {
        const rocket = root.querySelector(".js-rocket");
        const tl = gsap.timeline({ paused: true });
        tl.to(rocket, {
            duration: 2.4, ease: "power1.inOut",
            motionPath: { path: "#mp-path", align: "#mp-path", alignOrigin: [0.5, 0.5], autoRotate: true }
        });
        return () => tl.restart();
    },

    /* ---------- SplitText ---------- */
    splittext(root) {
        const el = root.querySelector(".js-split");
        if (!el.dataset.split) {
            const text = el.textContent;
            el.textContent = "";
            [...text].forEach((ch) => {
                const span = document.createElement("span");
                span.className = "char";
                span.textContent = ch;
                el.appendChild(span);
            });
            el.dataset.split = "1";
        }
        const chars = el.querySelectorAll(".char");
        return () => gsap.fromTo(chars,
            { y: 40, opacity: 0, rotateX: -90 },
            { y: 0, opacity: 1, rotateX: 0, duration: 0.6, ease: "back.out(1.7)", stagger: 0.08 });
    },

    /* ---------- ScrambleText ---------- */
    scramble(root) {
        const el = root.querySelector(".js-scramble");
        const target = el.textContent.replace(/ /g, " "); // "GSAP ROCKS"
        const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@*";
        return () => {
            const state = { p: 0 };
            gsap.to(state, {
                p: 1, duration: 1.6, ease: "power1.inOut",
                onUpdate() {
                    const revealed = Math.floor(state.p * target.length);
                    let out = "";
                    for (let i = 0; i < target.length; i++) {
                        if (target[i] === " ") { out += " "; continue; }
                        out += i < revealed
                            ? target[i]
                            : glyphs[Math.floor((state.p * 97 + i * 13) % glyphs.length)];
                    }
                    el.textContent = out;
                },
                onComplete() { el.textContent = target.replace(/ /g, " "); }
            });
        };
    },

    /* ---------- Draggable ---------- */
    draggable(root) {
        const handle = root.querySelector(".js-drag");
        Draggable.create(handle, {
            bounds: root.querySelector(".drag-stage"),
            inertia: false,
            onDragStart() { gsap.to(handle, { scale: 1.12, duration: 0.2 }); },
            onDragEnd()   { gsap.to(handle, { scale: 1, duration: 0.3, ease: "back.out(2)" }); }
        });
        return null;
    },

    /* ---------- Flip ---------- */
    flip(root) {
        const stage = root.querySelector(".js-flip");
        const items = () => Array.from(stage.children);
        return () => {
            const state = Flip.getState(items());
            // shuffle DOM order (Fisher–Yates) then re-append
            const shuffled = items();
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            shuffled.forEach((el) => stage.appendChild(el));
            Flip.from(state, { duration: 0.7, ease: "power2.inOut", absolute: true });
        };
    }
};

/* ---------- Wire everything up ---------- */
document.querySelectorAll(".tool").forEach((root) => {
    const name = root.dataset.demo;
    const factory = demos[name];
    if (!factory) return;

    const play = factory(root);
    if (!play) return; // self-driven demos (scroll / drag)

    // Replay button
    const btn = root.querySelector(".replay");
    if (btn) btn.addEventListener("click", play);

    // Auto-play once when the card scrolls into view
    ScrollTrigger.create({
        trigger: root,
        start: "top 80%",
        once: true,
        onEnter: play
    });
});

/* Hero intro */
gsap.from(".hero__title .line", {
    y: 60, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.15
});
gsap.from(".hero__lead, .cta, .eyebrow", {
    y: 20, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.1, delay: 0.3
});
