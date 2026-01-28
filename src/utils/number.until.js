
export function generateRandomNumber(digits = 4) {
  digits = Number.isFinite(Number(digits)) ? parseInt(digits, 10) : 4;
  if (digits < 1 || digits > 10) {
    throw new Error('digits must be between 2 and 6');
  }

  let result = '';
  for (let i = 0; i < digits; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// Return numeric value (may drop leading zeros). Use only if you need a number.
export function generateRandomNumberAsInt(digits = 4) {
  const str = generateRandomNumber(digits);
  return parseInt(str, 10);
}

export default generateRandomNumber;
