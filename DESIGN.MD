# VendorProof UI Design System — design.md

## Philosophy

VendorProof UI is NOT a dashboard system.

It is a **trust-first identity and payment interface** for informal commerce.

The design direction is:

> Modern, editorial, high-contrast, typography-led UI with minimal decoration.

Think:

- Awwwards-level product landing pages
- Stripe-level financial UI
- Linear-level clarity
- Apple-level restraint
- Notion-level structure

BUT adapted for:

> real-world vendor trust + payments

---

## Core Design Principles

### 1. Typography is the primary design system

No visual clutter. No heavy decoration.

- Large, confident headings
- Tight hierarchy
- Strong font contrast
- Minimal reliance on color

**Rule:**

> If you can’t solve it with typography, don’t solve it with decoration.

---

### 2. Layout is spacious and editorial

- Generous whitespace
- Asymmetrical balance allowed
- Grid is a guide, not a cage
- Sections feel like “blocks of meaning”, not UI sections

---

### 3. Everything is a card, not a section

Avoid:

- “sections”
- “panels”
- “containers everywhere”

Use:

- identity card
- metric strip
- chip cluster
- inline metadata
- floating modal objects

---

### 4. No gradients. No neon. No crypto aesthetics.

Strict rules:

- ❌ no gradients
- ❌ no glowing backgrounds
- ❌ no glassmorphism overload
- ❌ no animated flashy UI

Allowed:

- subtle shadows
- soft borders
- muted surfaces
- monochrome + accent system colors (from Tailwind globals)

---

### 5. Motion is subtle and functional

Use Framer Motion / GSAP ONLY for:

- page entrance (fade + slight translate)
- card hover elevation
- modal open/close
- number count-up
- chart reveal animation

Avoid:

- cinematic transitions
- parallax-heavy motion
- decorative animations

Motion should feel:

> invisible but premium

---

## Typography System

### Headings

- Large display fonts (editorial feel)
- Tight tracking for hero text
- Strong weight contrast

Example hierarchy:

- H1: 40–56px (desktop), 28–36px (mobile)
- H2: 24–32px
- H3: 18–22px

---

### Body

- Clean sans-serif
- 14–16px default
- high readability
- muted text for secondary content

---

### Numbers (IMPORTANT)

All financial / trust metrics:

- should use tabular numerals
- slightly larger weight
- spaced for clarity

Examples:

- ₦1,240,000+
- 87.5 Trust Score
- 4.5 Rating

---

## Layout Structure (GLOBAL PATTERN)

Every page follows:
[ Identity Core Object ]
[ Trust Signal Strip ]
[ Supporting Intelligence Blocks ]
[ Interaction Layer ]

NOT sections.

---

## Core UI Pattern: Identity Card

This is the most important component in the entire system.

### It contains:

- Business logo (small, refined)
- Business name (primary typography focus)
- Category pill
- Verification badge (minimal)
- Trust score (compact badge, NOT a widget)
- Tier indicator
- Short description (max 2 lines)
- QR code (optional compact placement)

### Design rules:

- no heavy borders
- soft elevation only
- compact but premium
- feels like a “financial identity object”

---

## Trust Signal Strip

A horizontal minimal strip:

Used for:

- credibility reinforcement

Includes:

- Verified status
- Total transactions
- Rating
- Amount processed

Design:

- inline icons (Heroicons)
- no boxes
- just separators or subtle dots

---

## Metrics System

Metrics should NOT look like dashboards.

They should feel like:

> status indicators

Examples:

- “₦1M+ processed”
- “42 successful payments”
- “4.5 rating”

Style:

- bold number + muted label
- inline or small card chips

---

## Chips System (Services & Categories)

Used for:

- services
- categories
- tags

Rules:

- rounded-full
- no background gradients
- subtle border
- hover = slight elevation or tint

Feels like:

> Notion tags or Linear labels

---

## Trust Score Design

Trust score must NOT dominate visually.

Instead:

- compact badge
- circular or pill style
- minimal animation (count-up only)
- color is subtle, not loud

---

## Charts (Trust History)

Rules:

- minimal grid
- thin line
- no heavy axis labels
- soft animation on load
- no dashboard styling

Goal:

> “calm financial signal”, not analytics dashboard

---

## Reviews Design

Style:

- simple vertical feed
- no cards with heavy borders
- light separators only

Each review:

- name (small)
- stars (Heroicons)
- optional comment
- timestamp (muted)

Feels like:

> Stripe invoice notes or Airbnb review snippet

---

## Vendor Card (Digital Object)

This is a standalone UI object.

Think:

> Apple Wallet card / credit card / identity card hybrid

Rules:

- centered composition
- strong typography
- QR code included
- share action
- clean background
- no gradients

It should feel:

> exportable and real

---

## Buttons & Actions

Buttons should feel:

- minimal
- weighty
- intentional

Primary CTA:

- solid background
- no gradients
- subtle hover darkening

Destructive CTA:

- muted red tone
- not aggressive

---

## Icons System

Use Heroicons only.

Rules:

- small size
- consistent stroke width
- used for meaning, not decoration

Examples:

- verified
- star ratings
- phone
- social links
- trust indicators

---

## Interaction Design

### Hover states:

- slight lift (2–4px)
- subtle shadow increase
- no glow

### Focus states:

- clear outline
- accessibility-first

### Loading states:

- skeleton UI only
- no spinners unless necessary

---

## Page Feel Summary

The final UI should feel:

> “A premium identity system for verified real-world merchants”

Not:

- SaaS dashboard
- fintech crypto app
- template UI
- AI-generated layout

---

## What This Design MUST AVOID

- Overuse of cards
- Section-heavy layouts
- Decorative gradients
- Excess motion
- Dashboard analytics styling
- Overly complex visual hierarchy

---

## Final Output Target

If done correctly, the UI should feel like:

- Stripe + Linear merged
- with Apple-level restraint
- and Awwwards-level typography discipline

But still:

> extremely practical for real-world payments in informal markets
