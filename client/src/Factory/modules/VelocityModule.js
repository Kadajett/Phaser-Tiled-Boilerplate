const VelocityModule = (x, y) => {
  const _x = x;
  const _y = y;

  const getXVelocity = () => _x;
  const getYVelocity = () => _y;

  return {
    getXVelocity,
    getYVelocity,
  };
};

export default VelocityModule;
