/**
 * this function implementation is borrowed from this StackOverflow answer
 * credits: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/2450976#2450976
 * btw the answer mentioned that the name of this algorithm is "Fisher–Yates (aka Knuth) Shuffle"
 * for more info check it here https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 *
 * I just did slight adjustments:
 *   - added typescript types
 *   - also cloned the array (so the input array is not mutated)
 */
export function shuffle<T>(array: T[]): T[] {
  const items = [...array] // copy array so the input array is not mutated

  let currentIndex = items.length

  // while there are remain elements to shuffle...
  while (currentIndex != 0) {
    // pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)

    currentIndex--

    // and swap it with the current element
    ;[items[currentIndex], items[randomIndex]] = [items[randomIndex], items[currentIndex]]
    // btw in .prettierrc (I omitted semicolons because I like the code without them)
    // but above it is mandatory to add it (see ";" at the beginning of the line)
  }

  return items
}
