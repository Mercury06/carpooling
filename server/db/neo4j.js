const neo4j = require('neo4j-driver');

///////neo4j/////////
const uri = 'bolt://54.165.141.145:7687';
const user = 'neo4j';
const password = 'qwe123';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
//const session = driver.session({ database: 'neo4j' });
const session = driver.session();

// module.exports = async function (req, res) {
//   const cityName = 'Сергиев Посад';
//   const readQuery = `MATCH (City {name: $cityName})-[:LINKED*1..3]-(city:City) RETURN city`;
//   try {
//     await session.run(readQuery, { cityName });
//     await function (result) {
//       const cities = [];
//       // debugger;
//       result.records.forEach(function (record) {
//         cities.push({
//           title: record._fields[0].properties.name,
//         });
//         console.log(record._fields[0].properties);
//       });

//       return res.status(206).send(cities);
//     };
//   } catch (e) {
//     console.log(e);
//   } finally {
//     await session.close();
//   }
// };

// function getGraphData() {
//   const cityName = 'Сергиев Посад';
//   const readQuery = `MATCH (City {name: $cityName})-[:LINKED*1..3]-(city:City) RETURN city`;
//   //const cities = [];
//   session
//     .run(readQuery, { cityName })
//     .then(function (result) {
//       const cities = [];
//       // debugger;
//       result.records.forEach(function (record) {
//         cities.push({
//           title: record._fields[0].properties.name,
//         });
//         //console.log(record._fields[0].properties);
//       });
//       console.log('cities:', cities);
//       return cities;
//       //return '256';
//     })
//     .catch((err) => console.log(err));
// }
// getGraphData();

const fromPromise = () =>
  new Promise(function (resolve, reject) {
    const cityName = 'Сергиев Посад';
    const readQuery = `MATCH (City {name: $cityName})-[:LINKED*1..3]-(city:City) RETURN city`;
    const cities = [];
    session.run(readQuery, { cityName }).then(function (result) {
      //const cities = [];
      // debugger;
      result.records.forEach(function (record) {
        cities.push({
          title: record._fields[0].properties.name,
        });
        //console.log(record._fields[0].properties);
      });
      //console.log('cities:', cities);
      resolve(cities);
    });
  });
//fromPromise.then((thenData) => console.log('thenData:', thenData));
// console.log('fromPromise:', fromPromise);
// console.log(typeof fromPromise);
// async function getGraphData() {
//   const cityName = 'Milan';
//   const readQuery = `MATCH (City {name: $cityName})-[:LINKED*1..3]-(city:City) RETURN city`;
//   //const cities = [];
//   try {
//     const cities = [];
//     debugger;
//     const result = await session.run(readQuery, { cityName });
//     result.records.forEach(function (record) {
//       cities.push({
//         title: record._fields[0].properties.name,
//       });
//     });
//     console.log('cities:', cities);
//     return cities;
//   } catch (err) {
//     console.log(err);
//     return err;
//   }
// }

// getGraphData();
// module.exports.getGraphData = getGraphData;
module.exports.getGraphData = fromPromise;
