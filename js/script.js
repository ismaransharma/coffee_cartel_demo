document.getElementById('current-year').textContent = new Date().getFullYear();


gsap.registerPlugin(ScrollTrigger);

const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX - 7, y: e.clientY - 7, duration: 0.1, ease: "power2.out" });
    gsap.to(cursorRing, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.2, ease: "power2.out" });
});

let progress = 0;
const fill = document.getElementById('liquid');
const loadingInterval = setInterval(() => {
    progress += Math.random() * 8;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        setTimeout(finishLoading, 300);
    }
    fill.style.height = progress + '%';
}, 40);

function finishLoading() {
    const tl = gsap.timeline();
    tl.to("#loader", {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => document.getElementById('loader').style.display = 'none'
    })
        .from(".hero-fade", { y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.4");
}

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.height = scrolled + "%";
    document.getElementById('scroll-label').innerText = Math.round(scrolled).toString().padStart(2, '0') + "%";
});

document.querySelectorAll('.parallax-text').forEach(text => {
    const speed = parseFloat(text.getAttribute('data-speed'));
    gsap.to(text, {
        y: -100 * speed,
        scrollTrigger: { trigger: text, start: "top bottom", end: "bottom top", scrub: 1.5 }
    });
});

gsap.utils.toArray(".reveal-frame").forEach(frame => {
    ScrollTrigger.create({
        trigger: frame,
        start: "top 80%",
        onEnter: () => frame.classList.add("active")
    });
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

gsap.utils.toArray('.stat-number').forEach(stat => {
    ScrollTrigger.create({
        trigger: stat,
        start: "top 85%",
        onEnter: () => {
            gsap.from(stat, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" });
        }
    });
});

document.querySelectorAll('a, button, .coffee-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2, backgroundColor: "transparent", border: "2px solid #C9A961", duration: 0.3 });
        gsap.to(cursorRing, { scale: 1.5, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, backgroundColor: "#C9A961", border: "none", duration: 0.3 });
        gsap.to(cursorRing, { scale: 1, duration: 0.3 });
    });
});

document.querySelectorAll('.coffee-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        gsap.to(card, { rotateX, rotateY, duration: 0.3, ease: "power2.out" });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
    });
});