/**
 * Monochrome design tokens as CSS custom properties.
 *
 * Injected via UnoCSS preflight so variables ship in `virtual:uno.css` /
 * `core.css` and resolve in Storybook, the playground, and host apps. Chart
 * components pass these tokens to ECharts at runtime.
 */
export const themePreflight = `
:root {
  --foreground: #171717;
  --background: #ffffff;
  --primary: #171717;
  --primary-foreground: #ffffff;
  --secondary: #737373;
  --border: #e5e5e5;
  --muted: #f5f5f5;
  --chart-1: #171717;
  --chart-2: #525252;
  --chart-3: #737373;
  --chart-4: #a3a3a3;
  --chart-5: #e5e5e5;
}
`;
