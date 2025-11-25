/**
 * Logs API Routes - View test failures and application logs
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getTestFailureStats, exportLogs } from '../logger.js';
import authMiddleware from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsRouter = express.Router();
const logsDir = path.join(__dirname, '../logs');

// Middleware to check if user is admin (you should implement this properly)
const adminMiddleware = async (req, res, next) => {
  // For now, just check if user is authenticated
  // In production, check if user has admin role
  try {
    // Assume authMiddleware already set req.body.userId
    // You should check if this user is admin in your database
    next();
  } catch (error) {
    res.json({ success: false, message: "Admin access required" });
  }
};

/**
 * GET /api/logs/test-failures
 * Get test failure statistics
 */
logsRouter.get('/test-failures', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const stats = getTestFailureStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/logs/export
 * Export logs from last N hours
 */
logsRouter.get('/export', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const logs = exportLogs(hours);
    
    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/logs/recent
 * Get recent log entries
 */
logsRouter.get('/recent', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const logFile = path.join(logsDir, 'app.log');
    const limit = parseInt(req.query.limit) || 100;
    
    if (!fs.existsSync(logFile)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const content = fs.readFileSync(logFile, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const recentLines = lines.slice(-limit);
    
    const logs = recentLines.map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return { raw: line };
      }
    });

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/logs/errors
 * Get error logs only
 */
logsRouter.get('/errors', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const errorLogFile = path.join(logsDir, 'error.log');
    const limit = parseInt(req.query.limit) || 50;
    
    if (!fs.existsSync(errorLogFile)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const content = fs.readFileSync(errorLogFile, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const recentLines = lines.slice(-limit);
    
    const errors = recentLines.map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return { raw: line };
      }
    });

    res.json({
      success: true,
      count: errors.length,
      data: errors
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DELETE /api/logs/clear
 * Clear old logs (keep last 7 days)
 */
logsRouter.delete('/clear', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // This is a simple implementation
    // In production, you might want to archive old logs instead of deleting
    
    res.json({
      success: true,
      message: `Logs older than ${days} days would be cleared`,
      note: 'Archive functionality not implemented yet'
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

export default logsRouter;
