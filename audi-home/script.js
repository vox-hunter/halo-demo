/* ================================================================
   VORSPRUNG NOIR - Audi Landing Page
   JavaScript Animations & Interactions
   ================================================================ */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------
const CONFIG = {
    easing: {
        smooth: "power3.out",
        expo: "expo.out",
        bounce: "back.out(1.7)"
    },
    duration: {
        fast: 0.3,
        medium: 0.6,
        slow: 1.2
    }
};

// ----------------------------------------------------------------
// Cursor Spotlight
// ----------------------------------------------------------------
class CursorSpotlight {
    constructor() {
        this.cursor = document.querySelector('.cursor-spotlight');
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.currentX = this.mouseX;
        this.currentY = this.mouseY;
        
        this.init();
    }
    
    init() {
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Update car lighting overlay
            this.updateCarLighting(e);
        });
        
        // Smooth animation loop
        this.animate();
    }
    
    animate() {
        // Lerp for smooth following
        const lerp = 0.1;
        this.currentX += (this.mouseX - this.currentX) * lerp;
        this.currentY += (this.mouseY - this.currentY) * lerp;
        
        if (this.cursor) {
            this.cursor.style.left = `${this.currentX}px`;
            this.cursor.style.top = `${this.currentY}px`;
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateCarLighting(e) {
        const carContainer = document.querySelector('.car-reveal');
        if (!carContainer) return;
        
        const rect = carContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const overlay = carContainer.querySelector('.car-lighting-overlay');
        if (overlay) {
            overlay.style.setProperty('--mouse-x', `${x}%`);
            overlay.style.setProperty('--mouse-y', `${y}%`);
        }
    }
}

// ----------------------------------------------------------------
// Hero Animations
// ----------------------------------------------------------------
class HeroAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Main timeline
        const heroTl = gsap.timeline({
            defaults: { ease: CONFIG.easing.expo }
        });
        
        // Scan line effect
        heroTl.to('.scan-line', {
            opacity: 1,
            duration: 0.1
        });
        
        // Car reveal
        heroTl.from('.hero-car-image', {
            scale: 1.1,
            opacity: 0,
            filter: 'brightness(0) contrast(1.5)',
            duration: 2,
            ease: "power2.out"
        }, "-=0.5");
        
        // Tagline
        heroTl.to('.hero-tagline', {
            opacity: 1,
            y: 0,
            duration: CONFIG.duration.medium
        }, "-=1");
        
        // Title lines
        heroTl.to('.title-line', {
            opacity: 1,
            y: 0,
            duration: CONFIG.duration.slow,
            stagger: 0.2,
            ease: CONFIG.easing.expo
        }, "-=0.8");
        
        // Description
        heroTl.to('.hero-description', {
            opacity: 1,
            y: 0,
            duration: CONFIG.duration.medium
        }, "-=0.6");
        
        // CTA buttons
        heroTl.to('.hero-cta-group', {
            opacity: 1,
            y: 0,
            duration: CONFIG.duration.medium
        }, "-=0.4");
        
        // Scroll indicator
        heroTl.to('.scroll-indicator', {
            opacity: 1,
            duration: CONFIG.duration.medium
        }, "-=0.2");
        
        // Floating specs with counter animation
        heroTl.to('.spec-item', {
            opacity: 1,
            x: 0,
            duration: CONFIG.duration.medium,
            stagger: 0.15,
            onStart: () => this.animateNumbers()
        }, "-=0.8");
    }
    
    animateNumbers() {
        document.querySelectorAll('.spec-number').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const isDecimal = target % 1 !== 0;
            
            gsap.to(el, {
                innerHTML: target,
                duration: 2,
                ease: "power2.out",
                snap: { innerHTML: isDecimal ? 0.1 : 1 },
                modifiers: {
                    innerHTML: (val) => isDecimal ? parseFloat(val).toFixed(1) : Math.round(val)
                }
            });
        });
    }
}

