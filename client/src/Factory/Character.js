const CharacterFactory = (name) => {
    const _modules = {};
  
    const _addModule = (moduleName, module) => {
      _modules[moduleName] = module;
    };
  
    const _getModule = (moduleName) => {
      return _modules[moduleName];
    };
  
    const _getModuleNames = () => {
      return Object.keys(_modules);
    };
    return {
      addModule: _addModule,
      getModule: _getModule,
      getModuleNames: _getModuleNames,
      ..._modules
    };
  };
  
  // Dijkstra
  
  
  
  
  
  const player = CharacterFactory("player");
  const enemy = CharacterFactory("enemy");
  
  player.addModule("sprite", SpriteModule("goblin"));
  player.addModule("position", PositionModule(100, 100));
  player.addModule("velocity", VelocityModule(0, 0));
  // player.addModule("input", CursorInputModule());
  player.addModule("attack", AttackModule(10));
  
  enemy.addModule("sprite", SpriteModule("goblin"));
  enemy.addModule("position", PositionModule(200, 200));
  enemy.addModule("velocity", VelocityModule(0, 0));
  enemy.addModule("path", PathModule());
  enemy.addModule("attack", AttackModule(10));
  
  enemy.getModule("attack").setCurrentTarget(player);
  
  const characters = [player, enemy];
  
  characters.forEach((character) => {
    character.getModuleNames().forEach((moduleName) => {
      const sprite = character.getModule("sprite")?.getSprite?.();
  
      const position = character.getModule("position");
      const velocity = character.getModule("velocity");
      const attack = character.getModule("attack");
      if (sprite) {
        if (position) {
          sprite.x = position.getX();
          sprite.y = position.getY();
        }
        if (velocity) {
          sprite.setVelocity(
            character.getModule("velocity").getXVelocity(),
            character.getModule("velocity").getYVelocity()
          );
        }
        if (attack) {
          const currentTarget = attack.getCurrentTarget();
          if (currentTarget) {
            const targetPosition = currentTarget.getModule("position");
            if (position && targetPosition) {
              const pathTo = character
                .getModule("path")
                ?.pathTo(targetPosition, position);
              if (pathTo) {
                console.log("path to: ", pathTo);
              }
            }
          }
        }
      }
    });
  });
  