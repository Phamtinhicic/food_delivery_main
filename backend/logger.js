/**
 * Advanced Logger for Test Failures and Application Errors
 * Integrates with Prometheus metrics and file logging
 */

import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure pino logger with multiple streams
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
}, pino.multistream([
  // Console output
  { stream: process.stdout },
  // All logs file
  { stream: pino.destination(path.join(logsDir, 'app.log')) },
  // Error logs file
  { 
    level: 'error',
    stream: pino.destination(path.join(logsDir, 'error.log'))
  },
  // Test failure logs file
  {
    level: 'error',
    stream: pino.destination(path.join(logsDir, 'test-failures.log'))
  }
]));

/**
 * Log test failure with detailed information
 */
export const logTestFailure = (testInfo) => {
  const failureLog = {
    type: 'TEST_FAILURE',
    timestamp: new Date().toISOString(),
    testSuite: testInfo.suite,
    testName: testInfo.name,
    error: testInfo.error,
    errorMessage: testInfo.errorMessage,
    stackTrace: testInfo.stackTrace,
    duration: testInfo.duration,
    attempts: testInfo.attempts || 1,
    environment: process.env.NODE_ENV,
    commitHash: process.env.GITHUB_SHA || 'local',
    branch: process.env.GITHUB_REF_NAME || 'local'
  };

  logger.error(failureLog, 'Test Failed');
  
  // Write to dedicated test failures log
  const failureLogPath = path.join(logsDir, 'test-failures.jsonl');
  fs.appendFileSync(failureLogPath, JSON.stringify(failureLog) + '\n');
  
  return failureLog;
};

/**
 * Log application error with context
 */
export const logError = (error, context = {}) => {
  logger.error({
    type: 'APPLICATION_ERROR',
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context,
    environment: process.env.NODE_ENV
  }, 'Application Error');
};

/**
 * Log API request error
 */
export const logApiError = (req, error) => {
  logger.error({
    type: 'API_ERROR',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers,
    error: error.message,
    stack: error.stack,
    statusCode: error.statusCode || 500
  }, 'API Request Error');
};

/**
 * Log successful test
 */
export const logTestSuccess = (testInfo) => {
  logger.info({
    type: 'TEST_SUCCESS',
    timestamp: new Date().toISOString(),
    testSuite: testInfo.suite,
    testName: testInfo.name,
    duration: testInfo.duration
  }, 'Test Passed');
};

/**
 * Get test failure statistics
 */
export const getTestFailureStats = () => {
  const failureLogPath = path.join(logsDir, 'test-failures.jsonl');
  
  if (!fs.existsSync(failureLogPath)) {
    return {
      totalFailures: 0,
      failuresByTest: {},
      recentFailures: []
    };
  }

  const lines = fs.readFileSync(failureLogPath, 'utf-8').split('\n').filter(line => line.trim());
  const failures = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  const failuresByTest = {};
  failures.forEach(failure => {
    const key = `${failure.testSuite}::${failure.testName}`;
    failuresByTest[key] = (failuresByTest[key] || 0) + 1;
  });

  return {
    totalFailures: failures.length,
    failuresByTest,
    recentFailures: failures.slice(-10).reverse()
  };
};

/**
 * Export logs for external analysis
 */
export const exportLogs = (hours = 24) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const failureLogPath = path.join(logsDir, 'test-failures.jsonl');
  
  if (!fs.existsSync(failureLogPath)) {
    return [];
  }

  const lines = fs.readFileSync(failureLogPath, 'utf-8').split('\n').filter(line => line.trim());
  
  return lines
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter(log => log && new Date(log.timestamp) > since);
};

export default logger;
