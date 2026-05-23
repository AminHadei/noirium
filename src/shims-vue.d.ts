// Source - https://stackoverflow.com/a
// Posted by hatef
// Retrieved 2026-01-05, License - CC BY-SA 4.0

declare module '*.vue';

declare module 'virtual:core-styles' {
  const css: string;
  export default css;
}
