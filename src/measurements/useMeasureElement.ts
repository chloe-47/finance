import * as React from 'react';

type Options = {
  debounceZeroes?: true;
};

export default function useMeasureElement<
  T extends { clientHeight: number; clientWidth: number },
>(
  options?: Options,
): {
  ref: React.RefCallback<T>;
  height: number | undefined;
  width: number | undefined;
} {
  const [width, setWidth] = React.useState<number | undefined>();
  const [height, setHeight] = React.useState<number | undefined>();
  const debounceZeroesRef = React.useRef<number | undefined>();
  const debounceZeroes = options?.debounceZeroes;
  const ref = (r: T | null) => {
    if (r != null) {
      const newWidth = r.clientWidth;
      const newHeight = r.clientHeight;
      const setWidthAndHeight = (): void => {
        setWidth(newWidth);
        setHeight(newHeight);
      };
      clearTimeout(debounceZeroesRef?.current);
      if (width === 0 || (height === 0 && debounceZeroes)) {
        debounceZeroesRef.current = setTimeout(() => {
          setWidthAndHeight();
        }, 0) as unknown as number;
      } else {
        setWidthAndHeight();
      }
    }
  };
  return { height, ref, width };
}
