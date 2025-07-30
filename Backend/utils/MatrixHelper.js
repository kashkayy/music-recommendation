function createMatrix(rows, cols) {
  if (rows <= 0 || cols <= 0) {
    throw new Error("Invalid matrix dimension");
  }
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let i = 0; i < cols; i++) {
      row.push(0);
    }
    matrix.push(row);
  }
  return matrix;
}
function createIdentityMatrix(rows, cols) {
  if (rows <= 0 || cols <= 0) {
    throw new Error("Matrix dimension must be positive integers.");
  }
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(i === j ? 1 : 0);
    }
    matrix.push(row);
  }
  return matrix;
}
function vectorAndConstantProduct(constant, vector) {
  if (vector.length <= 0) {
    throw new Error("Vector cannot be empty");
  }
  const results = vector.map((element) => element * constant);
  return results;
}
function subtractVectors(v1, v2) {
  if (v1.length !== v2.length) {
    throw new Error("Vectors must be the same length!");
  }
  let newVector = [];
  for (let i = 0; i < v1.length; i++) {
    const result = v1[i] - v2[i];
    newVector.push(result);
  }
  return newVector;
}
function multiplyMatrices(matrixA, matrixB) {
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;
  if (colsA !== rowsB) {
    throw new Error(
      "Number of columns in the first matrix must equal the number of rows in the second matrix."
    );
  }
  const resultMatrix = Array(rowsA)
    .fill(0)
    .map(() => Array(colsB).fill(0));
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += matrixA[i][k] * matrixB[k][j];
      }
      resultMatrix[i][j] = sum;
    }
  }
  return resultMatrix;
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
/* LOOK FOR THE MOST IMPORTANT PATTERN.
THIS FUNCTION SHOULD RETURN THE IMPORTANCE OF THE FOUND PATTERN, AS WELL AS HOW EACH USER CORRESPONDS WITH THE PATTERN FOUND FROM SONGS*/
function powerIteration(matrix, maxIterations = 100, tolerance = 0.999) {
  //start with random vector to prevent bias in finiding this pattern's direction(taking a random guess)
  const startingVector = createRandomVector(matrix[0].length);
  //normalize(convert to unit vec)this guess to ensure we're only focusing on the direction and not how much it is actually stretched by matrix
  let normalized = normalizeVector(startingVector);
  const transposed = transpose(matrix);
  let converged = false;
  for (let i = 0; i < maxIterations; i++) {
    // Multiplies our guess with the data matrix and the matrix transforms our guess
    const multiplied = matrixVectorMultiply(matrix, normalized);
    // This points towrds the dominant eigenvector
    const transProduct = matrixVectorMultiply(transposed, multiplied);
    // Updated guess(due to feedback from iteration) is normalized to focus on direction
    const normalized2 = normalizeVector(transProduct);
    //This checks the closeness in direction between both guesses
    const similarity = Math.abs(dotProduct(normalized, normalized2));
    if (similarity >= tolerance) {
      converged = true;
      break;
    }
    //update our guess if direction not similar enough
    normalized = normalized2;
  }
  const multiplied = matrixVectorMultiply(matrix, normalized);
  // importance of pattern found
  const sigma = getVectorMagnitude(multiplied);
  //represents how much the users correspond with this pattern
  const u = normalizeVector(multiplied);
  return { v: normalized, sigma: sigma, u: u };
}

function outerProduct(vector1, vector2) {
  if (!Array.isArray(vector1) || !Array.isArray(vector2)) {
    throw new Error("Inputs must be arrays.");
  }
  const rows = vector1.length;
  const cols = vector2.length;
  const resultMatrix = [];
  for (let i = 0; i < rows; i++) {
    resultMatrix[i] = new Array(cols).fill(0);
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      resultMatrix[i][j] = vector1[i] * vector2[j];
    }
  }
  return resultMatrix;
}

