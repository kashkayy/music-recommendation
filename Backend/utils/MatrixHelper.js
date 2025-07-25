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

function createVector(n) {
  let newVector = [];
  for (let i = 0; i < n; i++) {
    newVector.push(0);
  }
  return newVector;
}

function dotProduct(v1, v2) {
  if (v1.length !== v2.length) {
    return null;
  }
  let result = 0;
  for (let i = 0; i < v1.length; i++) {
    result += v1[i] * v2[i];
  }
  return result;
}
