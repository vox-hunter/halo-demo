// ===================================
// AIRY - Interactive Experience
// ===================================

// Global State
let quantity = 1;
let scrollPosition = 0;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHero();
    initParallax();
    initProductInteractions();
    initPurchaseControls();
    initScrollAnimations();
});

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const nav = document.getElementById('mainNav');
    
    window.addEventListener('scroll', () => {
        scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===================================
// Hero Section
// ===================================
function initHero() {
    const ctaButton = document.getElementById('ctaButton');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll to purchase section
            const purchaseSection = document.querySelector('.details');
            if (purchaseSection) {
                purchaseSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            
            // Add ripple effect
            createRipple(ctaButton);
        });
    }
}

function createRipple(button) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===================================
// Parallax Effects
// ===================================
function initParallax() {
    const petals = document.querySelectorAll('.petal');
    const heroProduct = document.getElementById('heroProduct');
    const bgText = document.querySelector('.bg-text');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax background petals
        petals.forEach((petal, index) => {
            const speed = (index + 1) * 0.1;
            const yPos = scrolled * speed;
            petal.style.transform = `translateY(${yPos}px)`;
        });
        
        // Hero product parallax
        if (heroProduct) {
            const heroRect = heroProduct.getBoundingClientRect();
            if (heroRect.top < windowHeight && heroRect.bottom > 0) {
                const scrollPercent = (windowHeight - heroRect.top) / windowHeight;
                const translateY = scrollPercent * 50;
                const rotate = scrollPercent * 10;
                heroProduct.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
            }
        }
        
        // Background text parallax
        if (bgText) {
            const bgScrollSpeed = 0.3;
            bgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * bgScrollSpeed}px))`;
        }
    });
}

// ===================================
// Product Interactions
// ===================================
function initProductInteractions() {
    const productContainer = document.querySelector('.product-container');
    const scentRipple = document.getElementById('scentRipple');
    const infoCards = document.querySelectorAll('.info-card');
    
    if (productContainer && scentRipple) {
        // Hover effect - create scent ripple
        productContainer.addEventListener('mouseenter', () => {
            triggerScentRipple();
        });
        
        // Track mouse movement for 3D tilt effect
        productContainer.addEventListener('mousemove', (e) => {
            const rect = productContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            productContainer.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                translateY(-20px)
            `;
        });
        
        productContainer.addEventListener('mouseleave', () => {
            productContainer.style.transform = '';
        });
    }
    
    // Info cards interactive
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.animationPlayState = 'paused';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.animationPlayState = 'running';
        });
    });
}

function triggerScentRipple() {
    const scentRipple = document.getElementById('scentRipple');
    if (scentRipple) {
        scentRipple.classList.remove('active');
        void scentRipple.offsetWidth; // Trigger reflow
        scentRipple.classList.add('active');
        
        setTimeout(() => {
            scentRipple.classList.remove('active');
        }, 2000);
    }
}

// ===================================
// Purchase Controls
// ===================================
function initPurchaseControls() {
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyValue = document.getElementById('qtyValue');
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    const addToCartBtn = document.getElementById('addToCart');
    
    // Quantity controls
    if (qtyMinus && qtyPlus && qtyValue) {
        qtyMinus.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyValue.textContent = quantity;
                animateQuantity(qtyValue);
            }
        });
        
        qtyPlus.addEventListener('click', () => {
            if (quantity < 10) {
                quantity++;
                qtyValue.textContent = quantity;
                animateQuantity(qtyValue);
            }
        });
    }
    
    // Subscribe buttons
    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subscribeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update pricing if subscription selected
            updatePricing(btn.dataset.frequency);
        });
    });
    
    // Add to cart
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCartAnimation(addToCartBtn);
        });
    }
}

function animateQuantity(element) {
    element.style.transform = 'scale(1.3)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

function updatePricing(frequency) {
    const priceAmount = document.querySelector('.price-amount');
    if (priceAmount) {
        if (frequency === 'monthly') {
            // 15% discount
            priceAmount.textContent = '$23.80';
            priceAmount.style.color = 'var(--deep-moss)';
        } else {
            priceAmount.textContent = '$28.00';
        }
    }
}

function addToCartAnimation(button) {
    // Change button state
    const originalText = button.innerHTML;
    button.innerHTML = '<span>✓ Added to Cart</span>';
    button.style.background = 'var(--toasted-pod)';
    
    // Create floating notification
    createFloatingNotification();
    
    // Reset after delay
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = 'var(--deep-moss)';
    }, 2000);
}

function createFloatingNotification() {
    const notification = document.createElement('div');
    notification.classList.add('cart-notification');
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🌸</span>
            <span class="notification-text">Added to your sanctuary</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 1rem 2rem;
        background: rgba(74, 93, 35, 0.95);
        color: var(--vanilla-cream);
        border-radius: 50px;
        font-family: var(--font-sans);
        font-size: 1rem;
        z-index: 10000;
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        box-shadow: 0 10px 40px rgba(74, 93, 35, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 2500);
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll(`
        .story-text,
        .story-visual,
        .note-card,
        .spec-item,
        .purchase-card
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// Dynamic Styles (Animations)
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-icon {
        font-size: 1.5rem;
    }
    
    .qty-value {
        transition: transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(233, 255, 219, 0.5);
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Performance Optimization
// ===================================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScrollEffects();
            ticking = false;
        });
        ticking = true;
    }
});

function handleScrollEffects() {
    // Batch scroll-related calculations here for performance
    scrollPosition = window.scrollY;
}

// ===================================
// Easter Egg: Click on flower center
// ===================================
const centerGlass = document.querySelector('.center-glass');
if (centerGlass) {
    let clickCount = 0;
    centerGlass.addEventListener('click', () => {
        clickCount++;
        triggerScentRipple();
        
        if (clickCount === 5) {
            // Special effect after 5 clicks
            document.body.style.animation = 'vanillaBloom 2s ease-in-out';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes vanillaBloom {
                    0%, 100% { filter: hue-rotate(0deg); }
                    50% { filter: hue-rotate(30deg) brightness(1.1); }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
            
            clickCount = 0;
        }
    });
}

// ===================================
// Accessibility Enhancements
// ===================================
// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-nav *:focus {
        outline: 3px solid var(--deep-moss);
        outline-offset: 3px;
    }
`;
document.head.appendChild(keyboardStyle);

// ===================================
// Console Easter Egg
// ===================================
console.log('%c🌸 Airy - Vanilla Blossom', 'font-size: 24px; font-family: serif; color: #4A5D23;');
console.log('%cTransforming spaces into sanctuaries', 'font-size: 14px; color: #D2B48C;');
console.log('%c\nBuilt with love and vanilla essence ✨', 'font-style: italic; color: #4A5D23;');