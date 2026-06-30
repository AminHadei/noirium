const prefixUnoSegment = (segment: string): string => {
  const trimmed = segment.trim();
  if (trimmed === '' || trimmed.includes(':uno:')) {
    return trimmed;
  }
  return `:uno: ${trimmed}`;
};

/** Prefix a utility string for `transformerCompileClass` in production builds. */
export const prefixUnoClasses = (value: string): string => prefixUnoSegment(value);

/**
 * Tiny, dependency-free variant resolver — the Vue/UnoCSS counterpart to the
 * `cva` helper RetroUI uses on the React side. Variant class strings are plain
 * string literals so UnoCSS can statically extract every utility at build time.
 */
type VariantSchema = Record<string, Record<string, string>>;

type VariantProps<Schema extends VariantSchema> = {
  [Key in keyof Schema]?: keyof Schema[Key];
};

export interface VariantOptions<Schema extends VariantSchema> {
  base?: string;
  variants?: Schema;
  defaultVariants?: VariantProps<Schema>;
}

export type VariantResolver<Schema extends VariantSchema> = (
  props?: VariantProps<Schema> & { class?: string },
) => string;

export const createVariants = <Schema extends VariantSchema>(
  options: VariantOptions<Schema>,
): VariantResolver<Schema> => {
  const { base = '', variants, defaultVariants = {} } = options;

  const variantMap = variants as Record<string, Record<string, string>> | undefined;
  const defaults = defaultVariants as Record<string, string | undefined>;

  return (props = {}): string => {
    const selection = props as Record<string, string | undefined>;
    const classes: string[] = [];
    if (base) {
      classes.push(base);
    }

    if (variantMap) {
      for (const variantName of Object.keys(variantMap)) {
        const selected = selection[variantName] ?? defaults[variantName];
        if (selected === undefined || selected === null) {
          continue;
        }

        const value = variantMap[variantName]?.[selected];
        if (value !== undefined && value !== '') {
          classes.push(value);
        }
      }
    }

    const extraClass = props.class;
    if (extraClass !== undefined && extraClass !== '') {
      classes.push(extraClass);
    }

    return classes.map((segment) => prefixUnoSegment(segment)).join(' ');
  };
};
