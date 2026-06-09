export const FILTER_ARRAY_SEPARATOR = ","

export function toCommaSeparatedFilter(
  values: string[],
): string | undefined {
  return values.length > 0 ? values.join(FILTER_ARRAY_SEPARATOR) : undefined
}
