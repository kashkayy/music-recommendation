export function parseObj(object) {
  for (const key in object) {
    if (typeof object[key] === "string" && !isNaN(parseFloat(object[key]))) {
      object[key] = parseFloat(object[key]);
    }
  }
  return object;
}
