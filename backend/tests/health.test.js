import { describe, test, expect } from '@jest/globals';
import request from 'supertest';

// Test server URL
const TEST_URL = process.env.TEST_API_URL || 'http://localhost:4000';

describe('API Health Check Tests', () => {
  
  test('GET / - should return API Working message', async () => {
    const response = await request(TEST_URL).get('/');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('API Working');
  }, 10000);

  test('GET /health - should return health status', async () => {
    const response = await request(TEST_URL).get('/health');
    
    expect(response.status).toBe(200);
  }, 10000);

  test('GET /healthz - should return health status', async () => {
    const response = await request(TEST_URL).get('/healthz');
    
    expect(response.status).toBe(200);
  }, 10000);

  test('API should respond within reasonable time', async () => {
    const startTime = Date.now();
    await request(TEST_URL).get('/');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Should respond within 5 seconds
    expect(responseTime).toBeLessThan(5000);
  }, 10000);
});
