// ============================================
// PHASER 3 // NEON HARDLINE INTERACTIVE SYSTEMS
// ============================================

// Debug Console Logger
const consoleLog = document.getElementById('consoleLog');
let logIndex = 0;

function addLog(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${logIndex.toString().padStart(4, '0')}] ${message}`;
    entry.style.animationDelay = `${logIndex * 0.05}s`;
    consoleLog.appendChild(entry);
    
    // Auto-scroll
    consoleLog.scrollTop = consoleLog.scrollHeight;
    
    logIndex++;
    
    // Keep only last 50 entries
    if (consoleLog.children.length > 50) {
        consoleLog.removeChild(consoleLog.firstChild);
    }
}

// ============================================
// ICOSAHEDRON WIREFRAME RENDERER
// ============================================

const canvas = document.getElementById('icosahedronCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Icosahedron vertices (normalized)
const phi = (1 + Math.sqrt(5)) / 2;
const vertices = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
].map(v => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
});

// Icosahedron faces (triangles)
const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];

// Rotation angles
let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;
let time = 0;

// Projection
function project(vertex, scale, offsetX, offsetY) {
    const [x, y, z] = vertex;
    
    // Rotate
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosZ = Math.cos(rotationZ);
    const sinZ = Math.sin(rotationZ);
    
    // Rotation matrices
    let y1 = y * cosX - z * sinX;
    let z1 = y * sinX + z * cosX;
    
    let x2 = x * cosY + z1 * sinY;
    let z2 = -x * sinY + z1 * cosY;
    
    let x3 = x2 * cosZ - y1 * sinZ;
    let y3 = x2 * sinZ + y1 * cosZ;
    
    // Perspective projection
    const perspective = 3;
    const scaleProjection = perspective / (perspective + z2);
    
    return [
        x3 * scale * scaleProjection + offsetX,
        y3 * scale * scaleProjection + offsetY,
        z2
    ];
}

// Render function
function render() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const scale = Math.min(width, height) * 0.25;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Update rotation
    time += 0.01;
    rotationX = time * 0.3;
    rotationY = time * 0.5;
    rotationZ = time * 0.2;
    
    // Pulse effect
    const pulse = Math.sin(time * 2) * 0.1 + 1;
    const currentScale = scale * pulse;
    
    // Project vertices
    const projectedVertices = vertices.map(v => project(v, currentScale, centerX, centerY));
    
    // Sort faces by depth (painter's algorithm)
    const facesWithDepth = faces.map(face => {
        const [a, b, c] = face;
        const avgZ = (projectedVertices[a][2] + projectedVertices[b][2] + projectedVertices[c][2]) / 3;
        return { face, depth: avgZ };
    });
    
    facesWithDepth.sort((a, b) => a.depth - b.depth);
    
    // Draw faces
    facesWithDepth.forEach(({ face, depth }) => {
        const [a, b, c] = face;
        const pa = projectedVertices[a];
        const pb = projectedVertices[b];
        const pc = projectedVertices[c];
        
        // Face opacity based on depth
        const opacity = (depth + 1) / 4;
        
        // Draw filled triangle (subtle)
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.lineTo(pc[0], pc[1]);
        ctx.closePath();
        ctx.fillStyle = `rgba(0, 245, 255, ${opacity * 0.05})`;
        ctx.fill();
    });
    
    // Draw edges
    const drawnEdges = new Set();
    
    faces.forEach(face => {
        for (let i = 0; i < 3; i++) {
            const a = face[i];
            const b = face[(i + 1) % 3];
            const edgeKey = `${Math.min(a, b)}-${Math.max(a, b)}`;
            
            if (!drawnEdges.has(edgeKey)) {
                drawnEdges.add(edgeKey);
                
                const pa = projectedVertices[a];
                const pb = projectedVertices[b];
                
                // Depth-based opacity
                const avgZ = (pa[2] + pb[2]) / 2;
                const opacity = (avgZ + 1) / 2;
                
                // Gradient stroke
                const gradient = ctx.createLinearGradient(pa[0], pa[1], pb[0], pb[1]);
                gradient.addColorStop(0, `rgba(0, 245, 255, ${opacity})`);
                gradient.addColorStop(0.5, `rgba(204, 255, 0, ${opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(0, 245, 255, ${opacity})`);
                
                ctx.beginPath();
                ctx.moveTo(pa[0], pa[1]);
                ctx.lineTo(pb[0], pb[1]);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.shadowBlur = 12;
                ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    });
    
    // Draw vertices
    projectedVertices.forEach(([x, y, z]) => {
        const opacity = (z + 1) / 2;
        const size = 4 + (z + 1) * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 255, ${opacity})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    requestAnimationFrame(render);
}

// Start rendering
render();

// ============================================
// SCROLL ANIMATIONS (STAGGERED REVEAL)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
                addLog(`Component revealed: ${entry.target.dataset.spec || entry.target.dataset.feature || 'element'}`);
            }, index * 100);
        }
    });
}, observerOptions);

// Observe spec windows
document.querySelectorAll('.spec-window').forEach(window => {
    observer.observe(window);
});

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// ============================================
// GLITCH EFFECT ON HOVER
// ============================================

function createGlitchEffect(element) {
    const originalContent = element.querySelector('.window-content') || element.querySelector('.feature-content');
    if (!originalContent) return;
    
    const codePreview = originalContent.querySelector('.code-preview');
    if (codePreview) {
        // Show code on hover (already exists)
        return;
    }
}

// Apply glitch to spec windows and feature cards
document.querySelectorAll('.spec-window, .feature-card').forEach(element => {
    element.addEventListener('mouseenter', function() {
        addLog(`Interaction: ${this.dataset.spec || this.dataset.feature}`);
        
        // Glitch animation
        this.style.animation = 'glitch 0.3s ease-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
});

// Glitch keyframes (added via JS for dynamic effect)
const glitchKeyframes = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;

const style = document.createElement('style');
style.textContent = glitchKeyframes;
document.head.appendChild(style);

// ============================================
// BUTTON INTERACTIONS
// ============================================

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        addLog(`Button pressed: ${this.textContent.trim()}`);
        
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Ripple animation
const rippleKeyframes = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const rippleStyle = document.createElement('style');
rippleStyle.textContent = rippleKeyframes;
document.head.appendChild(rippleStyle);

// ============================================
// SCROLL TRACKING
// ============================================

let lastScrollY = window.scrollY;
let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? 'DOWN' : 'UP';
        const section = Math.floor(currentScrollY / window.innerHeight);
        
        addLog(`Scroll ${direction} // Section: ${section}`);
        lastScrollY = currentScrollY;
    }, 150);
});

