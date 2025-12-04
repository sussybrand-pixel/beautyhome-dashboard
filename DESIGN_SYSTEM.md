# Emmaville Academy Admin Dashboard - Design System

## 🎨 Color Palette

### Primary Colors
- **Deep Blue (Primary)**: `#0f3460` - Main brand color, used for primary actions, sidebar, headers
- **Gold (Accent)**: `#d4af37` - Secondary accent, used for highlights, special buttons, important elements
- **Soft White (Background)**: `#fafbfd` - Main background color for clean, professional look

### Functional Colors
- **Success**: `#16a34a` (Green) - Success messages, positive actions
- **Error/Danger**: `#dc2626` (Red) - Destructive actions, error states
- **Warning**: `#f59e0b` (Amber) - Warning messages, caution states
- **Info**: `#3b82f6` (Blue) - Informational messages

### Neutral Colors
- **Foreground**: `#1a1a2e` - Primary text color
- **Muted Foreground**: `#64748b` - Secondary text, less important information
- **Border**: `rgba(15, 52, 96, 0.1)` - Subtle borders throughout
- **Card**: `#ffffff` - Card backgrounds
- **Secondary Background**: `#f0f4f8` - Secondary backgrounds, hover states

### Sidebar Colors
- **Sidebar Background**: `#0f3460` (Deep Blue)
- **Sidebar Text**: `#ffffff` (White)
- **Sidebar Accent**: `#1e4976` (Lighter Blue) - Hover state
- **Sidebar Active**: `#d4af37` (Gold) - Active menu item

---

## 📐 Spacing System

### Base Unit: 4px (0.25rem)

- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

### Component Padding
- **Cards**: 24px (1.5rem) - `p-6`
- **Buttons**: 16px horizontal, 8px vertical - `px-4 py-2`
- **Inputs**: 16px horizontal, 10px vertical - `px-4 py-2.5`
- **Page Container**: 32px - `p-8`

### Gap Spacing
- **Grid Gaps**: 24px - `gap-6`
- **Flex Gaps**: 12px - `gap-3`
- **Icon Gaps**: 8px - `gap-2`

---

## 🔤 Typography

### Font Family
- **Default**: System font stack (inherits from browser)
- All text uses browser default sans-serif fonts for maximum compatibility

### Font Sizes (Defined by HTML elements - DO NOT override with Tailwind classes)
- **h1**: 1.5rem (24px) - Page titles, main headings
- **h2**: 1.25rem (20px) - Section titles
- **h3**: 1.125rem (18px) - Subsection titles
- **h4**: 1rem (16px) - Card titles
- **p**: 1rem (16px) - Body text
- **small**: 0.875rem (14px) - Secondary information

### Font Weights
- **Normal**: 400 - Regular text
- **Medium**: 500 - Buttons, labels, headings

### Line Height
- **Default**: 1.5 - Optimal readability

---

## 🎯 Border Radius

### Radius Scale
- **sm**: 8px - `rounded-lg` - Small elements, tags
- **md**: 10px - `rounded-xl` - Default for cards
- **lg**: 12px - `rounded-xl` - Large cards
- **full**: 9999px - `rounded-full` - Circular elements (avatars, badges)

### Component Radii
- **Cards**: 12px - `rounded-xl`
- **Buttons**: 8px - `rounded-lg`
- **Inputs**: 8px - `rounded-lg`
- **Modal**: 12px - `rounded-xl`
- **Avatar**: Full circle - `rounded-full`

---

## 💫 Shadows

### Shadow Levels
- **sm**: `shadow-md` - Subtle elevation (cards at rest)
- **md**: `shadow-lg` - Medium elevation (hover states)
- **lg**: `shadow-xl` - High elevation (modals, floating elements)
- **2xl**: `shadow-2xl` - Maximum elevation (modal overlays)

### Usage
- **Cards**: `shadow-md` at rest, `shadow-xl` on hover
- **Buttons**: `shadow-md` on primary/gold variants
- **Sidebar**: `shadow-xl` for fixed positioning
- **Navbar**: `shadow-sm` for subtle separation

