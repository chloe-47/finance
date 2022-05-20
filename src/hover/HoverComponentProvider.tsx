import * as React from 'react';
import useStore from '../store/useStore';
import HoverComponentStore from './HoverComponentStore';

export default function HoverComponentProvider(): JSX.Element {
  const { component, coordinates } = useStore(HoverComponentStore);
  if (!component || !coordinates) {
    return <div />;
  }
  return (
    <div style={{ position: 'relative', zIndex: 123 }}>
      <div
        style={{
          bottom: -coordinates.y,
          left: coordinates.x,
          pointerEvents: 'none',
          position: 'absolute',
        }}
      >
        <div
          style={{
            transform: 'translate(-50%, -1em)',
          }}
        >
          {component}
        </div>
      </div>
    </div>
  );
}
