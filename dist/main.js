/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/src/assets/magecitycut.png":
/*!*******************************************!*\
  !*** ./client/src/assets/magecitycut.png ***!
  \*******************************************/
/***/ (() => {

eval("throw new Error(\"Module parse failed: Unexpected character '�' (1:0)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n(Source code omitted for this binary file)\");\n\n//# sourceURL=webpack://rpgphasertest1/./client/src/assets/magecitycut.png?");

/***/ }),

/***/ "./client/src/FakeCity.js":
/*!********************************!*\
  !*** ./client/src/FakeCity.js ***!
  \********************************/
/***/ (() => {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nTypeError: /Users/jeremystover/Dev/gamedev/RPGPhaserTest1/client/src/FakeCity.js: Cannot read properties of null (reading 'bindings')\\n    at Scope.moveBindingTo (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/@babel/traverse/lib/scope/index.js:993:13)\\n    at BlockScoping.updateScopeInfo (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/babel-plugin-transform-es2015-block-scoping/lib/index.js:364:17)\\n    at BlockScoping.run (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/babel-plugin-transform-es2015-block-scoping/lib/index.js:330:12)\\n    at PluginPass.BlockStatementSwitchStatementProgram (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/babel-plugin-transform-es2015-block-scoping/lib/index.js:70:24)\\n    at newFn (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/@babel/traverse/lib/visitors.js:177:21)\\n    at NodePath._call (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/@babel/traverse/lib/path/context.js:53:20)\\n    at NodePath.call (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/@babel/traverse/lib/path/context.js:40:17)\\n    at NodePath.visit (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/@babel/traverse/lib/path/context.js:100:31)\\n    at TraversalContext.visitQueue (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/@babel/traverse/lib/context.js:103:16)\\n    at TraversalContext.visitSingle (/Users/jeremystover/Dev/gamedev/RPGPhaserTest1/node_modules/@babel/traverse/lib/context.js:77:19)\");\n\n//# sourceURL=webpack://rpgphasertest1/./client/src/FakeCity.js?");

/***/ }),

/***/ "./client/src/app.js":
/*!***************************!*\
  !*** ./client/src/app.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar _magecitycut = __webpack_require__(/*! ./assets/magecitycut.png */ \"./client/src/assets/magecitycut.png\");\n\nvar _magecitycut2 = _interopRequireDefault(_magecitycut);\n\nvar _FakeCity = __webpack_require__(/*! ./FakeCity */ \"./client/src/FakeCity.js\");\n\nvar _FakeCity2 = _interopRequireDefault(_FakeCity);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar config = {\n  type: Phaser.AUTO,\n  width: 800,\n  height: 600,\n  physics: {\n    default: \"arcade\",\n    arcade: {\n      gravity: {\n        y: 0,\n        x: 0\n      }\n    }\n  },\n  scene: {\n    preload: preload,\n    create: create\n  }\n};\nvar game = new Phaser.Game(config);\n\nfunction preload() {\n  this.load.image(\"city\", _magecitycut2.default);\n}\n\nfunction create() {\n  // this.add.image(400, 300, \"sky\");\n  var array = [[0, 1, 2, 22], [17, 18, 19], [34, 35, 36]];\n  var map = this.make.tilemap({\n    key: \"cityMap\",\n    tileWidth: 32,\n    tileHeight: 32,\n    data: _FakeCity2.default.layers[0].data,\n    width: _FakeCity2.default.width,\n    height: _FakeCity2.default.height\n  });\n  var tileset = map.addTilesetImage(\"city\");\n  var layer = map.createLayer(0, \"city\", 0, 0); // this.cameras.main.centerOn(100, 100);\n}\n\n//# sourceURL=webpack://rpgphasertest1/./client/src/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/src/app.js");
/******/ 	
/******/ })()
;