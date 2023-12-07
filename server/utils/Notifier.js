const EventName = Object.freeze({
  ASK: "ASK",
  MESSAGE: "MESSAGE",
  CONFIRM: "CONFIRM",
  GREETING: "GREETING",
  CANCELLED: "CANCELLED",
  OPPORTUNE: "OPPORTUNE",
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
      recieverIdArray.forEach((el) => console.log("***el****", el));
      //   console.log("recieverIdArray", recieverIdArray);
    }

    return {
      recieverIdArray,
      event: EventName.OPPORTUNE,
      data: applicant,
      title: "for your ask new matching ride registered",
      // type: 1,
      // meta: {},
    };
  }
}

module.exports = new Notifier();
