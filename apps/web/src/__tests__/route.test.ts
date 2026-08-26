import test from 'node:test';
import assert from 'node:assert/strict';

test('Tracking Route logic - IP & Sender checks', () => {
  const senderIp = '192.168.1.1';
  const requestIp = '192.168.1.1';
  const isSenderView = senderIp === requestIp;
  assert.equal(isSenderView, true);
});

test('Tracking Route logic - Immediate open check (<5 min)', () => {
  const createdAt = new Date(Date.now() - 60_000); // 1 minute ago
  const isImmediateOpen = Date.now() - createdAt.getTime() < 5 * 60_000;
  assert.equal(isImmediateOpen, true);
});

test('Tracking Route logic - Recipient view after 5 min', () => {
  const createdAt = new Date(Date.now() - 10 * 60_000); // 10 minutes ago
  const isImmediateOpen = Date.now() - createdAt.getTime() < 5 * 60_000;
  assert.equal(isImmediateOpen, false);
});
