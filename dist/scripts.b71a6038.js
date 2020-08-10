// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var recordButton = document.getElementById("record");
var buttonsElement = document.getElementById('buttons');
var headerElement = document.getElementById("Welcome");
var stopButton = document.getElementById("stop");
var selectorFilter = document.getElementById("audio-filters");
var endOfDoc = document.getElementById('end');
var chunks = [];
var constraints = {
  audio: true
};

var audioCreateContainers = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(stream) {
    var audioCtx, streamDestination, mediaRecorder, startRecord, distortion, source, biquadFilter, biquadFilter2, connectHighPassFilter, connectDistordusFilter, createReverb, _createReverb, elementThatIsNamedSelect;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _createReverb = function _createReverb3() {
              _createReverb = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var convolver, reader, file, arrayBuffer;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        convolver = audioCtx.createConvolver();
                        reader = new FileReader();
                        file = getEmulatorFile(); // equivalent aux 3 lignes suivantes 
                        // readEmulatorFile (file).then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer)).then(buffer=>{
                        //     convolver.buffer=buffer
                        //     return convolver
                        // })

                        _context2.next = 5;
                        return readEmulatorFile(file);

                      case 5:
                        arrayBuffer = _context2.sent;
                        _context2.next = 8;
                        return audioCtx.decodeAudioData(arrayBuffer);

                      case 8:
                        convolver.buffer = _context2.sent;
                        return _context2.abrupt("return", convolver);

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));
              return _createReverb.apply(this, arguments);
            };

            createReverb = function _createReverb2() {
              return _createReverb.apply(this, arguments);
            };

            connectDistordusFilter = function _connectDistordusFilt() {
              source.connect(distortion);

              function makeDistortionCurve(amount) {
                var k = typeof amount === 'number' ? amount : 60,
                    n_samples = 44100,
                    curve = new Float32Array(n_samples),
                    deg = Math.PI / 180,
                    i = 0,
                    x;

                for (; i < n_samples; ++i) {
                  x = i * 2 / n_samples - 1;
                  curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
                }

                return curve;
              }

              distortion.curve = makeDistortionCurve(800);
              distortion.oversample = '4x';
              distortion.connect(streamDestination);
            };

            connectHighPassFilter = function _connectHighPassFilte() {
              source.connect(biquadFilter);
              biquadFilter.type = "highpass";
              biquadFilter.frequency.setValueAtTime(6000, audioCtx.currentTime);
              biquadFilter.connect(biquadFilter2);
              biquadFilter2.type = "peaking";
              biquadFilter2.frequency.setValueAtTime(7000, audioCtx.currentTime);
              biquadFilter2.Q = 20;
              biquadFilter2.gain.setValueAtTime(30, audioCtx.currentTime);
              biquadFilter2.connect(streamDestination);
            };

            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            streamDestination = audioCtx.createMediaStreamDestination();
            mediaRecorder = new MediaRecorder(streamDestination.stream);

            startRecord = function startRecord() {
              mediaRecorder.start();
              stopButton.disabled = false;
              recordButton.disabled = true;
              var resultofchangeButtonColorCall = changeButtonColor(recordButton, "#b61827", "white");
              console.log("result", resultofchangeButtonColorCall);
            };

            recordButton.onclick = startRecord;

            mediaRecorder.ondataavailable = function (blobevent) {
              chunks.push(blobevent.data);
            };

            stopButton.onclick = function () {
              mediaRecorder.stop();
              changeButtonColor(recordButton, "rgb(255, 134,124, .4)", "black");
              stopButton.disabled = true;
              recordButton.disabled = false;
            };

            mediaRecorder.onstop = function (e) {
              var blob = new Blob(chunks, {
                'type': 'audio/ogg; codecs=opus'
              });
              chunks = [];
              var audioURL = window.URL.createObjectURL(blob);
              createElementAudioDisplay(audioURL);
              audioFileName();
            };

            distortion = audioCtx.createWaveShaper();
            source = audioCtx.createMediaStreamSource(stream);
            biquadFilter = audioCtx.createBiquadFilter();
            biquadFilter2 = audioCtx.createBiquadFilter();
            elementThatIsNamedSelect = document.getElementById("audio-filters");
            connectDistordusFilter();
            elementThatIsNamedSelect.addEventListener('change', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var audioFilterSelected, reverb;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      audioFilterSelected = elementThatIsNamedSelect.options[elementThatIsNamedSelect.selectedIndex].value;

                      if (!(audioFilterSelected === "distordus")) {
                        _context.next = 6;
                        break;
                      }

                      biquadFilter2.disconnect();
                      connectDistordusFilter();
                      _context.next = 19;
                      break;

                    case 6:
                      if (!(audioFilterSelected === "HighPass")) {
                        _context.next = 11;
                        break;
                      }

                      distortion.disconnect();
                      connectHighPassFilter();
                      _context.next = 19;
                      break;

                    case 11:
                      if (!(audioFilterSelected === "reverb")) {
                        _context.next = 19;
                        break;
                      }

                      _context.next = 14;
                      return createReverb();

                    case 14:
                      reverb = _context.sent;
                      distortion.disconnect();
                      biquadFilter2.disconnect();
                      source.connect(reverb);
                      reverb.connect(streamDestination);

                    case 19:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })));

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function audioCreateContainers(_x) {
    return _ref.apply(this, arguments);
  };
}();

function changeButtonColor(button, backgroundColor, textColor) {
  button.style.backgroundColor = backgroundColor;
  button.style.color = textColor;
  return "poute";
}

function createElementAudioDisplay(audioURL) {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute("controls", true);
  audioElement.src = audioURL;
  audioElement.className = "audio-display-style"; //audioElement.style.backgroundColor = "rgb(255, 0, 0)"

  document.body.insertBefore(audioElement, endOfDoc);
}

function audioFileName() {
  var newTitle = document.createTextNode("mon titre audio");
  var textEdit = document.createElement("div");
  textEdit.appendChild(newTitle);
  document.body.insertBefore(textEdit, endOfDoc);
}

var onError = function onError(err) {
  console.log('The following error occured: ' + err);
};

function readEmulatorFile(_x2) {
  return _readEmulatorFile.apply(this, arguments);
}

function _readEmulatorFile() {
  _readEmulatorFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(file) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise(function (resolve) {
              var reader = new FileReader();

              reader.onload = function (evt) {
                resolve(evt.target.result);
              };

              reader.readAsArrayBuffer(file);
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _readEmulatorFile.apply(this, arguments);
}

function getEmulatorFile() {
  var reverbFile = document.getElementById("reverb-file");
  return reverbFile.files[0];
}

var onSuccess = function onSuccess(stream) {
  audioCreateContainers(stream);
};

navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
/*function dessiner() {
    var canevas = document.getElementById('tutoriel');
    if (canevas.getContext) {
        var ctx = canevas.getContext('2d');

        var rectangle = new Path2D();
        ctx.fillStyle = 'rgb(0,0, 0)'
        rectangle.rect(10, 10, 50, 50);

        var cercle = new Path2D();
        cercle.moveTo(125, 35);
        cercle.arc(100, 35, 25, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb(255, 0, 0)';


        ctx.fill(rectangle);
        ctx.fill(cercle);

    }
}
dessiner() */
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60857" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts.js"], null)
//# sourceMappingURL=/scripts.b71a6038.js.map