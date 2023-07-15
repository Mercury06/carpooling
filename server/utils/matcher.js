function findMatchingSubscriptions(route, subscriptions) {
  const subroutesSet = prepareSubroutesSet(route);
  //console.log('subroutesSet inside:', subroutesSet);
  //console.log('subscriptions inside:', subscriptions);
  return subscriptions.filter((s) =>
    subroutesSet.has(
      makeKey(s.localityFrom.localityName, s.destination.localityName)
    )
  );
}

function prepareSubroutesSet(route) {
  const subroutesSet = new Set();

  for (let fromIdx = 0; fromIdx < route.length; fromIdx++) {
    for (let dstIdx = fromIdx + 1; dstIdx < route.length; dstIdx++) {
      subroutesSet.add(makeKey(route[fromIdx], route[dstIdx]));
    }
  }
  //console.log("subroutesSet:", subroutesSet);
  return subroutesSet;
}

function makeKey(from, dst) {
  return `${from}:${dst}`;
}

function findMatchingRides(searchedRides, localityFrom, destination) {
  // const preparedRides = new Set();
  const modifiedRides = searchedRides.forEach((ride) => {
    let points = ride.points;
    //console.log("points in rides:", points);
    let route = points.map((item) => item.localityName);
    //console.log("route in rides:", route);
    const subroutesSet = prepareSubroutesSet(route);
    console.log("findMatchingRides:", subroutesSet);
  });
}

module.exports = {
  getMatchedData: findMatchingSubscriptions,
  findMatchingRides,
};
