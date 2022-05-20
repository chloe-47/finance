import React from 'react';

type Props = {
  label: string;
};

export default function HoverContents({ label }: Props): JSX.Element {
  return <span>{label}</span>;
}
