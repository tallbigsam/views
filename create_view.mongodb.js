/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use("order_system");
db.failed_picks.drop();

// get me the current date
now = new Date();
tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;

// view needs to contain orders which were placed within the last 24 hours and have not been picked
order_dispatch_target = 1 * 60 * 60 * 1000;
pipeline = [
  {
    $addFields: {
      expected_pick_time: {
        $dateAdd: {
          startDate: "$order_time",
          unit: "hour",
          amount: 12,
        },
      },
    },
  },
  {
    $match: {
      expected_pick_time: {
        $lt: new Date(),
      },
      picked: false,
    },
  },
];

db.createCollection("failed_picks", { viewOn: "orders", pipeline: pipeline });

store_id = 1;
const failed_picks = db
  .getCollection("failed_picks")
  .find({ store_id: store_id })
  .count();
console.log(`${failed_picks} failed picks`);

const failed_picks_peek = db
  .getCollection("failed_picks")
  .find({}, { _id: 1, line_items: 0 })
  .limit(10);

failed_picks_peek.forEach((doc) => {
  console.log(doc);
});

// we now have a view, we want to see which orders are failing to be ready for dispatch
// assume we aim to dispatch 24 hours after the order is placed
// we need to query the view to show us which have not met that target
