exports = async function () {
  // A Scheduled Trigger will always call a function without arguments.
  // Documentation on Triggers: https://www.mongodb.com/docs/atlas/app-services/triggers/overview/

  // Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

  // Get the MongoDB service you want to use (see "Linked Data Sources" tab)
  const serviceName = "dev";
  const databaseName = "order_system";
  const collectionName = "orders";
  const collection = context.services
    .get(serviceName)
    .db(databaseName)
    .collection(collectionName);

  const pipeline = [
    {
      $match: {
        picked: false,
      },
    },
    {
      $group: {
        _id: "$store_id",
        pick_incomplete_count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        pick_incomplete_count: -1,
      },
    },
    {
      $addFields: {
        store_id: "$_id",
        relatesTo: ["pickReport"],
        updateTime: new Date(),
      },
    },
    {
      $merge: {
        into: {
          db: "order_system",
          coll: "orders",
        },
      },
    },
  ];

  return collection
    .aggregate(pipeline)
    .next()
    .catch((err) => console.error("Failed to generate report:", err));
};