// ============================================
// MOUSE TRACKING
// ============================================

let mouseTimeout;
document.addEventListener('mousemove', (e) => {
    clearTimeout(mouseTimeout);
    
    mouseTimeout = setTimeout(() => {
        const x = Math.round((e.clientX / window.innerWidth) * 100);
        const y = Math.round((e.clientY / window.innerHeight) * 100);
        addLog(`Mouse position: [${x}%, ${y}%]`);
    }, 500);
});

// ============================================
// TERMINAL TYPING EFFECT
// ============================================

const terminalCommands = [
    { delay: 1000, line: 'npm install phaser', type: 'command' },
    { delay: 2000, line: '✓ phaser@3.80.0 installed', type: 'output' },
    { delay: 3000, line: 'npm run dev', type: 'command' },
    { delay: 4000, line: 'Server running on http://localhost:3000', type: 'output' }
];

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Toggle debug console with '~' key
    if (e.key === '`' || e.key === '~') {
        const console = document.querySelector('.debug-console');
        console.classList.toggle('active');
        addLog('Debug console toggled');
    }
    
    // Log other key presses
    if (e.key.length === 1) {
        // Only log single character keys
        addLog(`Key pressed: ${e.key}`);
    }
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

let frameCount = 0;
let lastFrameTime = performance.now();
let fps = 60;

function updateFPS() {
    frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - lastFrameTime;
    
    if (delta >= 1000) {
        fps = Math.round((frameCount * 1000) / delta);
        frameCount = 0;
        lastFrameTime = currentTime;
        
        // Update FPS display if exists
        const fpsDisplay = document.querySelector('.stat-value');
        if (fpsDisplay && fpsDisplay.textContent === '60') {
            fpsDisplay.textContent = fps;
        }
    }
    
    requestAnimationFrame(updateFPS);
}

updateFPS();

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('load', () => {
    addLog('[INIT] DOM loaded');
    addLog('[RENDER] Canvas initialized');
    addLog('[SYSTEM] Event listeners active');
    addLog('[READY] Framework ready for interaction');
    
    // Simulate system checks
    setTimeout(() => addLog('[CHECK] WebGL support: ACTIVE'), 500);
    setTimeout(() => addLog('[CHECK] Audio API: ACTIVE'), 1000);
    setTimeout(() => addLog('[CHECK] Input handlers: ACTIVE'), 1500);
    setTimeout(() => addLog('[STATUS] All systems operational'), 2000);
});

// ============================================
// PARTICLE CURSOR TRAIL (Optional Enhancement)
// ============================================

class ParticleTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 20;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9997';
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.addParticle(e.clientX, e.clientY);
        });
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addParticle(x, y) {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift();
        }
        
        this.particles.push({
            x,
            y,
            size: Math.random() * 3 + 1,
            life: 1,
            decay: Math.random() * 0.02 + 0.01
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(particle => {
            particle.life -= particle.decay;
            
            if (particle.life <= 0) return false;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 245, 255, ${particle.life * 0.5})`;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(0, 245, 255, 0.8)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            return true;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle trail (can be disabled for performance)
// new ParticleTrail();

console.log('%c🎮 PHASER 3 // NEON HARDLINE FRAMEWORK', 'color: #00F5FF; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(0,245,255,0.5);');
console.log('%cHigh-Performance Game Engine for Modern Browsers', 'color: #CCFF00; font-size: 14px;');
console.log('%cAll systems operational. Ready for deployment.', 'color: #808080; font-size: 12px;');