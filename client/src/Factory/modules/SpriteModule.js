const SpriteModule = (spriteName) => {
  const _sprite = PhaserContext.physics.add.sprite(-1000, -1000, spriteName);

  const _getSprite = () => {
    return _sprite;
  };

  return {
    getSprite: _getSprite,
  };
};

export default SpriteModule;
