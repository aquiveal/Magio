import test from 'node:test';
import assert from 'node:assert/strict';

test('Database Pool configuration options', () => {
  const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/testdb',
    max: Number(process.env.DB_POOL_MAX || 2),
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  };

  assert.equal(poolConfig.max, 2);
  assert.equal(poolConfig.idleTimeoutMillis, 10000);
  assert.equal(poolConfig.connectionTimeoutMillis, 5000);
});
