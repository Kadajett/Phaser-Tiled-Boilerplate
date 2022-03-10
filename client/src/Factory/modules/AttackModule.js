const AttackModule = (strength) => {
  const _strength = strength;
  let _currentTarget = null;

  const _getStrength = () => _strength;
  const _setStrength = (strength) => (_strength = strength);
  const _getCurrentTarget = () => _currentTarget;
  const _setCurrentTarget = (target) => (_currentTarget = target);

  return {
    getStrength: _getStrength,
    setStrength: _setStrength,
    getCurrentTarget: _getCurrentTarget,
    setCurrentTarget: _setCurrentTarget,
  };
};

export default AttackModule;