function matrixSubtract(m1, m2) {
  if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
    throw new Error("Matrices must be same dimension");
  }
  const result = Array(m1.length)
    .fill(0)
    .map(() => Array(m1[0].length).fill(0));
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m1[0].length; j++) {
      result[i][j] = m1[i][j] - m2[i][j];
    }
  }
  return result;
}
// DEFLATE THE MATRIX TO GET THE NEXT MOST IMPORTANT PATTERN
/* We accomplis this by building a new matrix from the left and right singular vectors and scaling this new matrix by the importance of the leading latent feature found in power iteration.
We then subtract this new matrix from our original data matrix so we can find the next leading pattern/feature */
function deflateMatrix(matrix, sigma, u, v) {
  const outerProductMatrix = outerProduct(u, v);
  const outerProductMatrixScaled = matrixScalar(outerProductMatrix, sigma);
  const newMatrix = matrixSubtract(matrix, outerProductMatrixScaled);
  return newMatrix;
}

function gramSchmidt(vectors) {
  let orthonormalVectors = [];
  for (let i = 0; i < vectors.length; i++) {
    let v = vectors[i];
    let u = Array.from(v); // Create a copy of the current vector
    // Subtract the projections onto previously orthonormalized vectors
    for (let j = 0; j < orthonormalVectors.length; j++) {
      let u_j = orthonormalVectors[j];
      let projection = vectorAndConstantProduct(dotProduct(v, u_j), u_j);
      u = subtractVectors(u, projection);
    }
    // Normalize the resulting vector
    let mag_u = getVectorMagnitude(u);
    if (mag_u > 0) {
      // Avoid division by zero
      u = vectorAndConstantProduct(1 / mag_u, u);
    }
    orthonormalVectors.push(u);
  }
  return orthonormalVectors;
}
function qrDecomposition(matrix) {
  const Q = gramSchmidt(matrix);
  const rows = matrix.length;
  const cols = matrix[0].length;
  let R = createMatrix(rows, cols);
  const Q_T = transpose(Q); // transpose to find R;
  R = multiplyMatrices(Q_T, matrix);
  for (let i = 1; i <= cols; i++) {
    for (let j = 0; j < i; j++) {
      R[i][j] = 0;
    }
  }
  return { Q, R };
}

function lpDecomposition(matrix) {
  const transposedMatrix = transpose(matrix);
  const { Q, R } = gramSchmidt(transposedMatrix); //  Apply QR to the transposed matrix
  return { L: transpose(R), P: transpose(Q) }; //  Transpose the result to get LQ
}

function qrBasedSvd(matrix, maxIterations = 2) {
  let M = createDeepCopyMatrix(matrix); //  Copy matrix while working
  const rows = matrix.length;
  const cols = matrix[0].length;
  let U = createIdentityMatrix(rows, rows); // Accumulates left singular vectors
  let V = createIdentityMatrix(cols, cols); // Accumulates right singular vectors
  for (let i = 0; i < maxIterations; i++) {
    const { Q, R } = qrDecomposition(M);
    const { L, P } = lpDecomposition(R);
    M = L;

    // Accumulate singular vectors
    U = multiplyMatrices(U, Q);
    V = multiplyMatrices(V, P);

    // Check if matrix is diagonal
    let sumOfOffDiagonal = 0;
    for (let i = 0; i <= rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (i !== j) {
          sumOfOffDiagonal += M[i][j];
        }
      }
    }
    if (sumOfOffDiagonal < 1e-2) {
      // check if close to 0
      break;
    }
  }
  const S = M;
  return { singularValues: S, leftVectors: U, rightVectors: V };
}

//This is the main SVD FUNCTION that returns top K patterns in a matrix using power iteration and deflation of matrix.
//This function returns: the strength/ importance of each pattern, the pattern itself(rightVectors) and how users correspond with these patterns
export default function singularValueDecomposition(matrix, k = 10) {
  let matrixCopy = createDeepCopyMatrix(matrix);
  const SVD_METHODS = {
    POWER: "power",
    GRAM: "gram_schmidt",
  };
  let method = SVD_METHODS.POWER;
  if (method == SVD_METHODS.POWER) {
    const singularValues = [];
    const rightVectors = [];
    const leftVectors = [];
    for (let i = 0; i < k; i++) {
      const result = powerIteration(matrixCopy);
      const { v, sigma, u } = result;
      singularValues.push(sigma);
      leftVectors.push(u);
      rightVectors.push(v);
      matrixCopy = deflateMatrix(matrixCopy, sigma, u, v);
    }
    return { singularValues, leftVectors, rightVectors };
  } else {
    return qrBasedSvd(matrix);
  }
}
