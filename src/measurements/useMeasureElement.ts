import * as React from 'react';

type Options = {
  debounceZeroes?: true;
};

type Rect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

export default function useMeasureElement<
  T extends {
    clientHeight: number;
    clientWidth: number;
    getBoundingClientRect: () => DOMRect;
  },
>(
  options?: Options,
): {
  ref: React.RefCallback<T>;
  rect: Rect | undefined;
} {
  const [rect, setRect] = React.useState<Rect | undefined>();
  const debounceZeroesRef = React.useRef<number | undefined>();
  const debounceZeroes = options?.debounceZeroes;
  const ref = (r: T | null) => {
    if (r != null) {
      const rect_ = r.getBoundingClientRect();
      const setRect_ = (): void => {
        setRect((oldVal: Rect | undefined): Rect | undefined => {
          if (oldVal === undefined) {
            return rect_;
          } else if (
            oldVal.bottom !== rect_.bottom ||
            oldVal.height !== rect_.height ||
            oldVal.left !== rect_.left ||
            oldVal.right !== rect_.right ||
            oldVal.top !== rect_.top ||
            oldVal.width !== rect_.width
          ) {
            return rect_;
          } else {
            return oldVal;
          }
        });
      };
      clearTimeout(debounceZeroesRef?.current);
      if (rect_.width === 0 || (rect_.height === 0 && debounceZeroes)) {
        debounceZeroesRef.current = setTimeout(() => {
          setRect_();
        }, 0) as unknown as number;
      } else {
        setRect_();
      }
    }
  };
  return { rect, ref };
}
