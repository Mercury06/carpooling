const neo4j = require('neo4j-driver');

const uri = 'bolt://3.82.112.16:7687';
const user = 'neo4j';
const password = 'qwe123';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

const fromPromise = (argFrom, argTo) =>
  new Promise(function (resolve, reject) {
    //const readQuery = `MATCH p= (n:City3{mongoId: $cityNameFrom})-[r*]->(m:City3{mongoId: $cityNameTo}) return nodes(p), r`;
    //const readQuery = `MATCH p= (n:City5{mongoId: $cityNameFrom})-[r*]->(m:City5{mongoId: $cityNameTo}) return nodes(p), r`;
    const readQuery = `MATCH (n:City5{mongoId: $argFrom}), (m:City5{mongoId: $argTo})
                    MATCH p=shortestPath((n)-[*]->(m))
                    RETURN nodes(p) as nodes, relationships(p) as rels`;
    const cities = [];
    let direction;
    session.run(readQuery, { argFrom, argTo }).then(function (result) {
      //console.log('resulty:', result.records[0]._fields[1].type[0]);
      result.records[0]._fields[0].forEach(function (record) {
        cities.push({
          localityName: record.properties.name,
          mongoId: record.properties.mongoId,
        });
      });
      direction = result.records[0]._fields[1][0].type;
      resolve({ cities, direction });
    });
  });

module.exports.getGraphData = fromPromise;
