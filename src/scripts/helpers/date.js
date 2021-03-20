export const getNow = () => {
  return new Date();
};

export const addSeconds = (date, seconds) => {
  return new Date(date.getTime() + seconds * 1000);
};

export const getRemainingTime = (date) => {
  const total = Date.parse(date) - Date.parse(getNow());
  const seconds = Math.floor((total / 1000) % 60);
  return { seconds };
};
