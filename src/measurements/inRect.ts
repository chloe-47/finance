import type { Rect } from './useMeasureElement';

export default function inRect(
  event: Readonly<{ clientX: number; clientY: number }>,
  rect: Rect | null | undefined,
  // If this number is negative, then we'll exclude a little bit of the outside part of the rect
  // If it's positive, we'll include a little bit of space beyond the border of the rect
  tolerance: number,
): boolean {
  if (!rect) {
    return false;
  }
  return (
    rect.top - tolerance <= event.clientY &&
    event.clientY <= rect.bottom + tolerance &&
    rect.left - tolerance <= event.clientX &&
    event.clientX <= rect.right + tolerance
  );
}
