const addPaddingIfNeeded = number => `${number < 10 ? '0': ''}${number}`;

const getHumanReadableTime = time => {
  const hours = addPaddingIfNeeded(new Date(time).getHours());
  const minutes = addPaddingIfNeeded(new Date(time).getMinutes());
  return `${hours}:${minutes}`;
};

export { getHumanReadableTime };
