const Parser = require('binary-parser').Parser;
const zeroBuffer = new Buffer('00', 'hex');

class DecodedPacket {
  constructor(params) {
    this._params = params;
    this.encodedBuffer = undefined;
    this._encode();
  }

  _encode() {
    const packetParts = [];
    let packetSize = 0;
    this._params.forEach((param) => {
      let buffer;
      buffer = new Buffer(param, 'utf8');
      buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
      packetSize += buffer.length;
      packetParts.push(buffer);
    });

    const dataBuffer = Buffer.concat(packetParts, packetSize);
    const size = new Buffer(2);
    size.writeUInt16LE(dataBuffer.length, 0);

    this.encodedBuffer = Buffer.concat([size, dataBuffer], size.length + dataBuffer.length);
  }
}

class EncodedPacket {
  constructor(buffer) {
    this._buffer = buffer;
    this.decodedParams = [];
    this._decode();
  }

  _decode() {

    // Parsers
    const packetStartParser = new Parser()
      .uint16le('size')
      .string('command', {zeroTerminated: true});
    const zstringParser = new Parser().string('str', {zeroTerminated: true});

    let params = packetStartParser.parse(this._buffer);
    let index = 2 + params.command.length + 1; // +2 for the size, +1 for the \0
    const packetSize = params.size;

    this.decodedParams.push(params.command);
    while(index < this._buffer.length) {
      params = zstringParser.parse(this._buffer.slice(index), {zeroTerminated: true});
      this.decodedParams.push(params.str);
      index += params.str.length + 1;
    }
  }
}

module.exports = {
  DecodedPacket: DecodedPacket,
  EncodedPacket: EncodedPacket
};