import React from 'react';
import shortValue from 'src/values/shortValue';
import type { HoverContentsRenderData } from '../utils/MappedCoordinates';

const dollarFormatter = Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
});

type Props = {
  data: HoverContentsRenderData;
};

export default function HoverContents({ data }: Props): JSX.Element {
  const { label, point } = data;
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: '500' }}>
        {shortValue(point.value)}
      </div>
      <br />
      <div style={{ fontSize: 12 }}>
        <div>{dollarFormatter.format(point.value)}</div>
        <div>
          {point.date.date.toLocaleString('default', { month: 'short' })}{' '}
          {point.date.date.getFullYear()}
        </div>
        <div>{label}</div>
      </div>
    </div>
  );
}
