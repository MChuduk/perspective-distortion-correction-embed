import "./styles.css";
import { transpose, matMul } from "./matrix";

// prettier-ignore
const eye = [
  [1, 0, 0, 0], 
  [0, 1, 0, 0], 
  [0, 0, 1, 0], 
  [0, 0, 0, 1]
];

const sx = 1; // scale x
const sy = 1; // scale y
const tx = 0; // translate x
const ty = 0; // translate y
// It's important to note shear X fights scale X
// You can attempt to squeeze an image with scale x
// but shear X makes it wide.
// You can try to get rid of an image by scale 0
// but shear X can bring it back.
const shrx = 0; // shear along x (technically value is tan of radians)
const shry = 0; // shear along y (technically value is tan of radians)
// It doesn't make sense to scale or translate Z
// because while this is useful info in 3D, the final
// image is chopped down to 2D for display and
// the 3D information is lost.
// NOTE: This is why `matrix` only has 6 params vs `matrix3d`

// 4th row madness - homogeneous coordinates
const px = 0; // projective x (used in perspective)
const py = 0; // projective y (used in perspective)
const sxy = 1; // scale x and y

// prettier-ignore
const fun = [
  [sx,    shrx,  0,   tx],
  [shry,  sy,    0,   ty],
  [0,     0,     1,    0],
  [px,    py,    0,  sxy]
] //             ^ sometimes used for storage

// The system is a left-handed coordinate system
// This is presumably because y increases down for screen coords
// This means Z goes positive into the screen, and negative towards user
const thirtyDeg = Math.PI / 6;
let angle = thirtyDeg; // rotate 30 degrees
// prettier-ignore
const rotateMatrixZ = [
  [Math.cos(angle), -Math.sin(angle),   0,  0],
  [Math.sin(angle),  Math.cos(angle),   0,  0],
  [              0,                0,   1,  0],
  [              0,                0,   0,  1]
]

angle = thirtyDeg;

// So why is the rotation via Y just squeezing the image?
// prettier-ignore
const rotateMatrixY = [
  [ Math.cos(angle),                  0, Math.sin(angle),   0],
  [               0,                  1,               0,   0],
  [-Math.sin(angle),    Math.cos(angle),               1,   0],
  [               0,                  0,               0,   1]
];

// Let's add some perspective!
const aspectRatio = 600 / 600; // image height / image width
const fov = 140;
const [zFar, zNear] = [400, 0.01];
const zScale = zFar / (zFar - zNear);
const zOffset = zScale * zNear;
const fovScale = 1 / Math.tan(fov / 2);

// // prettier-ignore
// const perspectiveProjectionMatrix = [
//   [aspectRatio * fovScale,          0,        0,          0],
//   [                     0,   fovScale,        0,          0],
//   [                     0,          0,   zScale,   -zOffset],
//   [                     0,          0,        1,          0]
// ]

// prettier-ignore
const perspectiveProjectionMatrix = [
  [1,          0,        0,          0],
  [                     0,   1,        0,          0],
  [                     0,          0,   1,   0],
  [                     0,          0,        1,          1]
]

// Combine multiple matricies via matrix multiplication (aka dot product)
let worldMatrix = eye;
worldMatrix = matMul(perspectiveProjectionMatrix, worldMatrix);
// worldMatrix = matMul(fun, worldMatrix);
// worldMatrix = matMul(rotateMatrixZ, worldMatrix);
// worldMatrix = matMul(rotateMatrixY, worldMatrix);

// You need to transpose the matrix, because we drew our
// matrix as a series of rows, which technically makes it
// RowMajor.  This is easy to code, but the actual math
// is ColumnMajor.  So we transpose the matrix before use.
document.getElementById("app").innerHTML = `
<h1>Perspectives</h1>
<div> 
  <img src="/1.jpg"
    style="
      width: 600px; 
      transform: matrix3d(${transpose(worldMatrix)});
    "
  />

</div>
`;