---

## 🎪 Component Styles

### Buttons

#### Variants
1. **Primary** (Deep Blue)
   - Background: `#0f3460`
   - Text: White
   - Hover: Slightly darker blue
   - Shadow: Medium
   - Use: Main actions, confirmations

2. **Gold** (Accent)
   - Background: `#d4af37`
   - Text: White
   - Hover: Slightly darker gold
   - Shadow: Medium
   - Use: Important actions, special features

3. **Secondary** (Light Gray)
   - Background: `#f0f4f8`
   - Text: Dark gray
   - Hover: Slightly darker
   - Shadow: None
   - Use: Cancel, alternative actions

4. **Danger** (Red)
   - Background: `#dc2626`
   - Text: White
   - Hover: Darker red
   - Shadow: Medium
   - Use: Delete, destructive actions

5. **Ghost** (Transparent)
   - Background: Transparent
   - Text: Muted
   - Hover: Light gray background
   - Shadow: None
   - Use: Tertiary actions, less emphasis

#### Sizes
- **Small**: `px-3 py-1.5` - Compact spaces, inline actions
- **Medium**: `px-4 py-2` - Default size
- **Large**: `px-6 py-3` - Prominent actions

### Cards

#### Structure
- Background: White (`#ffffff`)
- Border: 1px solid `rgba(15, 52, 96, 0.1)`
- Border Radius: 12px (`rounded-xl`)
- Shadow: Medium at rest
- Padding: 24px (`p-6`)

#### Card Header with 3D Depth
- Background: Gradient from `#0f3460` to `#0f3460/90`
- Text: White
- Shadow: Medium
- Creates subtle 3D effect
- Used for section headers

#### Hover State
- Transform: Subtle scale or translate
- Shadow: Increase to `shadow-xl`
- Transition: 300ms ease

### Inputs

#### Text Input
- Background: `#f8fafc`
- Border: 1px solid `rgba(15, 52, 96, 0.1)`
- Border Radius: 8px
- Padding: 16px horizontal, 10px vertical
- Focus: 2px ring in primary color

#### Textarea
- Same as text input
- Resize: None (fixed height)
- Rows: 4 (default)

### Modal

#### Structure
- Background: White
- Border Radius: 12px
- Shadow: Maximum (`shadow-2xl`)
- Backdrop: Black with 50% opacity + blur
- Animation: Fade in + zoom in
- Max Height: 90vh (scrollable)

#### Sizes
- **Small**: 448px (28rem)
- **Medium**: 512px (32rem) - Default
- **Large**: 672px (42rem)
- **XLarge**: 896px (56rem) - Image preview

### Sidebar

#### Fixed Layout
- Width: 256px (16rem)
- Height: 100vh
- Position: Fixed left
- Background: Deep Blue (`#0f3460`)
- Text: White
- Shadow: Extra large

#### Navigation Items
- Padding: 12px 16px
- Border Radius: 8px
- Active State: Gold background with scale effect
- Hover State: Lighter blue background
- Icon Size: 20px (1.25rem)

#### Logo Section
- Padding: 24px
- Border Bottom: Subtle white border
- Logo Badge: Gold background, rounded

### Navbar

#### Fixed Layout
- Height: 64px (4rem)
- Position: Fixed top
- Left Margin: 256px (sidebar width)
- Background: White
- Border Bottom: 1px solid border color
- Shadow: Small

#### Content
- Profile Avatar: 40px circular
- Notification Badge: 8px gold dot
- Padding: 24px horizontal

---

## 📱 Responsive Breakpoints

### Tailwind Breakpoints
- **sm**: 640px - Small devices
- **md**: 768px - Tablets
- **lg**: 1024px - Laptops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Large screens

### Layout Adjustments

#### Mobile (< 768px)
- Sidebar: Hidden (hamburger menu)
- Navbar: Full width
- Grid: Single column
- Cards: Full width
- Padding: Reduced to 16px

