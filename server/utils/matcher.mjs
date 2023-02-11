export function findMatchingSubscriptions(route, subscriptions) {
  const subroutesSet = prepareSubroutesSet(route);

  return subscriptions.filter((s) => subroutesSet.has(makeKey(s.from, s.dst)));
}

function prepareSubroutesSet(route) {
  const subroutesSet = new Set();

  for (let fromIdx = 0; fromIdx < route.length; fromIdx++) {
    for (let dstIdx = fromIdx + 1; dstIdx < route.length; dstIdx++) {
      subroutesSet.add(makeKey(route[fromIdx], route[dstIdx]));
    }
  }

  return subroutesSet;
}

function makeKey(from, dst) {
  return `${from}:${dst}`;
}
