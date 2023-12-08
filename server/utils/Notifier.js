const EventName = Object.freeze({
  ASK: "ask",
  MESSAGE: "message",
  CONFIRM: "confirm",
  GREETING: "greeting",
  CANCELLED: "cancelled",
  OPPORTUNE: "opportune",
});

class Notifier {
  constructor() {}

  newMatchRideNotification(matched, applicant) {
    let recieverIdArray;
    console.log("matched:", matched);
    if (matched.length > 0) {
      recieverIdArray = matched.map((el) =>
        JSON.stringify(el.user).slice(1, -1)
      );
    }
    return {
      recieverIdArray,
      event: EventName.OPPORTUNE,
      data: {
        newRide: applicant,
        title: "for your ask new matching ride registered",
      },
    };
  }
}

module.exports = new Notifier();
