const neo4j = require('neo4j-driver');

const uri = 'bolt://54.165.141.145:7687';
const user = 'neo4j';
const password = 'qwe123';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

const fromPromise = (cityNameFrom, cityNameTo) =>
  new Promise(function (resolve, reject) {
    //const readQuery = `MATCH p= (n:City3{name: $cityNameFrom})-[:TOWARD*]->(m:City3{name: $cityNameTo}) return nodes(p)`;
    const readQuery = `MATCH p= (n:City3{mongoId: $cityNameFrom})-[:TOWARD*]->(m:City3{mongoId: $cityNameTo}) return nodes(p)`;
    const cities = [];
    session.run(readQuery, { cityNameFrom, cityNameTo }).then(function (result) {
      result.records[0]._fields[0].forEach(function (record) {
        cities.push({
          localityName: record.properties.name,
          mongoId: record.properties.mongoId,
        });
      });
      resolve(cities);
    });
  });
// getGraphData();
// module.exports.getGraphData = getGraphData;
module.exports.getGraphData = fromPromise;
