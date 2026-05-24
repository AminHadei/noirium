export interface SharedWebComponentStyle {
  id: string;
  cssText: string;
}

const hasConstructableStylesheetSupport = ((): boolean => {
  if (globalThis.ShadowRoot === undefined || globalThis.CSSStyleSheet === undefined) {
    return false;
  }

  return (
    'adoptedStyleSheets' in globalThis.ShadowRoot.prototype &&
    'replaceSync' in globalThis.CSSStyleSheet.prototype
  );
})();

const sharedStylesheetCache = new Map<string, CSSStyleSheet>();
const fallbackStyleTemplateCache = new Map<string, HTMLStyleElement>();

const createStyleToken = (id: string, cssText: string): string => {
  let hash = 0;
  for (const character of cssText) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }

    hash = (hash * 31 + codePoint) % 2147483647;
  }

  return `${id}-${Math.trunc(Math.abs(hash)).toString(36)}`;
};

const getOrCreateSharedStylesheet = (token: string, cssText: string): CSSStyleSheet => {
  const cached = sharedStylesheetCache.get(token);
  if (cached) {
    return cached;
  }

  const stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(cssText);
  sharedStylesheetCache.set(token, stylesheet);
  return stylesheet;
};

const getOrCreateFallbackTemplate = (token: string, cssText: string): HTMLStyleElement => {
  const cached = fallbackStyleTemplateCache.get(token);
  if (cached) {
    return cached;
  }

  const styleElement = globalThis.document.createElement('style');
  styleElement.dataset['sharedWebcStyle'] = token;
  styleElement.textContent = cssText;
  fallbackStyleTemplateCache.set(token, styleElement);
  return styleElement;
};

export const adoptSharedWebComponentStyles = (
  shadowRoot: ShadowRoot | null,
  styles: SharedWebComponentStyle[],
): void => {
  if (!shadowRoot || styles.length === 0) {
    return;
  }

  const normalizedStyles = styles.map((style) => ({
    ...style,
    token: createStyleToken(style.id, style.cssText),
  }));

  if (hasConstructableStylesheetSupport) {
    const stylesheets = normalizedStyles.map(({ token, cssText }) =>
      getOrCreateSharedStylesheet(token, cssText),
    );
    const missingStylesheets = stylesheets.filter(
      (stylesheet) => !shadowRoot.adoptedStyleSheets.includes(stylesheet),
    );

    if (missingStylesheets.length > 0) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, ...missingStylesheets];
    }
    return;
  }

  for (const { token, cssText } of normalizedStyles) {
    const hasStyle = shadowRoot.querySelector(`style[data-shared-webc-style="${token}"]`);
    if (hasStyle) {
      continue;
    }

    const styleTemplate = getOrCreateFallbackTemplate(token, cssText);
    shadowRoot.append(styleTemplate.cloneNode(true));
  }
};