#### Tablet (768px - 1024px)
- Sidebar: Visible
- Grid: 2 columns max
- Cards: 2 per row

#### Desktop (> 1024px)
- Sidebar: Fixed visible
- Grid: 3-4 columns
- Full layout as designed

---

## ✨ Animation & Transitions

### Timing Functions
- **Default**: `ease-in-out`
- **Duration**: 200ms (fast) - 300ms (default)

### Common Transitions
- **Hover**: 200ms - Colors, shadows, transforms
- **Modal**: 300ms - Fade in, zoom in
- **Toast**: 300ms - Slide in from right
- **Page**: None - Instant navigation (SPA)

### Transform Effects
- **Hover Scale**: `scale-[1.02]` - Subtle 2% increase
- **Active Button**: Scale down on click
- **Card Hover**: Transform + shadow increase

---

## 🎯 Usage Guidelines

### When to Use Each Color

#### Deep Blue (`#0f3460`)
- Primary buttons
- Sidebar background
- Section headers
- Important UI elements

#### Gold (`#d4af37`)
- Accent elements
- Special action buttons
- Active states
- Highlights and badges

#### White/Light Gray
- Card backgrounds
- Page background
- Secondary buttons
- Input backgrounds

### Depth Hierarchy

1. **Background Layer**: Soft white (`#fafbfd`)
2. **Content Layer**: White cards with subtle shadow
3. **Elevated Layer**: Cards with increased shadow on hover
4. **Floating Layer**: Modals, tooltips with maximum shadow
5. **Overlay Layer**: Semi-transparent backdrop

### Accessibility

- **Contrast Ratios**: All text meets WCAG AA standards (4.5:1 minimum)
- **Focus States**: 2px ring around interactive elements
- **Hover States**: Clear visual feedback
- **Button States**: Disabled state with 50% opacity
- **Color Independence**: Don't rely solely on color to convey information

---

## 📦 Component Inventory

### Core Components
1. **Sidebar** - Fixed navigation
2. **Navbar** - Top bar with user info
3. **Card** - Content container
4. **Button** - All action triggers
5. **Input** - Text input fields
6. **Textarea** - Multi-line input
7. **Modal** - Overlay dialogs
8. **Toast** - Notification messages

### Page Templates
1. **LoginPage** - Split layout authentication
2. **DashboardHome** - KPI cards + activity feed
3. **ContentManager** - Grid of editable sections
4. **TextEditor** - Split editor/preview
5. **ImageManager** - Grid of images with actions
6. **SettingsPage** - Form-based settings

---

## 🔧 Implementation Notes

### CSS Variables
All colors are defined as CSS custom properties in `/styles/globals.css` for easy theming and consistency.

### Tailwind Classes
- Use utility classes directly
- Avoid custom CSS where possible
- Component classes defined inline
- No typography override classes (text-xl, font-bold) unless explicitly needed

### Image Handling
- Use `ImageWithFallback` component for all images
- Aspect ratios: `aspect-video` for thumbnails
- Object fit: `object-cover` for maintaining aspect

### Icons
- Library: `lucide-react`
- Default size: 20px (1.25rem) - `w-5 h-5`
- Large size: 24px (1.5rem) - `w-6 h-6`
- Color: Inherit from parent or specific color class

---

## 🎓 Design Philosophy

### Educational & Professional
- Clean and organized layouts
- Trustworthy deep blue primary color
- Professional gold accents for prestige
- Simple, intuitive navigation

### User-Friendly for Non-Technical Staff
- Clear labeling
- Visual feedback on all actions
- Guided workflows
- Helpful tooltips and messages

### Modern & Premium
- Soft shadows for depth
- Smooth transitions
- Rounded corners for friendliness
- Ample white space
- Consistent 3D-ish effects on headers

---

**Version**: 1.0  
**Last Updated**: December 2, 2025  
**Maintained by**: Emmaville Academy Development Team
