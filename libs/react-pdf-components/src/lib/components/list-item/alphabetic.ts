/**
 * maps an integer to the alphabet based numbering
 *   0  => a
 *   1  => b
 *   26 => aa
 *   27 => ab
 */
export function arabToAlphabetic(n: number) {
  const charCodeA = 'a'.charCodeAt(0);
  const charCodeZ = 'z'.charCodeAt(0);
  const len = charCodeZ - charCodeA + 1;

  let s = '';
  while (n >= 0) {
    s = String.fromCharCode((n % len) + charCodeA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
}
