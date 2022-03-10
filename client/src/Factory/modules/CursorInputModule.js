const CursorInputModule = (scene) => {
  if (!scene) throw new Error("must provide scene for input access");
  const _cursor = scene.input.keyboard.createCursorKeys();

  const getCursor = () => _cursor;

  return {
    getCursor,
  };
};

export default CursorInputModule;
