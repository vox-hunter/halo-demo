// ===== GSAP INITIALIZATION =====
gsap.registerPlugin(ScrollTrigger);

// ===== PARALLAX PETALS ANIMATION =====
const initParallaxPetals = () => {
    const petals = document.querySelectorAll('.petal');
    
    petals.forEach((petal, index) => {
        const speed = 0.3 + (index * 0.15);
        const rotation = Math.random() * 360;
        
        // Initial animation
        gsap.from(petal, {
            opacity: 0,
            scale: 0,
            rotation: rotation,
            duration: 2,
            delay: index * 0.2,
            ease: 'power2.out'
        });
        
        // Parallax scroll effect
        gsap.to(petal, {
            y: () => window.innerHeight * speed,
            rotation: rotation + 180,
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
        
        // Floating animation
        gsap.to(petal, {
            x: '+=30',
            y: '+=20',
            duration: 3 + (index * 0.5),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
};

// ===== HERO SECTION ANIMATIONS =====
const initHeroAnimations = () => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Animate title lines
    timeline.to('.title-line', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2
    });
    
    // Animate subtitle
    timeline.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.6');
    
    // Animate product info cards
    timeline.to('.product-info', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.4');
    
    // Animate CTA button
    timeline.to('.cta-button', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.4');
    
    // Animate product image
    timeline.to('.product-image-container', {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'back.out(1.2)'
    }, '-=1');
};

// ===== PRODUCT IMAGE HOVER RIPPLE EFFECT =====
const initRippleEffect = () => {
    const productContainer = document.querySelector('.product-image-container');
    const ripple = document.querySelector('.ripple-effect');
    
    if (!productContainer || !ripple) return;
    
    productContainer.addEventListener('mouseenter', () => {
        gsap.fromTo(ripple,
            { opacity: 0, scale: 0.5 },
            {
                opacity: 1,
                scale: 1.5,
                duration: 1.2,
                ease: 'power2.out'
            }
        );
    });
    
    productContainer.addEventListener('mouseleave', () => {
        gsap.to(ripple, {
            opacity: 0,
            scale: 0.5,
            duration: 0.6,
            ease: 'power2.in'
        });
    });
};

// ===== FEATURE CARDS SCROLL ANIMATION =====
const initFeatureCards = () => {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            },
            delay: index * 0.15
        });
    });
};

// ===== COMPOSITION SECTION ANIMATIONS =====
const initCompositionAnimations = () => {
    const compositionImage = document.querySelector('.composition-image');
    const compositionRight = document.querySelector('.composition-right');
    
    if (compositionImage) {
        gsap.to(compositionImage, {
            opacity: 1,
            x: 0,
            duration: 1.2,
            scrollTrigger: {
                trigger: compositionImage,
                start: 'top 75%',
                end: 'top 40%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    if (compositionRight) {
        gsap.to(compositionRight, {
            opacity: 1,
            x: 0,
            duration: 1.2,
            scrollTrigger: {
                trigger: compositionRight,
                start: 'top 75%',
                end: 'top 40%',
                toggleActions: 'play none none reverse'
            },
            delay: 0.3
        });
    }
};

// ===== FINAL CTA ANIMATION =====
const initFinalCTA = () => {
    const ctaContent = document.querySelector('.final-cta-content');
    
    if (ctaContent) {
        gsap.to(ctaContent, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            scrollTrigger: {
                trigger: ctaContent,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    }
};

// ===== PARALLAX BACKGROUND TEXT =====
const initParallaxBackground = () => {
    const bgText = document.querySelector('.hero-background-text');
    
    if (bgText) {
        gsap.to(bgText, {
            y: () => window.innerHeight * 0.3,
            opacity: 0.5,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
};

// ===== SMOOTH SCROLL FOR NAVIGATION =====
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });
};

// ===== NAVBAR SCROLL EFFECT =====
const initNavbarScroll = () => {
    const nav = document.querySelector('.nav');
    
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
            className: 'nav-scrolled',
            targets: nav
        }
    });
};

// ===== INFO CARDS HOVER EFFECT =====
const initInfoCardsHover = () => {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
};

// ===== CTA BUTTON HOVER EFFECT =====
const initCTAHover = () => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                boxShadow: '0 15px 50px rgba(74, 93, 35, 0.4)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                boxShadow: '0 10px 40px rgba(74, 93, 35, 0.3)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('click', () => {
            gsap.fromTo(button,
                { scale: 0.95 },
                {
                    scale: 1.05,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                }
            );
        });
    });
};

// ===== PRODUCT IMAGE PARALLAX =====
const initProductParallax = () => {
    const productImage = document.querySelector('.product-image');
    
    if (productImage) {
        gsap.to(productImage, {
            y: () => -100,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
};

// ===== INITIALIZE ALL ANIMATIONS =====
const init = () => {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    // Initialize all animation modules
    initParallaxPetals();
    initHeroAnimations();
    initRippleEffect();
    initFeatureCards();
    initCompositionAnimations();
    initFinalCTA();
    initParallaxBackground();
    initSmoothScroll();
    initNavbarScroll();
    initInfoCardsHover();
    initCTAHover();
    initProductParallax();
    
    // Refresh ScrollTrigger after all animations are set up
    ScrollTrigger.refresh();
};

// Start initialization
init();

// ===== SCROLL PROGRESS INDICATOR (OPTIONAL) =====
const initScrollProgress = () => {
    gsap.to('progress', {
        value: 100,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });
};

// ===== PERFORMANCE OPTIMIZATION =====
// Reduce animations on mobile for better performance
const isMobile = window.innerWidth < 768;
if (isMobile) {
    // Disable some heavy animations on mobile
    gsap.globalTimeline.timeScale(1.5); // Speed up animations
}

// ===== WINDOW RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ===== CONSOLE LOG =====
console.log('%c Airy - Vanilla Orchid Landing Page ', 'background: #4A5D23; color: #FDF5E6; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('%c Design by Airy | Powered by GSAP ', 'background: #E9FFDB; color: #4A5D23; padding: 5px; font-size: 12px;');
