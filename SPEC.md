# Canva UI Clone - Specification

## 1. Project Overview
- **Project name**: Canva UI Clone
- **Type**: Single-page web application (HTML/CSS/JS)
- **Core functionality**: A visual replica of the Canva design editor interface with interactive UI elements
- **Target users**: Developers exploring Canva-like interfaces

## 2. UI/UX Specification

### Layout Structure
```
+----------------------------------------------------------+
|  TOP TOOLBAR (Logo + File Menu + Edit Tools)             |
+----------+----------------------------+-------------------+
|          |                            |                   |
|  LEFT    |      MAIN CANVAS           |    RIGHT          |
|  SIDEBAR |      (Design Area)         |    SIDEBAR        |
|  (Tools) |                            |    (Properties)   |
|          |                            |                   |
+----------+----------------------------+-------------------+
|  BOTTOM TOOLBAR (Zoom + Page Nav + Export)               |
+----------------------------------------------------------+
```

### Responsive Breakpoints
- Desktop: 1200px+ (full layout)
- Tablet: 768px-1199px (collapsible sidebars)
- Mobile: <768px (stacked layout - not primary focus)

### Visual Design

#### Color Palette
- **Primary Background**: `#181818` (dark charcoal)
- **Secondary Background**: `#1E1E1E` (sidebar dark)
- **Tertiary Background**: `#2D2D2D` (cards/panels)
- **Canvas Background**: `#FFFFFF` (white - actual canvas)
- **Accent Primary**: `#00C4CC` (teal/cyan - Canva brand)
- **Accent Secondary**: `#7D2AE8` (purple - for gradients)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A8A8A8` (muted gray)
- **Border Color**: `#3D3D3D`
- **Hover States**: `#3A3A3A`
- **Active/Selected**: `#00C4CC` with 20% opacity

#### Typography
- **Font Family**: "Segoe UI", system-ui, sans-serif
- **Heading Size**: 14px (bold, uppercase for section titles)
- **Body Size**: 13px for labels, 12px for secondary text
- **Icon Labels**: 11px

#### Spacing System
- Sidebar width: 72px (collapsed icons only)
- Right panel width: 280px
- Top toolbar height: 56px
- Bottom toolbar height: 48px
- Panel padding: 16px
- Item gap: 8px

#### Visual Effects
- Subtle box-shadow on panels: `0 2px 8px rgba(0,0,0,0.3)`
- Smooth transitions: 0.2s ease for hover states
- Icon hover: scale(1.1) with background highlight
- Active tool: left border accent + background tint

### Components

#### Top Toolbar
- Logo (Canva-inspired icon + "Canva" text)
- File dropdown menu
- Edit tools: Undo, Redo, Zoom controls
- Share and Export buttons

#### Left Sidebar (Tool Panel)
- Icons with labels below:
  - Templates (grid icon)
  - Elements (shapes icon)
  - Text (T icon)
  - Photos (image icon)
  - Uploads (cloud icon)
  - Backgrounds (gradient icon)
  - Audio (music icon)
  - Apps (puzzle icon)
- Active state: teal left border + teal tinted background

#### Main Canvas
- Centered white rectangle (representing design)
- Grid background behind canvas (optional)
- Empty state with "Start designing" prompt
- Aspect ratio indicator (e.g., "1920 x 1080")

#### Right Sidebar (Properties Panel)
- **Tabs**: Options | Elements | Text | Uploads
- **Options Tab**:
  - Canvas size display
  - Background color/gradient picker
  - Snap to grid toggle
- **Elements Tab**: Recent elements grid
- **Text Tab**: Font options, size, color
- **Uploads Tab**: Upload button + recent uploads

#### Bottom Toolbar
- Zoom slider (50% - 200%)
- Page indicator (Page 1 of 1)
- Design dimension display
- Export/ Download button

## 3. Functionality Specification

### Core Features
1. **Tool Selection**: Click sidebar icons to change active tool (visual feedback only)
2. **Property Panel Tabs**: Switch between Options/ Elements/ Text/ Uploads tabs
3. **Canvas Hover**: Subtle highlight on canvas area
4. **Tooltips**: Show tool names on hover
5. **Dropdown Menus**: File menu with hover states
6. **Zoom Controls**: Slider interaction (visual only)
7. **Responsive Canvas**: Canvas maintains aspect ratio

### User Interactions
- Hover effects on all clickable elements
- Active states for selected tools
- Tab switching in right panel
- Dropdown menu toggle (File menu)
- Smooth transitions throughout

### Data Handling
- No backend required
- All state managed in JavaScript
- No persistent storage needed

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme applied consistently
- [ ] All sidebars positioned correctly
- [ ] Canvas centered with white background
- [ ] Icons visible and properly sized
- [ ] Hover states work on all interactive elements
- [ ] Active tool shows teal highlight
- [ ] Tabs switch correctly in right panel

### Functional Checkpoints
- [ ] Clicking left sidebar icons changes active state
- [ ] Right panel tabs switch content
- [ ] File dropdown shows menu on click
- [ ] Zoom slider is visually functional
- [ ] No console errors on load

## 5. Technical Implementation

### File Structure
- `index.html` - Main HTML structure
- `style.css` - All styling (can be inline in HTML for simplicity)
- `script.js` - Interactive functionality (can be inline)

### External Resources
- Font Awesome 6.x for icons (CDN)
- Google Fonts: "Inter" for modern typography feel

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)