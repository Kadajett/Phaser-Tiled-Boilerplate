!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e =
        "undefined" != typeof globalThis
          ? globalThis
          : e || self).rexoutlinepipelineplugin = t());
})(this, function () {
  "use strict";
  function u(e) {
    return (u =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function o(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(e, r.key, r);
    }
  }
  function i(e, t, n) {
    return t && r(e.prototype, t), n && r(e, n), e;
  }
  function s(e, t) {
    if ("function" != typeof t && null !== t)
      throw new TypeError("Super expression must either be null or a function");
    (e.prototype = Object.create(t && t.prototype, {
      constructor: { value: e, writable: !0, configurable: !0 },
    })),
      t && n(e, t);
  }
  function l(e) {
    return (l = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        })(e);
  }
  function n(e, t) {
    return (n =
      Object.setPrototypeOf ||
      function (e, t) {
        return (e.__proto__ = t), e;
      })(e, t);
  }
  function a(e, t) {
    if (t && ("object" == typeof t || "function" == typeof t)) return t;
    if (void 0 !== t)
      throw new TypeError(
        "Derived constructors may only return object or undefined"
      );
    return (function (e) {
      if (void 0 === e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return e;
    })(e);
  }
  function f(r) {
    var o = (function () {
      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ("function" == typeof Proxy) return !0;
      try {
        return (
          Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function () {})
          ),
          !0
        );
      } catch (e) {
        return !1;
      }
    })();
    return function () {
      var e,
        t = l(r);
      if (o) {
        var n = l(this).constructor;
        e = Reflect.construct(t, arguments, n);
      } else e = t.apply(this, arguments);
      return a(this, e);
    };
  }
  function c(e, t, n) {
    return (c =
      "undefined" != typeof Reflect && Reflect.get
        ? Reflect.get
        : function (e, t, n) {
            var r = (function (e, t) {
              for (
                ;
                !Object.prototype.hasOwnProperty.call(e, t) &&
                null !== (e = l(e));

              );
              return e;
            })(e, t);
            if (r) {
              var o = Object.getOwnPropertyDescriptor(r, t);
              return o.get ? o.get.call(n) : o.value;
            }
          })(e, t, n || e);
  }
  function t(e) {
    void 0 === e && (e = 0.1);
    var t = Math.max(100 * e, 1),
      n = ((2 * Math.PI) / t).toFixed(7);
    return "#ifdef GL_FRAGMENT_PRECISION_HIGH\n#define highmedp highp\n#else\n#define highmedp mediump\n#endif\nprecision highmedp float;\n\n// Scene buffer\nuniform sampler2D uMainSampler; \nvarying vec2 outTexCoord;\n\n// Effect parameters\nuniform vec2 texSize;\nuniform float thickness;\nuniform vec3 outlineColor;\n\nconst float DOUBLE_PI = 3.14159265358979323846264 * 2.;\n\nvoid main() {\n  vec4 front = texture2D(uMainSampler, outTexCoord);\n\n  if (thickness > 0.0) {\n    vec2 mag = vec2(thickness/texSize.x, thickness/texSize.y);\n    vec4 curColor;\n    float maxAlpha = front.a;\n    vec2 offset;\n    for (float angle = 0.; angle < DOUBLE_PI; angle += #{angleStep}) {\n        offset = vec2(mag.x * cos(angle), mag.y * sin(angle));        \n        curColor = texture2D(uMainSampler, outTexCoord + offset);\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    vec3 resultColor = front.rgb + (outlineColor.rgb * (1. - front.a)) * maxAlpha;\n    gl_FragColor = vec4(resultColor, maxAlpha);\n  } else {\n    gl_FragColor = front;\n  }\n}\n".replace(
      /\#\{angleStep\}/,
      n
    );
  }
  function p(e) {
    return null == e || "" === e || 0 === e.length;
  }
  var e = Phaser.Renderer.WebGL.Pipelines.PostFXPipeline,
    h = Phaser.Utils.Objects.GetValue,
    y = Phaser.Display.Color.IntegerToRGB,
    v = Phaser.Display.Color,
    d = 0.1,
    g = t(d),
    m = (function () {
      s(r, e);
      var n = f(r);
      function r(e) {
        var t;
        return (
          o(this, r),
          ((t = n.call(this, {
            name: "rexOutlinePostFx",
            game: e,
            renderTarget: !0,
            fragShader: g,
          })).thickness = 0),
          (t._outlineColor = new v()),
          t
        );
      }
      return (
        i(
          r,
          [
            {
              key: "resetFromJSON",
              value: function (e) {
                return (
                  this.setThickness(h(e, "thickness", 3)),
                  this.setOutlineColor(h(e, "outlineColor", 16777215)),
                  this
                );
              },
            },
            {
              key: "onPreRender",
              value: function () {
                this.set1f("thickness", this.thickness),
                  this.set3f(
                    "outlineColor",
                    this._outlineColor.redGL,
                    this._outlineColor.greenGL,
                    this._outlineColor.blueGL
                  ),
                  this.set2f(
                    "texSize",
                    this.renderer.width,
                    this.renderer.height
                  );
              },
            },
            {
              key: "setThickness",
              value: function (e) {
                return (this.thickness = e), this;
              },
            },
            {
              key: "outlineColor",
              get: function () {
                return this._outlineColor;
              },
              set: function (e) {
                "number" == typeof e && (e = y(e)),
                  this._outlineColor.setFromRGB(e);
              },
            },
            {
              key: "setOutlineColor",
              value: function (e) {
                return (this.outlineColor = e), this;
              },
            },
          ],
          [
            {
              key: "setQuality",
              value: function (e) {
                d !== e && (g = t((d = e)));
              },
            },
            {
              key: "getQuality",
              value: function () {
                return d;
              },
            },
          ]
        ),
        r
      );
    })(),
    P = Phaser.Utils.Array.SpliceOne,
    b = (function () {
      s(t, Phaser.Plugins.BasePlugin);
      var e = f(t);
      function t() {
        return o(this, t), e.apply(this, arguments);
      }
      return (
        i(t, [
          {
            key: "setPostPipelineClass",
            value: function (e, t) {
              return (
                (this.PostFxPipelineClass = e),
                (this.postFxPipelineName = t),
                this
              );
            },
          },
          {
            key: "start",
            value: function () {
              this.game.events.once("destroy", this.destroy, this),
                this.game.renderer.pipelines.addPostPipeline(
                  this.postFxPipelineName,
                  this.PostFxPipelineClass
                );
            },
          },
          {
            key: "add",
            value: function (e, t) {
              void 0 === t && (t = {}),
                e.setPostPipeline(this.PostFxPipelineClass);
              var n = e.postPipelines[e.postPipelines.length - 1];
              return n.resetFromJSON(t), t.name && (n.name = t.name), n;
            },
          },
          {
            key: "remove",
            value: function (e, t) {
              var n = this.PostFxPipelineClass;
              if (void 0 === t)
                for (var r = (o = e.postPipelines).length - 1; 0 <= r; r--) {
                  (s = o[r]) instanceof n && (s.destroy(), P(o, r));
                }
              else {
                r = 0;
                for (var o, i = (o = e.postPipelines).length; r < i; r++) {
                  var s;
                  (s = o[r]) instanceof n &&
                    s.name === t &&
                    (s.destroy(), P(o, r));
                }
              }
              return this;
            },
          },
          {
            key: "get",
            value: function (e, t) {
              var n = this.PostFxPipelineClass;
              if (void 0 === t) {
                for (
                  var r = [], o = 0, i = (s = e.postPipelines).length;
                  o < i;
                  o++
                ) {
                  (l = s[o]) instanceof n && r.push(l);
                }
                return r;
              }
              var s;
              for (o = 0, i = (s = e.postPipelines).length; o < i; o++) {
                var l;
                if ((l = s[o]) instanceof n && l.name === t) return l;
              }
            },
          },
        ]),
        t
      );
    })(),
    x = Phaser.Utils.Objects.GetValue,
    C = (function () {
      s(r, b);
      var n = f(r);
      function r(e) {
        var t;
        return (
          o(this, r),
          (t = n.call(this, e)).setPostPipelineClass(m, "rexOutlinePostFx"),
          t
        );
      }
      return (
        i(r, [
          {
            key: "add",
            value: function (e, t) {
              return (
                this.setQuality(x(t, "quality", this.quality)),
                c(l(r.prototype), "add", this).call(this, e, t)
              );
            },
          },
          {
            key: "setQuality",
            value: function (e) {
              return m.setQuality(e), this;
            },
          },
          {
            key: "quality",
            get: function () {
              return m.getQuality();
            },
            set: function (e) {
              this.setQuality(e);
            },
          },
        ]),
        r
      );
    })();
  return (
    (function (e, t, n) {
      if ("object" === u(e)) {
        if (p(t)) {
          if (null == n) return;
          "object" === u(n) && (e = n);
        } else {
          "string" == typeof t && (t = t.split("."));
          var r = t.pop();
          (function (e, t, n) {
            var r = e;
            if (!p(t)) {
              var o;
              "string" == typeof t && (t = t.split("."));
              for (var i = 0, s = t.length; i < s; i++) {
                var l;
                if (null == r[(o = t[i])] || "object" !== u(r[o]))
                  (l = i !== s - 1 || void 0 === n ? {} : n), (r[o] = l);
                r = r[o];
              }
            }
            return r;
          })(e, t)[r] = n;
        }
      }
    })(window, "RexPlugins.Pipelines.OutlinePostFx", m),
    C
  );
});
