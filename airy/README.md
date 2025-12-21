# Airy - Vanilla Orchid Air Freshener Landing Page

A stunning, production-grade landing page for Airy's vanilla-flavored air freshener shaped like a flower. This project showcases the "Creamy Orchid" design theme with advanced animations and interactions.

## 🌸 Design Philosophy

### Theme: Creamy Orchid (Custom)
The design blends the warmth of vanilla with the organic freshness of a botanical garden, using high-contrast typography to maintain a premium, editorial feel.

**Color Palette:**
- `#FDF5E6` - Vanilla Cream (Primary Background)
- `#E9FFDB` - Soft Dew (Secondary Background)
- `#4A5D23` - Deep Moss (Accent/CTA)
- `#D2B48C` - Toasted Pod (Accents)

**Typography:**
- **Headlines:** Cormorant Garamond (elegant, sharp serif)
- **UI Elements:** Inter (clean, modern sans-serif)

## ✨ Features

### Visual Concept: "The Scented Bloom"
- **Digital Greenhouse** interface with organic, breathable design
- **High-end editorial layouts** with massive white space and overlapping elements
- **Hyper-realistic product imagery** from premium stock photos
- **Frosted glass UI elements** with backdrop blur effects

### Animations & Interactions (GSAP)
1. **Parallax Petals** - 8 floating petal elements that move at different speeds
2. **Hero Section** - Staggered text animations with spring easing
3. **Ripple Effect** - Hover effect on product image creating refractive distortion
4. **Scroll Animations** - Feature cards and sections animate on scroll
5. **Smooth Scrolling** - Navigation with custom GSAP scroll-to
6. **Hover Effects** - Interactive buttons and cards with scale transforms

### Sections
1. **Hero Section** - Large typography, product showcase, info cards
2. **Features Section** - Three feature cards with images
3. **Composition Section** - Product details with scent notes
4. **Final CTA** - Conversion-focused call-to-action
5. **Footer** - Links and copyright information

## 🚀 Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)** - Modern syntax
- **GSAP 3.12.5** - Professional animation library
- **ScrollTrigger** - Scroll-based animations
- **Google Fonts** - Cormorant Garamond & Inter

## 📁 Project Structure

```
slate/
├── index.html          # Main HTML file
├── style.css           # All styles with CSS variables
├── script.js           # GSAP animations and interactions
└── README.md          # This file
```

## 🎨 Design Features

### Layout
- **Asymmetrical grid** with scroll-reactive elements
- **Floating frosted-glass modules** for information
- **Tone-on-tone** color approach with strategic accent placement
- **Responsive design** for mobile, tablet, and desktop

### Motion Design
- **Parallax effects** on multiple layers
- **Spring animations** for organic feel
- **Staggered reveals** for visual hierarchy
- **Smooth transitions** with custom cubic-bezier easing

### Performance
- Optimized animations for 60fps
- Lazy loading considerations
- Mobile-specific animation adjustments
- Efficient GSAP timeline management

## 🌐 Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## 📱 Responsive Breakpoints

- **Desktop:** 1400px+ (Full layout)
- **Tablet:** 768px - 1024px (Adapted grid)
- **Mobile:** < 768px (Stacked layout)

## 🎯 Key Interactions

1. **Product Image Hover** - Ripple effect emanates from center
2. **Info Card Hover** - Lift effect with shadow
3. **CTA Button Hover** - Scale up with enhanced shadow
4. **Feature Cards** - Animate in on scroll with stagger
5. **Navigation Links** - Underline animation on hover
6. **Smooth Scroll** - Custom GSAP scroll-to for anchor links

## 🔧 Customization

### Colors
Edit CSS variables in `style.css`:
```css
:root {
    --vanilla-cream: #FDF5E6;
    --soft-dew: #E9FFDB;
    --deep-moss: #4A5D23;
    --toasted-pod: #D2B48C;
}
```

### Typography
Change font imports in `index.html` and update CSS variables:
```css
:root {
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'Inter', sans-serif;
}
```

### Animations
Modify GSAP timelines in `script.js`. Key functions:
- `initHeroAnimations()` - Hero section entrance
- `initParallaxPetals()` - Floating petals
- `initRippleEffect()` - Product hover effect

## 📸 Screenshots

The landing page features:
- Clean, editorial-style hero section
- Three feature cards with hover effects
- Detailed composition section with product information
- Professional footer with navigation

## 🚦 Getting Started

1. Clone or download the project
2. Open `index.html` in a modern browser
3. No build process required - pure HTML/CSS/JS!

## 📝 Development Notes

### Animation Performance
- Petals use `will-change: transform` for GPU acceleration
- ScrollTrigger optimized with `scrub` for smooth parallax
- Mobile devices get simplified animations for better performance

### Accessibility
- Semantic HTML5 structure
- ARIA-compliant navigation
- Keyboard-accessible interactive elements
- High contrast text for readability

### SEO Considerations
- Proper heading hierarchy (h1, h2, h3)
- Alt text on all images
- Semantic section tags
- Meta tags ready for customization

## 🎓 Learning Resources

This project demonstrates:
- Advanced GSAP animations
- ScrollTrigger implementations
- CSS Grid and Flexbox layouts
- Custom CSS properties (variables)
- Modern JavaScript ES6+ patterns
- Responsive design techniques
- Premium UI/UX design principles

## 📄 License

This project is created for Airy company. All rights reserved.

## 🤝 Credits

- **Design:** Custom "Creamy Orchid" theme
- **Images:** Unsplash (high-quality orchid photography)
- **Fonts:** Google Fonts (Cormorant Garamond, Inter)
- **Animation:** GSAP (GreenSock Animation Platform)

## 📞 Support

For questions or customization requests, please contact the Airy team.

---

**Built with ❤️ for Airy - Breathing life into every space**
