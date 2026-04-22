---
name: High-Dopamine Velocity
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3d4a3d'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6d7b6c'
  outline-variant: '#bccbb9'
  surface-tint: '#006e2d'
  primary: '#006e2d'
  on-primary: '#ffffff'
  primary-container: '#1db954'
  on-primary-container: '#004118'
  inverse-primary: '#53e076'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#5f5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#a3a1a1'
  on-tertiary-container: '#383838'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#72fe8f'
  primary-fixed-dim: '#53e076'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
  label-sm:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin: 20px
---

## Brand & Style

The design system is engineered to transform mundane habit tracking into a high-octane, rewarding experience. It leverages a **Minimalist-Tactile** hybrid style, stripping away visual clutter to focus on action while using physical metaphors to make interactions feel consequential.

The brand personality is energetic, relentless, and celebratory. By adopting a "Spotify Light Mode" aesthetic, the system prioritizes extreme legibility and a sense of freshness. The goal is to evoke an immediate dopamine response through "juicy" interactions—where every tap feels like a physical click and every completion triggers a visual celebration. This is achieved through a combination of high-contrast typography and a playful yet sophisticated approach to depth and motion.

## Colors

The color palette is restricted to high-impact signals. **Pure White (#FFFFFF)** serves as the canvas, ensuring the interface feels airy and limitless. 

- **Primary Green (#1DB954):** Reserved exclusively for "Go" states, completions, and primary action buttons. It is the color of progress.
- **Achievement Gold (#FFD700):** Used sparingly for multipliers, "on-fire" streaks, and rare achievements to signify value.
- **Deep Neutral (#121212):** Provides heavy-weight contrast for text and iconography, ensuring the UI remains grounded and legible even at a glance.
- **Surface Gray (#F8F9FA):** Used for subtle card backgrounds and secondary containers to separate content without introducing visual noise.

## Typography

The design system utilizes **Lexend** across all levels. This typeface was chosen for its athletic, rhythmic quality and its origins in improving reading speed, which aligns with the app's focus on efficiency and momentum.

Headlines are set with heavy weights (700-800) and tight letter spacing to create a sense of urgency and importance. Body text maintains generous line height to ensure clarity during fast scrolling. All labels use a bold weight to ensure that even the smallest UI metadata feels intentional and energetic.

## Layout & Spacing

This design system employs a **Fluid Grid** model based on an 8px rhythmic unit. On mobile, the layout adheres to a 4-column structure with 20px side margins to keep content comfortably away from screen edges while maximizing thumb-reach.

Spacing is used aggressively to group related "habit sections." Wide vertical gaps (40px+) are used between different functional areas to prevent the high-dopamine visuals from becoming overwhelming. Elements within a card or list item use tight, 8px or 12px padding to feel cohesive and "packed" with data.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and tonal layering. Rather than flat blocks, the design system uses "floating" cards that appear to sit just millimeters above the white background.

- **Level 1 (Base):** White background.
- **Level 2 (Cards):** Subtle #121212 shadow at 4% opacity, 12px blur, 4px Y-offset. This makes habit cards feel tactile and pressable.
- **Level 3 (Interactive):** Primary buttons use a more pronounced shadow (8% opacity) that shrinks upon a "press" state, mimicking physical displacement.
- **Explosive Layer:** During achievement moments, elements may use Gold-tinted outer glows to signify a "multiplier" state.

## Shapes

The shape language is defined by extreme **Roundedness**. To achieve a friendly, modern, and thumb-optimized feel, a base radius of 16px (1rem) is applied to all standard cards and containers.

Primary buttons and progress bars utilize a **Pill-shape (999px)** to maximize the "target" area and reinforce a playful aesthetic. Interactive icons are housed in "Squircle" containers, blending the softness of a circle with the structure of a square, ensuring the UI feels organic rather than clinical.

## Components

### Buttons
Primary buttons are large (minimum 56px height), filled with Spotify Green, and feature bold White text. They use a "squishy" animation logic—scaling down by 5% on tap—to provide instant tactile feedback before the action executes.

### Habit Cards
Cards are the heart of the system. They feature a white surface, a 16px corner radius, and a subtle border (1px #EEEEEE). They must be large enough to be easily swiped. Left-swiping reveals a "Delete" action in red, while right-swiping "Completes" the habit with a full-card green flash.

### Chips & Badges
Small, high-contrast pills used for tags or categories. They use #121212 backgrounds with White text to pop against the white surface. Achievement badges use the Gold multiplier color and include a subtle rotating "shimmer" gradient effect.

### Progress Visualizers
Thick, pill-shaped bars. The "track" is a very light gray (#F2F2F2), and the "fill" is the vibrant Primary Green. When a goal is reached, the bar should pulse or emit a "sparkle" particle effect.

### Input Fields
Minimalist with 16px rounded corners and a 2px stroke that turns Primary Green when focused. Labels always sit above the field in **Label-Bold** typography to maintain high legibility.