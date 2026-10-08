---
name: CareMap AI
description: Original words become understandable care steps.
colors:
  teal: "#087F72"
  teal-hover: "#06695F"
  soft: "#E7F4F0"
  warning: "#FFF5E6"
  canvas: "#F7FAF9"
  surface: "#FFFFFF"
  ink: "#0D2732"
  muted: "#657780"
  border: "#E3EBE8"
typography:
  display:
    fontFamily: "Geist Sans, Arial, sans-serif"
    fontSize: "clamp(42px, 4vw, 58px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.039em"
  headline:
    fontFamily: "Geist Sans, Arial, sans-serif"
    fontSize: "34px"
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  page-title:
    fontFamily: "Geist Sans, Arial, sans-serif"
    fontSize: "clamp(28px, 3vw, 35px)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist Sans, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 650
    lineHeight: 1.45
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist Sans, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  reading:
    fontFamily: "Geist Sans, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Geist Sans, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 550
    lineHeight: 1.4
rounded:
  inset: "8px"
  control: "12px"
  card: "16px"
  panel: "20px"
  pill: "99px"
spacing:
  compact: "8px"
  control-gap: "10px"
  inset: "12px"
  regular: "16px"
  section-gap: "24px"
  panel-padding: "26px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.teal-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
    height: "50px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.teal}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
    height: "50px"
  button-ghost-hover:
    backgroundColor: "{colors.soft}"
  document-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-padding}"
  summary-panel:
    backgroundColor: "{colors.soft}"
    typography: "{typography.reading}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-padding}"
  document-field:
    rounded: "{rounded.control}"
    padding: "18px"
    typography: "{typography.reading}"
---

# Design System: CareMap AI

## Overview

**Creative North Star: "Original words, understandable care steps"**

CareMap AI uses the visual character of a calm clinical document: mist-white space, deep ink, careful teal emphasis, and soft panels that separate a source from its explanation. Geist Sans carries every reading and interface role. The interface feels premium through precise hierarchy and room to read, rather than decorative complexity.

Document input, explanations, actions, and original quotations belong to the same visual family. Source links sit near the statements they support; uncertainty is a visible amber state. The user-approved landing badge and feature cards are part of this build's brief and remain valid patterns for that surface.

**Key Characteristics:**

- Document-centered panels with generous reading space.
- Teal actions and mint explanations on a mist-white canvas.
- Amber panels for details that need clarification.
- Responsive reflow that preserves readable text and reachable controls.

This record derives from the shipped global and responsive styles, landing and input components, and result panels and source inspector. `PRODUCT.md` establishes the palette and font commitments. Small hero-preview text is illustration detail, not a reusable text scale.

## Colors

The palette combines cool paper neutrals with clinical teal and a restrained warm uncertainty surface; frontmatter contains the normative values.

### Primary

- **Clinical Teal** (`teal`): primary actions, source links, selected checks, focus, and restrained headline emphasis.
- **Deep Teal** (`teal-hover`): primary-button hover state.
- **Soft Mint** (`soft`): explanation panels, icon wells, confirmed states, and ghost-button hover.

### Secondary

- **Amber Paper** (`warning`): uncertainty and confirmation-needed states. Warm brown text and warm borders accompany it; amber is not a decorative accent for ordinary cards.

### Neutral

- **Mist White** (`canvas`): page canvas and quiet document backgrounds.
- **Paper White** (`surface`): input, feature, result, and source containers.
- **Deep Ink** (`ink`): primary reading text, headings, and ordinary control labels.
- **Slate Gray** (`muted`): supporting descriptions and metadata.
- **Soft Gray-Green** (`border`): panel boundaries and interior dividers.

### Named Rules

**The Teal Action Rule.** Keep actionable links and primary controls teal; use ink for the surrounding reading hierarchy.

**The Useful Uncertainty Rule.** Amber surfaces identify information that needs clarification. Pair the color with explicit text so the state remains understandable without color.

## Typography

**Display Font:** Geist Sans with Arial and sans-serif fallbacks.

**Body Font:** Geist Sans with the same fallbacks; no separate display or monospace family is established.

**Character:** A single precise sans-serif keeps three languages in one interface. Medium and semibold headings use modest negative tracking; paragraphs retain normal tracking and open line height.

### Hierarchy

- **Display:** the frontmatter display role is the desktop English hero. Below the compact breakpoint it uses `clamp(34px, 10vw, 44px)`; Uzbek and Russian have smaller language-specific sizes to accommodate their text.
- **Headline:** section headings use the headline role; mobile sections step down to roughly (28–29px).
- **Page title:** results use the responsive page-title role. The input page uses a related heading (32px, weight 550, line height 1.3), stepping to (29px) on mobile and (27px) at the narrowest width.
- **Title:** result panel headings use the title role and step to (18px) on phones. Action and feature headings sit below this in the hierarchy.
- **Body / Reading:** ordinary body text uses the body role; summaries and documents use the more open reading role. Results below the source-sidebar breakpoint use body paragraphs of (15px), supporting text of (14px), and source-document reading of (16px).
- **Label:** buttons use the label role. Smaller desktop metadata is subordinate; mobile controls increase their labels rather than shrinking body copy.

### Named Rules

**The Readable Reflow Rule.** Reflow columns before reducing reading size. Keep the document textarea at (16px) through the tablet layout and mobile result paragraphs at (15px).

