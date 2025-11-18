import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

describe('API Health Check Tests', () => {
  
  test('GET / - should return API Working message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.text).toContain('API Working');
  });

  test('API should respond within reasonable time', async () => {
    const startTime = Date.now();
    await request(app).get('/');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Should respond within 3 seconds
    expect(responseTime).toBeLessThan(3000);
  });
});
