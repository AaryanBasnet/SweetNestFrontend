/**
 * A repeatable "random" number in [0, 1) for decoration.
 *
 * Render code has to give the same answer every time it runs for the same
 * input, otherwise a re-render re-shuffles the scene. Math.random() does not,
 * so decorative variation (drip lengths, scattered shavings) is derived from
 * the item's index instead. It still looks irregular, but stays put.
 */
export function pseudoRandom(index, salt = 0) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
