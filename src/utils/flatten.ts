export default function flatten<T>(
  array: ReadonlyArray<ReadonlyArray<T>>,
): ReadonlyArray<T> {
  const flattened: Array<T> = [];
  for (const elem of array) {
    for (const subElem of elem) {
      flattened.push(subElem);
    }
  }
  return flattened;
}
