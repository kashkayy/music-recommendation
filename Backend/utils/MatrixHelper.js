function createMatrix(rows, cols) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
}

function createIdentityMatrix(n) {
  let identityMatrix = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    identityMatrix.push(row);
  }
  return identityMatrix;
}

function addTwoMatrices(m1, m2) {
  if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
    return;
  }

  const rows = m1.length;
  const cols = m1[0].length;
  const resultMatrix = [];

  for (let i = 0; i < rows; i++) {
    resultMatrix[i] = [];
    for (let j = 0; j < cols; j++) {
      resultMatrix[i][j] = m1[i][j] + m2[i][j];
    }
  }
  return resultMatrix;
}

function addMultipleMatrices(...matrices) {
  if (matrices.length === 0) {
    return [];
  }
  let sumMatrix = matrices[0];
  for (let i = 1; i < matrices.length; i++) {
    sumMatrix = addTwoMatrices(sumMatrix, matrices[i]);
  }
  return sumMatrix;
}

function dotProduct(v1, v2) {
  if (v1.length !== v2.length) {
    throw new Error("Unequal lengths between both vectors");
  }
  let result = 0;
  for (let i = 0; i < v1.length; i++) {
    result += v1[i] * v2[i];
  }
  return result;
}

function matrixVectorMultiply(matrix, vector) {
  if (matrix.length === 0 || matrix[0].length !== vector.length) {
    throw new Error(
      "Matrix columns must match vector length for multiplication."
    );
  }
  const resultVector = [];
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const product = dotProduct(row, vector);
    resultVector.push(product);
  }
  return resultVector;
}

function transpose(matrix) {
  const transposed = matrix[0].map((col, i) => matrix.map((row) => row[i]));
  return transposed;
}
// This function returns the result of the multiplication between a matrix and a scalar unit/quantity
function matrixScalar(matrix, scalar) {
  if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
    throw new Error("Input must be a matrix");
  }
  const result = [];
  for (let i = 0; i < matrix.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrix[i].length; j++) {
      result[i][j] = matrix[i][j] * scalar;
    }
  }
  return result;
}

function getVectorMagnitude(vector) {
  const magnitude = Math.sqrt(
    vector.reduce((acc, curr) => acc + curr * curr, 0)
  );
  return magnitude;
}

function normalizeVector(vector) {
  const magnitude = getVectorMagnitude(vector);
  const normalized = vector.map((element) => element / magnitude);
  return normalized;
}

// This function creates a clone of the original matrix and prevents its original properties from being altered.
function createDeepCopyMatrix(originalMatrix) {
  return structuredClone(originalMatrix);
}
function createRandomVector(n) {
  return Array(n)
    .fill(0)
    .map(() => Math.random());
}
