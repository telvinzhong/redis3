const redis = require("redis");
const { promisify } = require("util");

function myDB() {
  const myDB = {};

  // We have only one connection per server
  const client = redis.createClient();

  client.on("error", function (error) {
    // TODO: HANDLE ERRORS
    console.error(error);
  });

  myDB.getUsers = async function (page) {
    const pzrange = promisify(client.zrange).bind(client);
    const phgetall = promisify(client.hgetall).bind(client);

    const ids = await pzrange("users", 0, -1);

    console.log("Got users ids", ids);

    // Iterate over the ids to get the details
    const promises = [];
    for (let id of ids) {
      promises.push(phgetall("user:" + id));
    }

    const users = await Promise.all(promises);
    console.log("users details", users);

    return users;
  };

  myDB.createUser = async function (user) {
    // Convert the callback-based client.incr into a promise
    const pincr = promisify(client.incr).bind(client);
    const phmset = promisify(client.hmset).bind(client);
    const pzadd = promisify(client.zadd).bind(client);

    user.id = await pincr("countuserId");
    await phmset("user:" + user.id, user);
    return pzadd("users", +new Date(), user.id);
  };

  myDB.updateUser = async function (user) {
    const phmset = promisify(client.hmset).bind(client);

    return phmset("user:" + user.id, user);
  };

  myDB.deleteUser = async function (user) {
    const pdel = promisify(client.del).bind(client);
    const pzrem = promisify(client.zrem).bind(client);


    await pdel("user:" + user.id);
    return await pzrem("users", user.id);
  };

  return myDB;
}

module.exports = myDB();