## Layout

Page shells are centered with a maximum width of (1240px). Horizontal gutters step from (40px) to (30px), then (22px) on phones and (16px) at the narrowest width. Grid tracks use zero minimum widths so translated content can wrap within its column. Spacing is practical rather than a rigid mathematical scale: compact controls cluster around the frontmatter inset values, while document panels use the recurring panel padding.

The landing hero has two balanced columns on large screens, then a single centered column at (850px) and below. Feature cards reflow from four columns to two at the same breakpoint and to one at (600px). The input workspace likewise loses its secondary aside at (850px). Mobile primary actions fill the available width; navigation becomes a menu at (850px).

Results keep explanation and original source in adjacent columns at (1024px) and above, with the source sticky below the header. At (1023px) and below, the main column is capped at (710px) and the source opens as a bottom drawer. The drawer respects safe areas, uses dynamic viewport height, scrolls its document region internally, and locks page scrolling while open. Toolbar actions wrap; very narrow screens use a single toolbar column.

**The Source Beside Meaning Rule.** On wide screens, keep original wording beside the explanation. On smaller screens, preserve direct source access through a readable drawer rather than squeezing a second column.

## Elevation & Depth

The working interface is mostly flat: white and mint panels, soft strokes, and tonal insets establish hierarchy. Primary controls have a subtle teal-tinted shadow. Stronger diffuse shadows belong to overlapping document imagery and temporary menus or popovers, where they explain layering.

### Shadow Vocabulary

- **Primary control:** `0 4px 10px #087F7212`; hover uses `0 6px 14px #087F7220`.
- **Temporary menu:** `0 12px 24px #0D273210`.
- **Layered preview:** `0 22px 60px #0C3B3214, 0 3px 10px #0C3B3207`; a landing illustration treatment, not the default result-card shadow.

**The Quiet Panel Rule.** Keep document and result containers flat at rest. Use tonal separation and borders before adding elevation.

## Shapes

Controls have softly curved corners; full-size document and result panels have larger rounded corners. Small insets use tighter corners. Status badges can be pill-shaped, while numbered markers and checklist status markers are circular. Panels use delicate single-pixel strokes. The mobile source drawer rounds only its upper corners (22px), reinforcing its attachment to the bottom of the viewport.

## Components

### Buttons

Clear, compact, and confident. Primary, secondary, and ghost variants share the control radius and common label role. Primary is teal on white text; secondary is white with a gray-green border; ghost is transparent teal text. Hover gently lifts by (1px), active moves down by (1px), and keyboard focus has a visible (3px) outline with (4px) offset. Touch controls have a minimum target of (44px); primary mobile actions are (50px) tall. Disable the hover lift for devices without hover and respect reduced motion.

### Chips

Informational status chips combine short labels with a dot or outline icon. Mint means a ready or live state; warm paper identifies fictional demo or confirmation-needed context. The hero badge is specifically approved for the landing. Chips communicate state and do not replace buttons or paragraph text.

### Cards / Containers

White feature and document panels use soft borders, larger corners, and open internal spacing. Feature cards lift slightly on hover; result panels stay flat. Summary panels use mint fill with dark green text. Amber uncertainty panels use a warm stroke and explicit clarification language. Mobile panels decrease padding and corners slightly while keeping their text readable.

### Inputs / Fields

The document textarea is a near-white paper surface with a gray-green stroke, control corners, vertical resizing, and generous line height. Focus changes it to white with a teal outline. Desktop text is (15px); tablet and phone input is (16px). Labels remain above the field, helper text wraps below it, and errors occupy their own warm-red message surface. Consent checkboxes use teal and expand from (16px) to (20px) on phones.

### Navigation

The wordmark anchors a quiet header. Desktop text links are muted until hover; language selection stays visible in both layouts. Compact navigation opens a white bordered menu with full-height link rows (48px). Icon-only controls need accessible names and (44px) touch targets. Use the existing Lucide outline icon family rather than adding an unrelated visual language.

### Care timeline and source inspector

The action list uses a thin connecting rule, circular outline markers, clear action titles, optional date or clarification chips, nearby source links, and a separate checkbox target. Tracked steps fill the marker with teal. Source selection highlights an exact passage with a soft green fill and preserves the document's original language and line breaks. The source drawer uses the same paper and mint vocabulary as the desktop inspector.

Motion is brief and purposeful: control transitions around (180ms), result arrival (240ms), and source drawer opening (200ms). Reduced-motion preferences remove result and drawer animation and scrolling animation.

## Do's and Don'ts

### Do:

- **Do** keep Geist Sans, the mist-white canvas, deep ink, teal actions, and amber uncertainty roles.
- **Do** keep source links near supported statements and exact quotes visibly distinct from explanation.
- **Do** reflow for translation and narrow screens, preserving readable document text and touch targets.
- **Do** preserve the user-approved landing badge and feature-card pattern when extending that surface.
- **Do** keep keyboard focus visible and respect reduced-motion and safe-area preferences.

### Don't:

- **Don't** use amber as ordinary decorative emphasis or let color alone communicate uncertainty.
- **Don't** carry tiny hero-preview illustration text into reading or input components.
- **Don't** make the layered hero-preview shadow the default for every working panel.
- **Don't** truncate source quotations or shrink a second source column to fit a phone.
- **Don't** treat uppercase action-category labels or the miniature plus glyph as a new typography or icon system.