// ----------------------------------------------------------------
// Scroll Animations
// ----------------------------------------------------------------
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.progressBar();
        this.revealElements();
        this.parallaxEffects();
        this.sectionTitles();
        this.carRotation();
        this.navigationScroll();
        this.backToTop();
    }
    
    progressBar() {
        gsap.to('.progress-bar', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }
    
    revealElements() {
        // Batch process scroll reveals
        ScrollTrigger.batch('.scroll-reveal', {
            onEnter: (elements) => {
                gsap.fromTo(elements, 
                    { 
                        y: 60, 
                        opacity: 0,
                        scale: 0.98
                    },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: CONFIG.easing.expo,
                        onComplete: function() {
                            // Add class to maintain visible state, remove initial hidden class behavior
                            this.targets().forEach(el => el.classList.add('revealed'));
                        }
                    }
                );
            },
            start: 'top 85%',
            once: true
        });
    }
    
    parallaxEffects() {
        gsap.utils.toArray('.parallax').forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.3;
            
            gsap.to(element, {
                yPercent: -30 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: element.closest('section') || element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }
    
    sectionTitles() {
        gsap.utils.toArray('.section-title-large').forEach(title => {
            const words = title.querySelectorAll('.word');
            
            gsap.fromTo(words,
                {
                    y: 40,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: CONFIG.easing.expo,
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 80%',
                        once: true
                    }
                }
            );
        });
    }
    
    carRotation() {
        const carReveal = document.querySelector('.car-reveal');
        if (!carReveal) return;
        
        // Subtle rotation on scroll
        gsap.to(carReveal, {
            rotationY: 5,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
    
    navigationScroll() {
        const header = document.querySelector('.nav-header');
        
        ScrollTrigger.create({
            start: 'top -100',
            onUpdate: (self) => {
                if (self.direction === 1 && self.progress > 0.05) {
                    header.classList.add('scrolled');
                } else if (self.direction === -1 && self.progress < 0.05) {
                    header.classList.remove('scrolled');
                }
            }
        });
    }
    
    backToTop() {
        const btn = document.querySelector('.back-to-top');
        
        ScrollTrigger.create({
            start: 'top -500',
            onEnter: () => btn.classList.add('visible'),
            onLeaveBack: () => btn.classList.remove('visible')
        });
        
        btn.addEventListener('click', () => {
            gsap.to(window, {
                scrollTo: 0,
                duration: 1.5,
                ease: CONFIG.easing.expo
            });
        });
    }
}

// ----------------------------------------------------------------
// Category Cards Hover Effects
// ----------------------------------------------------------------
class CardInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        // Innovation cards
        this.setupCardHovers('.innovation-card');
        this.setupCardHovers('.category-card');
        this.setupCardHovers('.careers-card');
        this.setupCardHovers('.press-card');
    }
    
    setupCardHovers(selector) {
        document.querySelectorAll(selector).forEach(card => {
            const image = card.querySelector('img');
            
            card.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.08,
                    duration: 0.6,
                    ease: CONFIG.easing.expo
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.6,
                    ease: CONFIG.easing.expo
                });
            });
            
            // Tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: CONFIG.easing.expo
                });
            });
        });
    }
}

// ----------------------------------------------------------------
// Smooth Scroll Navigation
// ----------------------------------------------------------------
class SmoothNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    gsap.to(window, {
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        duration: 1.2,
                        ease: CONFIG.easing.expo
                    });
                }
            });
        });
    }
}

// ----------------------------------------------------------------
// F1 Section Special Effects
// ----------------------------------------------------------------
class F1Section {
    constructor() {
        this.init();
    }
    
    init() {
        const section = document.querySelector('.f1-section');
        if (!section) return;
        
        // Background parallax
        gsap.to('.f1-section .section-bg-image', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.f1-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
        
        // Content reveal
        const f1Tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.f1-section',
                start: 'top 60%',
                once: true
            }
        });
        
        f1Tl.from('.f1-badge', {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: CONFIG.easing.bounce
        })
        .from('.f1-content .section-title', {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: CONFIG.easing.expo
        }, '-=0.2')
        .from('.f1-content .section-subtitle', {
            y: 40,
            opacity: 0,
            duration: 0.6
        }, '-=0.4')
        .from('.f1-content .btn-primary', {
            y: 30,
            opacity: 0,
            duration: 0.5
        }, '-=0.3')
        .from('.racing-stats', {
            x: -50,
            opacity: 0,
            duration: 0.6
        }, '-=0.4');
    }
}

