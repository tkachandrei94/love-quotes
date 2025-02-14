export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandomItemIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};

export const getBasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/love-quotes';
  }
  return '';
};