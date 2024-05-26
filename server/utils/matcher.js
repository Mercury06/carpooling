function findMatchingSubs(route, subscriptions) {
  console.log("$$$$$$route in findMatchingSubs:", route);
  console.log("$$$$$$$subscriptions in findMatchingSubs:", subscriptions);
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
  const preparedRides = [];
  // console.log("localityFrom inside:", localityFrom);
  // console.log("destination inside:", destination);
  const modifiedRides = searchedRides.forEach((ride) => {
    let points = ride.points;
    //console.log("points in rides:", points);
    let route = points.map((item) => item.localityName);
    //console.log("route in rides:", route);
    const subroutesSet = prepareSubroutesSet(route);
    //console.log("findMatchingRides:", subroutesSet);
    const result = function findMatched(route) {
      //console.log("inside result:", `${localityFrom}:${destination}`);
      if (subroutesSet.has(`${localityFrom}:${destination}`)) {
        preparedRides.push(ride);
      } else {
        console.log("notmatched!");
      }
    };
    result();
    //console.log("preparedRidesSet:", preparedRides);
  });
  return preparedRides;
}

module.exports = {
  getMatchedData: findMatchingSubs,
  findMatchingRides,
};
