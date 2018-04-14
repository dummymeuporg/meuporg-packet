const zeroBuffer = new Buffer('00', 'hex');

class DecodedPacket {
  constructor(params) {
    this._params = params;
    this.encodedBuffer = undefined;
    this._encode();
  }

  _encode() {
    this._params.forEach((param) => {
      const packetParts = [];
      const packetSize = 0;

      let buffer;
      if(typeof param === "string") {
        buffer = new buffer(param, 'utf8');
        buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
      } else if (typeof param === "number") {
        buffer = new Buffer(2); // 2 = sizeof uint16
        buffer.writeUInt16LE(param, 0);
      } else {
        console.log("Warning: Unknown data type in packet encoder.");
      }
      packetSize += buffer.length;
      packetParts.push(buffer);
    });

    const dataBuffer = Buffer.concat(packetParts, packetSize);
    const size = new Buffer(2);
    size.writeUInt16(dataBuffer.length + 1, 0);

    this.encodedBuffer = Buffer.concat([size, dataBuffer], size.length + dataBuffer.length);
  }
}

class EncodedPacket {
  constructor(buffer) {
    this._buffer = buffer;
    this._decodedParams = [];
    this._decode();
  }

  _decode() {
    const idx = 0;
    let packetSize;
    let extractedPacket;

    while(idx < this.buffer.length) {
      packetSize = data.readUInt16(idx);
      extractedPacket = new Buffer(packetSize);
      self._buffer.copy(extractedPacket, 0, idx, idx + packetSize);
      this._decodedParams.push(extractedPacket);
      idx += packetSize;
    }
  }
}

module.exports = {
  DecodedPacket: DecodedPacket,
  EncodedPacket: EncodedPacket
};