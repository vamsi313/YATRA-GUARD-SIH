/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#102A43',
    tint: '#E05A33',

    // Core surfaces
    background: '#F8F6F1',
    foreground: '#102A43',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#102A43',

    // Primary action color (buttons, links, active states)
    primary: '#E05A33',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E7F0EE',
    secondaryForeground: '#102A43',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#EEF0ED',
    mutedForeground: '#6B7C78',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#F4E4CE',
    accentForeground: '#8A442A',

    // Destructive actions (delete, error states)
    destructive: '#B6423A',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#DDE5E1',
    input: '#DDE5E1',

    ink: '#102A43',
    inkSoft: '#3A5961',
    saffron: '#E05A33',
    saffronSoft: '#F9E3D8',
    teal: '#167D76',
    tealSoft: '#DCEEEB',
    gold: '#D49A42',
    goldSoft: '#F8EBD0',
    danger: '#B6423A',
    dangerSoft: '#F7DEDA',
    blue: '#347A9A',
    blueSoft: '#DCEBF1',
    shadow: '#173B42',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;
