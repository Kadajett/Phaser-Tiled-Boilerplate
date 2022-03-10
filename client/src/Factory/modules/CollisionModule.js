const CollisionModule = (sprite, collisionLayer, scene) => {
  const _sprite = sprite;
  const _collisionLayer = collisionLayer;

  scene.physics.add.collider(_sprite, _collisionLayer);
};

export default CollisionModule;
