function findMatchingSubscriptions(route, subscriptions) {
  const subroutesSet = prepareSubroutesSet(route);
  console.log('subroutesSet inside:', subroutesSet);
  console.log('subscriptions inside:', subscriptions);
  return subscriptions.filter((s) =>
    subroutesSet.has(makeKey(s.localityFrom.localityName, s.destination.localityName)),
  );
}

function prepareSubroutesSet(route) {
  const subroutesSet = new Set();

  for (let fromIdx = 0; fromIdx < route.length; fromIdx++) {
    for (let dstIdx = fromIdx + 1; dstIdx < route.length; dstIdx++) {
      subroutesSet.add(makeKey(route[fromIdx], route[dstIdx]));
    }
  }
  //console.log('subroutesSet:', subroutesSet);
  return subroutesSet;
}

function makeKey(from, dst) {
  return `${from}:${dst}`;
}

module.exports = {
  getMatchedData: findMatchingSubscriptions,
};
