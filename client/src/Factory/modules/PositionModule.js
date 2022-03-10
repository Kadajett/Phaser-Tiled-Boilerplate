const PositionModule = (x, y) => {
  const _x = x;
  const _y = y;

  const getX = () => _x;
  const getY = () => _y;

  const distanceTo = (target) => {
    const xDiff = _x - target.getX();
    const yDiff = _y - target.getY();
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  };

  return {
    getX,
    getY,
    distanceTo,
  };
};

export default PositionModule;
