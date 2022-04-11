import * as React from 'react';

type Props = {
  label: string;
};

export default function DateLabel({ label }: Props): JSX.Element {
  return (
    <span style={{ color: '#dad', fontFamily: 'sans-serif' }}>{label}</span>
  );
}
