const Ask = require('../models/Ask');

const subsMongoPromise = (points) => {
  debugger;
  return new Promise(async function (resolve, reject) {
    const subs = await Ask.find({
      $and: [
        {
          'localityFrom.localityName': {
            $in: points,
          },
        },
        {
          'destination.localityName': {
            $in: points,
          },
        },
      ],
    });

    resolve(subs);
  });
};
// const subsMongoPromise = async (points) => {
//   //debugger;
//   return new Promise(function (resolve, reject) {
//     const subs = ['Glasgow', 'Carlisle', 'Penrith', 'Kendal', 'Lancaster', 'Manchester'];

//     resolve(subs);
//   });
// };

module.exports.getSubsFromMongo = subsMongoPromise;
