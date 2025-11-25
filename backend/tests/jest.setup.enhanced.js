/**
 * Enhanced Jest Setup with Test Failure Logging
 */

import { logTestFailure, logTestSuccess } from '../logger.js';

// Global test failure handler
let currentTestInfo = {
  suite: '',
  name: '',
  startTime: 0
};

// Before each test
beforeEach(function() {
  const testName = expect.getState().currentTestName;
  const suiteName = expect.getState().testPath;
  
  currentTestInfo = {
    suite: suiteName ? suiteName.split('/').pop() : 'unknown',
    name: testName || 'unknown',
    startTime: Date.now()
  };
});

// After each test
afterEach(function() {
  const testName = expect.getState().currentTestName;
  const duration = Date.now() - currentTestInfo.startTime;
  
  // Check if test passed or failed
  const testState = this.currentTest || {};
  
  if (testState.errors && testState.errors.length > 0) {
    // Test failed - log detailed failure info
    const error = testState.errors[0];
    logTestFailure({
      suite: currentTestInfo.suite,
      name: testName || currentTestInfo.name,
      error: error.message || error.toString(),
      errorMessage: error.message,
      stackTrace: error.stack,
      duration: duration,
      attempts: testState.invocations || 1
    });
  } else if (testState.state === 'passed') {
    // Test passed - log success
    logTestSuccess({
      suite: currentTestInfo.suite,
      name: testName || currentTestInfo.name,
      duration: duration
    });
  }
});

// Global error handler for uncaught exceptions in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection in test:', reason);
  logTestFailure({
    suite: currentTestInfo.suite,
    name: currentTestInfo.name,
    error: 'UnhandledRejection',
    errorMessage: reason.message || reason.toString(),
    stackTrace: reason.stack,
    duration: Date.now() - currentTestInfo.startTime
  });
});
