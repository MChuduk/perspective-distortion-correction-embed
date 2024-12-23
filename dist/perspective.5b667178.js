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
})({"node_modules/perspective-transform/dist/perspective-transform.js":[function(require,module,exports) {
var define;
var global = arguments[3];

// If the user is not including numeric.js already, add shim so this library works. Removes dependency on numeric.js

(function(root) {
	if(root.numeric) {
		return;
	}

	else{
		var numeric = {};

		numeric.dim = function dim(x) {
    		var y,z;
    		if(typeof x === "object") {
        		y = x[0];
        		if(typeof y === "object") {
            		z = y[0];
            		if(typeof z === "object") {
                		return numeric._dim(x);
            		}
            		return [x.length,y.length];
        		}
        		return [x.length];
    		}
    		return [];
		};

		numeric._foreach2 = (function _foreach2(x,s,k,f) {
    		if(k === s.length-1) { return f(x); }
    		var i,n=s[k], ret = Array(n);
    		for(i=n-1;i>=0;i--) { ret[i] = _foreach2(x[i],s,k+1,f); }
    		return ret;
		});

		numeric.cloneV = function (x) {
			var _n = x.length;
			var i, ret = Array(_n);

			for(i=_n-1;i!==-1;--i) {
				ret[i] = (x[i]);
			}
			return ret;
		};

		numeric.clone = function (x) {
			if(typeof x !== "object") return (x);
			var V = numeric.cloneV;
			var s = numeric.dim(x);
			return numeric._foreach2(x,s,0,V);
		};

		numeric.diag = function diag(d) {
    		var i,i1,j,n = d.length, A = Array(n), Ai;
    		for(i=n-1;i>=0;i--) {
        		Ai = Array(n);
        		i1 = i+2;
        		for(j=n-1;j>=i1;j-=2) {
            		Ai[j] = 0;
            		Ai[j-1] = 0;
        		}
        		if(j>i) { Ai[j] = 0; }
        		Ai[i] = d[i];
        		for(j=i-1;j>=1;j-=2) {
            		Ai[j] = 0;
            		Ai[j-1] = 0;
        		}
        		if(j===0) { Ai[0] = 0; }
        		A[i] = Ai;
    		}
    		return A;
		};

		numeric.rep = function rep(s,v,k) {
    		if(typeof k === "undefined") { k=0; }
    		var n = s[k], ret = Array(n), i;
    		if(k === s.length-1) {
        		for(i=n-2;i>=0;i-=2) { ret[i+1] = v; ret[i] = v; }
        		if(i===-1) { ret[0] = v; }
        		return ret;
    		}
    		for(i=n-1;i>=0;i--) { ret[i] = numeric.rep(s,v,k+1); }
    		return ret;
		};

		numeric.identity = function(n) { return numeric.diag(numeric.rep([n],1)); };

		numeric.inv = function inv(a) {
    		var s = numeric.dim(a), abs = Math.abs, m = s[0], n = s[1];
    		var A = numeric.clone(a), Ai, Aj;
    		var I = numeric.identity(m), Ii, Ij;
    		var i,j,k,x;
    		for(j=0;j<n;++j) {
        		var i0 = -1;
        		var v0 = -1;
        		for(i=j;i!==m;++i) { k = abs(A[i][j]); if(k>v0) { i0 = i; v0 = k; } }
        		Aj = A[i0]; A[i0] = A[j]; A[j] = Aj;
        		Ij = I[i0]; I[i0] = I[j]; I[j] = Ij;
        		x = Aj[j];
        		for(k=j;k!==n;++k)    Aj[k] /= x; 
        		for(k=n-1;k!==-1;--k) Ij[k] /= x;
        		for(i=m-1;i!==-1;--i) {
            		if(i!==j) {
                		Ai = A[i];
                		Ii = I[i];
                		x = Ai[j];
                		for(k=j+1;k!==n;++k)  Ai[k] -= Aj[k]*x;
                		for(k=n-1;k>0;--k) { Ii[k] -= Ij[k]*x; --k; Ii[k] -= Ij[k]*x; }
                		if(k===0) Ii[0] -= Ij[0]*x;
            		}
        		}
    		}
    		return I;
		};

		numeric.dotMMsmall = function dotMMsmall(x,y) {
    		var i,j,k,p,q,r,ret,foo,bar,woo,i0;
    		p = x.length; q = y.length; r = y[0].length;
    		ret = Array(p);
    		for(i=p-1;i>=0;i--) {
        		foo = Array(r);
        		bar = x[i];
        		for(k=r-1;k>=0;k--) {
            		woo = bar[q-1]*y[q-1][k];
            		for(j=q-2;j>=1;j-=2) {
                		i0 = j-1;
                		woo += bar[j]*y[j][k] + bar[i0]*y[i0][k];
            		}
            		if(j===0) { woo += bar[0]*y[0][k]; }
            		foo[k] = woo;
        		}
        		ret[i] = foo;
    		}
    		return ret;
		};

		numeric.dotMV = function dotMV(x,y) {
    		var p = x.length, i;
    		var ret = Array(p), dotVV = numeric.dotVV;
    		for(i=p-1;i>=0;i--) { ret[i] = dotVV(x[i],y); }
    		return ret;
		};

		numeric.dotVV = function dotVV(x,y) {
    		var i,n=x.length,i1,ret = x[n-1]*y[n-1];
    		for(i=n-2;i>=1;i-=2) {
        		i1 = i-1;
        		ret += x[i]*y[i] + x[i1]*y[i1];
    		}
    		if(i===0) { ret += x[0]*y[0]; }
    		return ret;
		};

		numeric.transpose = function transpose(x) {
    		var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
    		for(j=0;j<n;j++) ret[j] = Array(m);
    		for(i=m-1;i>=1;i-=2) {
        		A1 = x[i];
        		A0 = x[i-1];
        		for(j=n-1;j>=1;--j) {
            		Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
            		--j;
            		Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
        		}
        		if(j===0) {
            		Bj = ret[0]; Bj[i] = A1[0]; Bj[i-1] = A0[0];
        		}
    		}
    		if(i===0) {
        		A0 = x[0];
        		for(j=n-1;j>=1;--j) {
            		ret[j][0] = A0[j];
            		--j;
            		ret[j][0] = A0[j];
        		}
        		if(j===0) { ret[0][0] = A0[0]; }
    		}
    		return ret;
		};

        this.numeric = numeric;
		root.numeric = numeric;
	}

}(this));


(function(global, factory) {
	if(typeof exports === 'object' && typeof module !== undefined){
		module.exports = factory();
	}
	else if(typeof define === 'function' && define.amd){
		define(factory);
	}
	else{
		global.PerspT = factory();
	}
}(this, function() {
	'use strict';

    function round(num){
        return Math.round(num*10000000000)/10000000000;
    }

	function getNormalizationCoefficients(srcPts, dstPts, isInverse){
		if(isInverse){
			var tmp = dstPts;
			dstPts = srcPts;
			srcPts = tmp;
		}
		var r1 = [srcPts[0], srcPts[1], 1, 0, 0, 0, -1*dstPts[0]*srcPts[0], -1*dstPts[0]*srcPts[1]];
		var r2 = [0, 0, 0, srcPts[0], srcPts[1], 1, -1*dstPts[1]*srcPts[0], -1*dstPts[1]*srcPts[1]];
		var r3 = [srcPts[2], srcPts[3], 1, 0, 0, 0, -1*dstPts[2]*srcPts[2], -1*dstPts[2]*srcPts[3]];
		var r4 = [0, 0, 0, srcPts[2], srcPts[3], 1, -1*dstPts[3]*srcPts[2], -1*dstPts[3]*srcPts[3]];
		var r5 = [srcPts[4], srcPts[5], 1, 0, 0, 0, -1*dstPts[4]*srcPts[4], -1*dstPts[4]*srcPts[5]];
		var r6 = [0, 0, 0, srcPts[4], srcPts[5], 1, -1*dstPts[5]*srcPts[4], -1*dstPts[5]*srcPts[5]];
		var r7 = [srcPts[6], srcPts[7], 1, 0, 0, 0, -1*dstPts[6]*srcPts[6], -1*dstPts[6]*srcPts[7]];
		var r8 = [0, 0, 0, srcPts[6], srcPts[7], 1, -1*dstPts[7]*srcPts[6], -1*dstPts[7]*srcPts[7]];

		var matA = [r1, r2, r3, r4, r5, r6, r7, r8];
		var matB = dstPts;
        var matC;
	
		try{
	    	matC = numeric.inv(numeric.dotMMsmall(numeric.transpose(matA), matA));
		}catch(e){
	    	console.log(e);
	    	return [1,0,0,0,1,0,0,0];
		}

		var matD = numeric.dotMMsmall(matC, numeric.transpose(matA));
		var matX = numeric.dotMV(matD, matB);
        for(var i = 0; i < matX.length; i++) {
            matX[i] = round(matX[i]);
        }
        matX[8] = 1;

		return matX;
	}

	function PerspT(srcPts, dstPts){
		if( (typeof window !== 'undefined' && window === this) || this === undefined) {
			return new PerspT(srcPts, dstPts);
		}

		this.srcPts = srcPts;
		this.dstPts = dstPts;
		this.coeffs = getNormalizationCoefficients(this.srcPts, this.dstPts, false);
		this.coeffsInv = getNormalizationCoefficients(this.srcPts, this.dstPts, true);

		return this;
	}

	PerspT.prototype = {
		transform: function(x,y) {
			var coordinates = [];
			coordinates[0] = (this.coeffs[0]*x + this.coeffs[1]*y + this.coeffs[2]) / (this.coeffs[6]*x + this.coeffs[7]*y + 1);
			coordinates[1] = (this.coeffs[3]*x + this.coeffs[4]*y + this.coeffs[5]) / (this.coeffs[6]*x + this.coeffs[7]*y + 1);
			return coordinates;
		},

		transformInverse: function(x,y) {
			var coordinates = [];
			coordinates[0] = (this.coeffsInv[0]*x + this.coeffsInv[1]*y + this.coeffsInv[2]) / (this.coeffsInv[6]*x + this.coeffsInv[7]*y + 1);
			coordinates[1] = (this.coeffsInv[3]*x + this.coeffsInv[4]*y + this.coeffsInv[5]) / (this.coeffsInv[6]*x + this.coeffsInv[7]*y + 1);
			return coordinates;
		}
	};

	return PerspT;

}));
},{}],"src/matrix.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transpose = exports.matMul = void 0;
// this is necessary due to the stupid order of transform matrix
var transpose = exports.transpose = function transpose(array) {
  return array[0].map(function (_, colIndex) {
    return array.map(function (row) {
      return row[colIndex];
    });
  });
};
var matMul = exports.matMul = function matMul(a, b) {
  var aNumRows = a.length,
    aNumCols = a[0].length,
    bNumCols = b[0].length,
    m = new Array(aNumRows); // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
};
},{}],"src/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRect = getRect;
function getRect(myPoints) {
  var width, height;
  var firstPoint = myPoints[0];
  var secondPoint = myPoints[1];
  var wx = Math.abs(firstPoint[0] - secondPoint[0]);
  var wy = Math.abs(firstPoint[1] - secondPoint[1]);
  var hx = Math.abs(firstPoint[0] - firstPoint[2]);
  var hy = Math.abs(firstPoint[1] - firstPoint[3]);
  width = Math.sqrt(wx * wx + wy * wy);
  height = Math.sqrt(hx * hx + hy * hy);
  return {
    width: width,
    height: height
  };
}
},{}],"src/perspective.js":[function(require,module,exports) {
"use strict";

var _perspectiveTransform = _interopRequireDefault(require("perspective-transform"));
var _matrix = require("./matrix");
var _helpers = require("./helpers");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var partyColor = "#DB14C1";
var canvasEle = document.getElementById("drawContainer");
var context = canvasEle.getContext("2d");
var startPosition = {
  x: 0,
  y: 0
};
var lineCoordinates = {
  x: 0,
  y: 0
};
var isDrawStart = false;
var srcCoords = [[null], [null]];
var resultBoxWidth, resultBoxHeight;

// Failing if scrolled down - update
var getClientOffset = function getClientOffset(event) {
  var rect = canvasEle.getBoundingClientRect();
  var _ref = event.touches ? event.touches[0] : event,
    pageX = _ref.pageX,
    pageY = _ref.pageY;
  var x = pageX - rect.left;
  var y = pageY - rect.top - window.scrollY;
  return {
    x: x,
    y: y
  };
};
var drawLine = function drawLine() {
  context.beginPath();
  context.moveTo(startPosition.x, startPosition.y);
  context.lineTo(lineCoordinates.x, lineCoordinates.y);
  context.strokeStyle = partyColor;
  context.stroke();
};
var mouseDownListener = function mouseDownListener(event) {
  startPosition = getClientOffset(event);
  isDrawStart = true;
};
var mouseMoveListener = function mouseMoveListener(event) {
  if (!isDrawStart) return;
  lineCoordinates = getClientOffset(event);
  clearCanvas();
  drawLine();
};
var mouseupListener = function mouseupListener(_event) {
  isDrawStart = false;
};
var clearCanvas = function clearCanvas() {
  context.clearRect(0, 0, canvasEle.width, canvasEle.height);
};
canvasEle.addEventListener("mousedown", mouseDownListener);
canvasEle.addEventListener("mousemove", mouseMoveListener);
canvasEle.addEventListener("mouseup", mouseupListener);
canvasEle.addEventListener("touchstart", mouseDownListener);
canvasEle.addEventListener("touchmove", mouseMoveListener);
canvasEle.addEventListener("touchend", mouseupListener);

// ZOOM stuffs
var sourceImage = document.getElementById("card");
var sourceCanvas = document.getElementById("drawContainer");
var zoomCanvas = document.getElementById("zoomCanvas");
var zoomContext = zoomCanvas.getContext("2d");
zoomContext.imageSmoothingEnabled = false;
zoomContext.mozImageSmoothingEnabled = false;
zoomContext.webkitImageSmoothingEnabled = false;
zoomContext.msImageSmoothingEnabled = false;
function addCrosshair(ctx, c) {
  var x = c.width / 2;
  var y = c.height / 2;
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 10, y);
  ctx.strokeStyle = partyColor;
  ctx.stroke();
}
function pxzoom(ev) {
  var offset = 10;
  var rect = canvasEle.getBoundingClientRect();
  zoomCanvas.style.visibility = "visible";
  var scaleFactor = sourceImage.naturalWidth / sourceImage.clientWidth;
  var x = ev.layerX * scaleFactor;
  var y = ev.layerY * scaleFactor;
  zoomCanvas.style.left = ev.layerX + rect.left + offset + "px";
  zoomCanvas.style.top = ev.layerY + rect.top + window.scrollY + offset + "px";
  zoomContext.drawImage(sourceImage, Math.abs(x - 5), Math.abs(y - 5), 10, 10, 0, 0, 100, 100);
  addCrosshair(zoomContext, zoomCanvas);
}
sourceCanvas.addEventListener("mousemove", pxzoom, false);
sourceCanvas.addEventListener("mouseout", function (ev) {
  return zoomCanvas.style.visibility = "hidden";
});
var status = document.getElementById("statusBox");
function addPoints(set) {
  srcCoords[set] = [startPosition.x, startPosition.y, lineCoordinates.x, lineCoordinates.y];
  var pretty = srcCoords.map(function (i) {
    return i.map(Math.round);
  });
  status.innerText = "Input Coords: " + pretty.toString();
}
var processImage = function processImage() {
  var scaleFactor = sourceImage.naturalWidth / sourceImage.clientWidth;
  var selectRect = (0, _helpers.getRect)(srcCoords);
  resultBoxWidth = selectRect.width * scaleFactor;
  resultBoxHeight = selectRect.height * scaleFactor;

  // prettier-ignore
  var restultingCoords = [0, 0, 0, resultBoxHeight, resultBoxWidth, 0, resultBoxWidth, resultBoxHeight];
  var scaledSource = srcCoords.flat().map(function (x) {
    return x * scaleFactor;
  });
  var perspT = (0, _perspectiveTransform.default)(scaledSource, restultingCoords);
  // draw fixed image
  var resultImg = document.getElementById("result");
  resultImg.src = sourceImage.src;
  var H = perspT.coeffs;
  // prettier-ignore
  var fullMatrix = [[H[0], H[1], 0, H[2]], [H[3], H[4], 0, H[5]], [0, 0, 1, 0], [H[6], H[7], 0, H[8]]];

  // prettier-ignore
  var noTranslate = [[H[0], H[1], 0, 0], [H[3], H[4], 0, 0], [0, 0, 1, 0], [H[6], H[7], 0, H[8]]];

  // Show with simple CSS transform
  resultImg.style.transform = "matrix3d(".concat((0, _matrix.transpose)(noTranslate), ")");

  // madness
  var canvas = document.createElement("canvas");
  var inScreen = document.getElementById("resultCanvas");
  canvas.width = sourceImage.naturalWidth;
  canvas.height = sourceImage.naturalHeight;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(sourceImage, 0, 0);
  getTransformedCanvas(canvas, "matrix3d(".concat((0, _matrix.transpose)(fullMatrix), ")"), [resultBoxWidth, resultBoxHeight]).then(function (img) {
    inScreen.width = img.naturalWidth;
    inScreen.height = img.naturalHeight;
    inScreen.getContext("2d").drawImage(img, 0, 0);
  }).catch(console.error);
};
document.getElementById("firstLine").addEventListener("click", function () {
  return addPoints(0);
});
document.getElementById("secondLine").addEventListener("click", function () {
  return addPoints(1);
});
document.getElementById("processTransform").addEventListener("click", processImage);

// This function attempts to mimic CSS 3D transforms onto a canvas
// so the result can be saved.  This does so via SVG intermediate
// Unfortunately SVG 3D is not exactly the same as CSS 3D 😢
//https://stackoverflow.com/questions/27177386/svg-matrix3d-renders-differently-in-different-browser
function getTransformedCanvas(canvas, CSSTransform) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [null, null],
    _ref3 = _slicedToArray(_ref2, 2),
    iWidth = _ref3[0],
    iHeight = _ref3[1];
  return new Promise(function (res, rej) {
    var dim = getTransformedDimensions(canvas, CSSTransform);
    var xlinkNS = "http://www.w3.org/1999/xlink",
      svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg"),
      defs = document.createElementNS(svgNS, "defs"),
      style = document.createElementNS(svgNS, "style"),
      image = document.createElementNS(svgNS, "image");
    image.setAttributeNS(xlinkNS, "href", canvas.toDataURL());
    image.setAttribute("width", canvas.width);
    image.setAttribute("height", canvas.height);
    style.innerHTML = "image{transform:" + CSSTransform + ";}";
    svg.appendChild(defs);
    defs.appendChild(style);
    svg.appendChild(image);
    svg.setAttribute("width", iWidth || dim.width);
    svg.setAttribute("height", iHeight || dim.height);
    var svgStr = new XMLSerializer().serializeToString(svg);
    var img = new Image();
    img.onload = function () {
      res(img);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(new Blob([svgStr], {
      type: "image/svg+xml"
    }));
  });
}
function getTransformedDimensions(canvas, CSSTransform) {
  var orphan = !canvas.parentNode;
  if (orphan) document.body.appendChild(canvas);
  var oldTrans = getComputedStyle(canvas).transform;
  canvas.style.transform = CSSTransform;
  var rect = canvas.getBoundingClientRect();
  canvas.style.transform = oldTrans;
  if (orphan) document.body.removeChild(canvas);
  return rect;
}
function changeImage(imgNum) {
  sourceImage.src = "/".concat(imgNum, ".jpg");
  sourceImage.onload = function () {
    sourceCanvas.width = sourceImage.width;
    sourceCanvas.height = sourceImage.height;
  };
}
document.getElementById("firstImg").addEventListener("click", function () {
  return changeImage(1);
});
document.getElementById("secondImg").addEventListener("click", function () {
  return changeImage(2);
});
document.getElementById("thirdImg").addEventListener("click", function () {
  return changeImage(3);
});
document.getElementById("fourthImg").addEventListener("click", function () {
  return changeImage(4);
});
document.getElementById("fifthImg").addEventListener("click", function () {
  return changeImage(5);
});
},{"perspective-transform":"node_modules/perspective-transform/dist/perspective-transform.js","./matrix":"src/matrix.js","./helpers":"src/helpers.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50591" + '/');
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
      });

      // Enable HMR for CSS by default.
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/perspective.js"], null)
//# sourceMappingURL=/perspective.5b667178.js.map