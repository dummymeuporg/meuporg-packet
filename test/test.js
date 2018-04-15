const assert = require('assert');
const Parser = require('binary-parser').Parser;
const packet = require('meuporg-packet');

describe('DecodedPacket', () => {
  it('should encode properly.', () => {
    let myPacket = new packet.DecodedPacket(["HELLO", "Login", "Password"]);
    const buf = new Buffer('150048454c4c4f004c6f67696e0050617373776f726400', 'hex');
    assert.ok(myPacket.encodedBuffer.equals(
      new Buffer('150048454c4c4f004c6f67696e0050617373776f726400', 'hex')));
  });
});

describe('EncodedPacket', () => {
  it('should decode properly.', () => {
    let myPacket = new packet.EncodedPacket(
      new Buffer("\x15\x00" +
      "\x48\x45\x4c\x4c\x4f\x00\x4c\x6f\x67\x69\x6e" +
      "\x00\x50\x61\x73\x73\x77\x6f\x72\x64\x00"));
    assert.deepEqual(myPacket.decodedParams, ["HELLO", "Login", "Password"]);
  });

  it('should handle malformed packets.', () => {
    assert.throws(() => {new packet.EncodedPacket(new Buffer('1500313233', 'hex'))},
                  RangeError,
                  "Error thrown");
  })
});