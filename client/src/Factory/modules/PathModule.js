import easystarjs from 'easystarjs';

const PathModule = (scene) => {
  const _easystar = new easystarjs.js();
  const _path = [];
  const _pathfinder = (start, end) => {
    _easystar.setGrid(scene.map.getLayer("collision").data);
    _easystar.setAcceptableTiles([0]);
    _easystar.findPath(
      start.getX(),
      start.getY(),
      end.getX(),
      end.getY(),
      (path) => {
        if (path === null) {
          console.log("Path was not found.");
        } else {
          _path = path;
        }
      }
    );
    _easystar.calculate();
  };
  const _getPath = () => {
    return _path;
  };
  return {
    pathTo: _pathfinder,
    getPath: _getPath,
  };
};

export default PathModule;