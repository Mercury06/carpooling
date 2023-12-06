class Notifier {
  constructor() {}

  newMatchRideNotification() {
    return {
      matchRideId: 1,
      title: "for your ask new matching ride registered",
      type: 1,
      meta: {},
    };
  }
}

module.exports = new Notifier();
