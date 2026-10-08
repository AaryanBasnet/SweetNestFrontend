/**
 * Empty the end-to-end test database so every run starts from the same shop.
 *
 * Refuses to touch anything whose name does not say it is for end-to-end tests,
 * so a wrong DB_URL can never wipe a real database.
 */

const path = require('node:path');

const backendDir = path.resolve(process.env.BACKEND_DIR || '../SweetNestBackend');
const mongoose = require(path.join(backendDir, 'node_modules', 'mongoose'));

const url = process.env.DB_URL;

if (!url || !/e2e/i.test(url)) {
  console.error('Refusing to reset a database that is not named for e2e tests.');
  process.exit(1);
}

mongoose
  .connect(url)
  .then(() => mongoose.connection.dropDatabase())
  .then(() => mongoose.disconnect())
  .then(() => {
    console.log('E2E database reset.');
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
