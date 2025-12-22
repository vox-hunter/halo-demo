/**
 * AIRY — Olfactory Architecture
 * Immersive Scroll-Driven 3D Experience
 * 
 * Features:
 * - 3D flower travels through the entire page
 * - Multi-axis rotation based on scroll position
 * - Interactive annotations at specifications section
 * - Cursor-reactive movement
 * - Cinematic scroll journey
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    colors: {
        boneWhite: 0xF9F7F2,
        warmVanilla: 0xE8D5B5,
        goldenAmber: 0xD4A853,
        obsidian: 0x1A1A1A
    },
    particles: {
        count: 60,
        minSize: 0.02,
        maxSize: 0.1,
        mouseInfluence: 0.2
    },
    // Scroll journey keyframes (normalized 0-1)
    journey: {
        hero: { start: 0, end: 0.18 },
        story: { start: 0.18, end: 0.38 },
        scent: { start: 0.38, end: 0.58 },
        specs: { start: 0.58, end: 0.82 },
        cta: { start: 0.82, end: 1 }
    }
};

// ============================================
// STATE
// ============================================
const state = {
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },
    scrollProgress: 0,
    scrollY: 0,
    loaded: false,
    currentSection: 'hero',
    annotationsVisible: false
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function lerp(start, end, t) {
    return start + (end - start) * t;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// ============================================
// THREE.JS IMMERSIVE PRODUCT SCENE
// ============================================
class ProductScene {
    constructor() {
        this.canvas = document.getElementById('product-canvas');
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.model = null;
        this.mixer = null;
        this.annotationSprites = [];
        this.baseScale = 1;
        
        // Journey positions for the flower at each section
        // x values: positive = right side, negative = left side
        // Alternating positions to match the 2-column layout
        this.journeyPath = {
            hero: { x: 0.5, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 1.1 },
            story: { x: 1.0, y: 0, z: 0.2, rotX: 0.3, rotY: Math.PI * 0.7, rotZ: 0.1, scale: 1.0 },  // Right side (content left)
            scent: { x: -0.9, y: 0, z: 0.2, rotX: -0.2, rotY: Math.PI * 1.4, rotZ: -0.08, scale: 0.95 }, // Left side (content right)
            specs: { x: -0.8, y: 0, z: 0.5, rotX: 0.2, rotY: Math.PI * 2.1, rotZ: 0, scale: 1.2 },  // Left side with annotations
            cta: { x: 0, y: 0, z: 0, rotX: 0.1, rotY: Math.PI * 2.8, rotZ: 0.05, scale: 0.85 }   // Center
        };
        
        this.currentPos = { ...this.journeyPath.hero };
        this.targetPos = { ...this.journeyPath.hero };
        
        this.init();
    }
    
    init() {
        // Camera - slightly wider FOV for better visibility
        this.camera = new THREE.PerspectiveCamera(
            38,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 4.5);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.4;
        
        // Setup
        this.setupLighting();
        this.loadModel();
        this.setupAnnotationData();
        
        // Events
        window.addEventListener('resize', () => this.onResize());
        
        // Start animation
        this.animate();
    }
    
    setupLighting() {
        // Environment map for reflections
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
        
        const envScene = new THREE.Scene();
        const envGeometry = new THREE.SphereGeometry(500, 64, 64);
        const envMaterial = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            vertexColors: true
        });
        
        const colors = [];
        const positions = envGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            const t = (y + 500) / 1000;
            const color = new THREE.Color().lerpColors(
                new THREE.Color(0xE8D5B5),
                new THREE.Color(0xFFFDF8),
                t
            );
            colors.push(color.r, color.g, color.b);
        }
        envGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const envMesh = new THREE.Mesh(envGeometry, envMaterial);
        envScene.add(envMesh);
        
        this.envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
        this.scene.environment = this.envMap;
        
        // Ambient
        const ambient = new THREE.AmbientLight(0xFFFAF0, 0.5);
        this.scene.add(ambient);
        
        // Key light (main)
        const keyLight = new THREE.DirectionalLight(0xFFFAF0, 2.5);
        keyLight.position.set(3, 5, 3);
        this.scene.add(keyLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(CONFIG.colors.warmVanilla, 1);
        fillLight.position.set(-4, 2, 4);
        this.scene.add(fillLight);
        
        // Rim light (golden)
        const rimLight = new THREE.DirectionalLight(CONFIG.colors.goldenAmber, 1.5);
        rimLight.position.set(0, -3, -4);
        this.scene.add(rimLight);
        
        // Back light
        const backLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
        backLight.position.set(-2, 4, -3);
        this.scene.add(backLight);
        
        // Hemisphere
        const hemi = new THREE.HemisphereLight(0xFFFDF8, CONFIG.colors.warmVanilla, 0.4);
        this.scene.add(hemi);
    }
    
    setupAnnotationData() {
        // Annotation data for the specs section
        // Positioned around the model which is on the LEFT side of the screen
        this.annotationData = [
            { 
                id: 'dimensions', 
                label: '8.5 × 8.5 × 3.2 cm',
                title: 'DIMENSIONS',
                position: { x: -2.2, y: 0.8 }  // Top left of model
            },
            { 
                id: 'material', 
                label: 'Ceramic Polymer Blend',
                title: 'MATERIAL',
                position: { x: -3.5, y: 0 }  // Far left
            },
            { 
                id: 'fragrance', 
                label: '18% Concentrate',
                title: 'FRAGRANCE LOAD',
                position: { x: -1.5, y: -0.8 }  // Bottom center-left
            },
            { 
                id: 'coverage', 
                label: 'Up to 25m²',
                title: 'COVERAGE',
                position: { x: -3.2, y: -0.6 }  // Bottom far left
            },
            { 
                id: 'weight', 
                label: '42 grams',
                title: 'WEIGHT',
                position: { x: -1.0, y: 1.0 }  // Top center
            }
        ];
    }
    
    loadModel() {
        const loader = new GLTFLoader();
        
        loader.load(
            './airy.glb',
            (gltf) => {
                this.model = gltf.scene;
                
                // Center and scale
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                this.model.position.sub(center);
                
                const maxDim = Math.max(size.x, size.y, size.z);
                this.baseScale = 2.0 / maxDim;
                this.model.scale.setScalar(this.baseScale);
                
                // Initial position
                this.model.position.set(
                    this.journeyPath.hero.x,
                    this.journeyPath.hero.y,
                    this.journeyPath.hero.z
                );
                
                // Enhance materials
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        if (child.material) {
                            child.material.roughness = 0.25;
                            child.material.metalness = 0.05;
                            child.material.envMapIntensity = 1.0;
                            child.material.needsUpdate = true;
                        }
                    }
                });
                
                // Create a group for model
                this.modelGroup = new THREE.Group();
                this.modelGroup.add(this.model);
                this.scene.add(this.modelGroup);
                
                state.loaded = true;
                console.log('✓ Airy model loaded - Immersive journey ready');
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log(`Loading: ${((progress.loaded / progress.total) * 100).toFixed(0)}%`);
                }
            },
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    }
    
    updateHTMLAnnotations(visible, progress) {
        const container = document.getElementById('annotations-container');
        if (!container || !this.modelGroup) return;
        
        // Get the model's screen position (model is on the left side during specs)
        const modelCenterX = window.innerWidth * 0.3; // Model is at ~30% from left
        const modelCenterY = window.innerHeight * 0.45; // Slightly above center
        
        this.annotationData.forEach((annotation, i) => {
            let annotEl = document.getElementById(`annotation-${annotation.id}`);
            
            if (!annotEl) {
                annotEl = document.createElement('div');
                annotEl.id = `annotation-${annotation.id}`;
                annotEl.className = 'annotation';
                annotEl.innerHTML = `
                    <div class="annotation-pulse"></div>
                    <div class="annotation-dot"></div>
                    <div class="annotation-line"></div>
                    <div class="annotation-content">
                        <span class="annotation-title">${annotation.title}</span>
                        <span class="annotation-value">${annotation.label}</span>
                    </div>
                `;
                container.appendChild(annotEl);
            }
            
            // Position annotations around the model center
            const x = modelCenterX + annotation.position.x * 100;
            const y = modelCenterY - annotation.position.y * 100;
            
            annotEl.style.left = `${x}px`;
            annotEl.style.top = `${y}px`;
            
            // Staggered animation
            const delay = i * 0.12;
            const adjustedProgress = clamp((progress - delay) / (1 - delay * 2), 0, 1);
            const opacity = visible ? easeOutQuart(adjustedProgress) : 0;
            
            annotEl.style.opacity = opacity;
            annotEl.style.transform = `translate(-50%, -50%) scale(${0.7 + opacity * 0.3})`;
            annotEl.style.pointerEvents = visible && opacity > 0.5 ? 'auto' : 'none';
        });
    }
    
    calculateJourneyPosition(scrollProgress) {
        const { journey } = CONFIG;
        
        // Determine current section and interpolation
        let fromPos, toPos, sectionProgress;
        
        if (scrollProgress <= journey.hero.end) {
            sectionProgress = mapRange(scrollProgress, journey.hero.start, journey.hero.end, 0, 1);
            fromPos = this.journeyPath.hero;
            toPos = this.journeyPath.story;
            state.currentSection = 'hero';
        } else if (scrollProgress <= journey.story.end) {
            sectionProgress = mapRange(scrollProgress, journey.story.start, journey.story.end, 0, 1);
            fromPos = this.journeyPath.story;
            toPos = this.journeyPath.scent;
            state.currentSection = 'story';
        } else if (scrollProgress <= journey.scent.end) {
            sectionProgress = mapRange(scrollProgress, journey.scent.start, journey.scent.end, 0, 1);
            fromPos = this.journeyPath.scent;
            toPos = this.journeyPath.specs;
            state.currentSection = 'scent';
        } else if (scrollProgress <= journey.specs.end) {
            sectionProgress = mapRange(scrollProgress, journey.specs.start, journey.specs.end, 0, 1);
            fromPos = this.journeyPath.specs;
            toPos = this.journeyPath.cta;
            state.currentSection = 'specs';
        } else {
            sectionProgress = mapRange(scrollProgress, journey.cta.start, journey.cta.end, 0, 1);
            fromPos = this.journeyPath.cta;
            toPos = this.journeyPath.cta;
            state.currentSection = 'cta';
        }
        
        sectionProgress = clamp(sectionProgress, 0, 1);
        const easedProgress = easeInOutCubic(sectionProgress);
        
        return {
            x: lerp(fromPos.x, toPos.x, easedProgress),
            y: lerp(fromPos.y, toPos.y, easedProgress),
            z: lerp(fromPos.z, toPos.z, easedProgress),
            rotX: lerp(fromPos.rotX, toPos.rotX, easedProgress),
            rotY: lerp(fromPos.rotY, toPos.rotY, easedProgress),
            rotZ: lerp(fromPos.rotZ, toPos.rotZ, easedProgress),
            scale: lerp(fromPos.scale, toPos.scale, easedProgress),
            sectionProgress: easedProgress
        };
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        if (this.modelGroup && this.model) {
            // Calculate journey position based on scroll
            const journeyPos = this.calculateJourneyPosition(state.scrollProgress);
            
            // Smooth interpolation to target position
            const smoothing = 0.06;
            
            this.targetPos = journeyPos;
            
            // Apply position with mouse offset for interactivity
            const mouseOffsetX = state.mouse.x * 0.2;
            const mouseOffsetY = state.mouse.y * 0.12;
            
            this.modelGroup.position.x += (this.targetPos.x + mouseOffsetX - this.modelGroup.position.x) * smoothing;
            this.modelGroup.position.y += (this.targetPos.y - mouseOffsetY - this.modelGroup.position.y) * smoothing;
            this.modelGroup.position.z += (this.targetPos.z - this.modelGroup.position.z) * smoothing;
            
            // Apply rotation with continuous spin effect
            const continuousSpin = elapsed * 0.15;
            const targetRotX = this.targetPos.rotX + Math.sin(elapsed * 0.4) * 0.08;
            const targetRotY = this.targetPos.rotY + continuousSpin;
            const targetRotZ = this.targetPos.rotZ + Math.cos(elapsed * 0.25) * 0.04;
            
            this.modelGroup.rotation.x += (targetRotX - this.modelGroup.rotation.x) * smoothing;
            this.modelGroup.rotation.y += (targetRotY - this.modelGroup.rotation.y) * smoothing * 0.3;
            this.modelGroup.rotation.z += (targetRotZ - this.modelGroup.rotation.z) * smoothing;
            
            // Apply scale
            const targetScale = this.targetPos.scale * this.baseScale;
            const currentScale = this.model.scale.x;
            this.model.scale.setScalar(currentScale + (targetScale - currentScale) * smoothing);
            
            // Floating animation
            this.modelGroup.position.y += Math.sin(elapsed * 0.7) * 0.004;
            
            // Update annotations visibility (only in specs section)
            const isSpecsSection = state.currentSection === 'specs';
            const specsProgress = isSpecsSection ? clamp(journeyPos.sectionProgress * 1.5, 0, 1) : 0;
            this.updateHTMLAnnotations(isSpecsSection, specsProgress);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// ENHANCED FLOATING PARTICLES
// ============================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const { count, minSize, maxSize } = CONFIG.particles;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: minSize + Math.random() * (maxSize - minSize),
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: 0.15 + Math.random() * 0.4,
                hue: 35 + Math.random() * 20,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.001;
        
        this.particles.forEach((p, i) => {
            // Mouse repulsion
            const dx = (state.mouse.x * 0.5 + 0.5) * this.canvas.width - p.x;
            const dy = (state.mouse.y * 0.5 + 0.5) * this.canvas.height - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 250) {
                const force = (250 - dist) / 250;
                p.x -= dx * force * CONFIG.particles.mouseInfluence * 0.015;
                p.y -= dy * force * CONFIG.particles.mouseInfluence * 0.015;
            }
            
            // Orbital movement
            p.x += p.speedX + Math.sin(time + p.phase) * 0.3;
            p.y += p.speedY + Math.cos(time + p.phase) * 0.3;
            
            // Wrap
            if (p.x < -100) p.x = this.canvas.width + 100;
            if (p.x > this.canvas.width + 100) p.x = -100;
            if (p.y < -100) p.y = this.canvas.height + 100;
            if (p.y > this.canvas.height + 100) p.y = -100;
            
            // Draw with glow
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 80);
            gradient.addColorStop(0, `hsla(${p.hue}, 65%, 60%, ${p.opacity})`);
            gradient.addColorStop(0.4, `hsla(${p.hue}, 55%, 50%, ${p.opacity * 0.4})`);
            gradient.addColorStop(1, `hsla(${p.hue}, 45%, 40%, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 80, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }
}

// ============================================
// SCROLL PROGRESS TRACKER
// ============================================
class ScrollController {
    constructor() {
        this.init();
    }
    
    init() {
        this.updateScrollBounds();
        
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('resize', () => this.updateScrollBounds());
        
        this.onScroll();
    }
    
    updateScrollBounds() {
        this.maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    }
    
    onScroll() {
        state.scrollY = window.scrollY;
        state.scrollProgress = clamp(state.scrollY / this.maxScroll, 0, 1);
        
        // Update scroll progress indicator
        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            progressBar.style.transform = `scaleX(${state.scrollProgress})`;
        }
    }
}

// ============================================
// PARALLAX CONTROLLER
// ============================================
class ParallaxController {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.onScroll();
    }
    
    onScroll() {
        this.elements.forEach((el) => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = state.scrollY * speed;
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ============================================
// SCROLL REVEAL
// ============================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.story-header, .story-column, .scent-info, .spec-item, .cta-container');
        this.init();
    }
    
    init() {
        this.elements.forEach(el => el.classList.add('reveal'));
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        if (entry.target.classList.contains('scent-info')) {
                            setTimeout(() => {
                                const durationFill = document.querySelector('.duration-fill');
                                if (durationFill) durationFill.classList.add('animate');
                            }, 500);
                        }
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.elements.forEach((el) => observer.observe(el));
    }
}

// ============================================
// MOUSE TRACKING
// ============================================
class MouseTracker {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            state.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            state.targetMouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        });
        
        const updateMouse = () => {
            state.mouse.x += (state.targetMouse.x - state.mouse.x) * 0.08;
            state.mouse.y += (state.targetMouse.y - state.mouse.y) * 0.08;
            requestAnimationFrame(updateMouse);
        };
        updateMouse();
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// ============================================
// SECTION INDICATOR & UI ELEMENTS
// ============================================
class UIController {
    constructor() {
        this.create();
        this.init();
    }
    
    create() {
        // Create section navigation dots
        const nav = document.createElement('div');
        nav.className = 'section-nav';
        nav.innerHTML = `
            <div class="section-dot active" data-section="hero" title="Hero"></div>
            <div class="section-dot" data-section="story" title="Story"></div>
            <div class="section-dot" data-section="scent" title="Scent"></div>
            <div class="section-dot" data-section="specs" title="Specs"></div>
            <div class="section-dot" data-section="cta" title="Order"></div>
        `;
        document.body.appendChild(nav);
        
        // Create annotations container
        const annotationsContainer = document.createElement('div');
        annotationsContainer.id = 'annotations-container';
        document.body.appendChild(annotationsContainer);
        
        // Create scroll progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);
        
        // Create section label
        const sectionLabel = document.createElement('div');
        sectionLabel.className = 'section-label';
        sectionLabel.innerHTML = '<span>HERO</span>';
        document.body.appendChild(sectionLabel);
    }
    
    init() {
        // Update section indicators
        setInterval(() => {
            const dots = document.querySelectorAll('.section-dot');
            dots.forEach(dot => {
                const section = dot.dataset.section;
                dot.classList.toggle('active', section === state.currentSection);
            });
            
            // Update section label
            const label = document.querySelector('.section-label span');
            if (label) {
                const labels = {
                    hero: 'DISCOVER',
                    story: 'THE PHILOSOPHY',
                    scent: 'SCENT PROFILE',
                    specs: 'SPECIFICATIONS',
                    cta: 'PRE-ORDER'
                };
                label.textContent = labels[state.currentSection] || '';
            }
        }, 100);
        
        // Click on dots to navigate
        document.querySelectorAll('.section-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const section = dot.dataset.section;
                const target = document.getElementById(section);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                } else if (section === 'hero') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (section === 'cta') {
                    document.querySelector('.cta-section')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌸 Airy — Immersive Scroll Journey');
    console.log('   Initializing...');
    
    // Initialize all systems
    new ProductScene();
    new ParticleSystem();
    new ScrollController();
    new ParallaxController();
    new ScrollReveal();
    new MouseTracker();
    new SmoothScroll();
    new UIController();
    
    console.log('✓ All systems initialized');
    console.log('   Scroll to explore the journey!');
});
