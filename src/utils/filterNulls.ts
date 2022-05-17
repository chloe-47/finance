export default function filterNulls<T>(
  array: ReadonlyArray<T | null | undefined>,
): Array<T> {
  const filtered: Array<T> = [];
  for (const elem of array) {
    if (elem != null) {
      filtered.push(elem);
    }
  }
  return filtered;
}
