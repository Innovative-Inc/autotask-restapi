/** @type {import('jest').Config} */
const config = {
  // Since these are integration tests with a relatively slow API, increase the timeout to 20s.
  testTimeout: 20_000,
  clearMocks: true,
  // Increase timeout from the default of 1s to 5s to allow time for fetch's TCPWRAP and TLSWRAP handles to close.
  openHandlesTimeout: 5_000
};

module.exports = config;
