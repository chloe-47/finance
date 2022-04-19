export default function getDateLabel(date: Date): string {
  const label = getDateLabelImpl(date);
  // const todayLabel = getDateLabelImpl(new Date());
  // if (label === todayLabel) {
  //   return 'Today';
  // }
  return label;
}

function getDateLabelImpl(date: Date): string {
  if (date.getMonth() === 1) {
    return (
      // date.toLocaleDateString('en-US', { day: 'numeric' }) +
      // '-' +
      // date.toLocaleDateString('en-US', { month: 'numeric' }) +
      // '/' +
      "'" + date.toLocaleDateString('en-US', { year: '2-digit' })
    );
  } else {
    return '';
  }
}