// ----------------------------------------------------------------
// E-Mobility Section
// ----------------------------------------------------------------
class EMobilitySection {
    constructor() {
        this.init();
    }
    
    init() {
        const section = document.querySelector('.emobility-section');
        if (!section) return;
        
        // Image glow pulse
        gsap.to('.image-glow', {
            opacity: 0.6,
            scale: 1.1,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        
        // Stats counter animation
        ScrollTrigger.create({
            trigger: '.emobility-stats',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.from('.estat', {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: CONFIG.easing.expo
                });
            }
        });
    }
}

// ----------------------------------------------------------------
// Button Interactions
// ----------------------------------------------------------------
class ButtonEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Primary buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: CONFIG.easing.smooth
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: CONFIG.easing.smooth
                });
            });
            
            btn.addEventListener('mousedown', () => {
                gsap.to(btn, {
                    scale: 0.98,
                    duration: 0.1
                });
            });
            
            btn.addEventListener('mouseup', () => {
                gsap.to(btn, {
                    scale: 1.02,
                    duration: 0.2
                });
            });
        });
        
        // Ghost buttons
        document.querySelectorAll('.btn-ghost').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: CONFIG.easing.smooth
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: CONFIG.easing.smooth
                });
            });
        });
    }
}

// ----------------------------------------------------------------
// Navigation Links Hover Effects
// ----------------------------------------------------------------
class NavEffects {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    y: -2,
                    duration: 0.3,
                    ease: CONFIG.easing.smooth
                });
            });
            
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    y: 0,
                    duration: 0.3,
                    ease: CONFIG.easing.smooth
                });
            });
        });
    }
}

// ----------------------------------------------------------------
// Preloader (Optional)
// ----------------------------------------------------------------
class Preloader {
    constructor() {
        // Skip preloader for now - direct reveal
        document.body.style.opacity = '1';
    }
}

// ----------------------------------------------------------------
// Initialize All Modules
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Initialize cursor spotlight (desktop only)
        if (window.innerWidth > 992) {
            new CursorSpotlight();
        }
        
        // Initialize animations
        new Preloader();
        new HeroAnimations();
        new ScrollAnimations();
        new CardInteractions();
        new SmoothNavigation();
        new F1Section();
        new EMobilitySection();
        new ButtonEffects();
        new NavEffects();
    } else {
        // Reduced motion: show everything immediately
        gsap.set([
            '.hero-tagline',
            '.title-line',
            '.hero-description',
            '.hero-cta-group',
            '.scroll-indicator',
            '.spec-item',
            '.scroll-reveal',
            '.section-title-large .word'
        ], {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1
        });
    }
    
    // Refresh ScrollTrigger after images load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});

// ----------------------------------------------------------------
// Resize Handler
// ----------------------------------------------------------------
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ----------------------------------------------------------------
// Sound Toggle (Placeholder)
// ----------------------------------------------------------------
const soundToggle = document.querySelector('.sound-toggle');
if (soundToggle) {
    let soundEnabled = false;
    
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.classList.toggle('active', soundEnabled);
        
        // Sound toggle visual feedback
        const waves = soundToggle.querySelector('.sound-waves');
        if (waves) {
            waves.style.opacity = soundEnabled ? '1' : '0.3';
        }
        
        // Here you would initialize/toggle audio
        console.log(`Sound ${soundEnabled ? 'enabled' : 'disabled'}`);
    });
}

// ----------------------------------------------------------------
// Console Signature
// ----------------------------------------------------------------
console.log(`
%c ████████████████████████████████████████████
%c     AUDI - VORSPRUNG DURCH TECHNIK
%c     Vorsprung Noir Landing Experience
%c ████████████████████████████████████████████
`, 
'color: #FF3B30; font-weight: bold;',
'color: #E0E0E0; font-weight: bold;',
'color: #00B0F0;',
'color: #FF3B30; font-weight: bold;'
);
