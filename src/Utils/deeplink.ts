export const getRandomColor = () => {
  const color = [
    'PINK',
    'ORANGE',
    'YELLOW',
    'GREEN',
    'MINT',
    'SKY_BLUE',
    'BLUE',
    'PURPLE',
    'LAVENDER',
  ];

  return '/' + color[Math.floor(Math.random() * color.length)];
};
