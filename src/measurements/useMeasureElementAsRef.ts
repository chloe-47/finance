import * as React from 'react';

export type Rect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

export default function useMeasureElementAsRef<
  T extends {
    clientHeight: number;
    clientWidth: number;
    getBoundingClientRect: () => DOMRect;
  },
>(): {
  componentRef: React.RefCallback<T>;
  rectRef: React.RefObject<Rect | undefined>;
} {
  const rectRef = React.useRef<Rect | undefined>();
  const componentRef = (r: T | null) => {
    if (r != null) {
      rectRef.current = r.getBoundingClientRect();
    }
  };
  return { componentRef, rectRef };
}
