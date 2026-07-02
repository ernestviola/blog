export const transformCount = (count) => {
  // if over 1000 switch to 1k
  // if over million switch to 1M
  if (count >= 10000) {
    const prefix = parseFloat((count / 1000).toFixed(0));
    return prefix.toString() + 'K';
  } else if (count >= 1000) {
    const prefix = parseFloat((count / 1000).toFixed(1));
    return prefix.toString() + 'K';
  }

  return count.toString();
};
