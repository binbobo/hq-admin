import { Injectable } from '@angular/core';
import { EventDispatcher } from "./event-dispatcher.service";

@Injectable()
export class RequestIdService {

  // public urlNameSpace = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
  public myNameSpace = '0f5abcd1-c194-47f3-905b-2df7263a084b';

  constructor(private dispatcher: EventDispatcher) { }

  public refesh(name, namespaces, buf, offset): any {
    // let requestId = this.generateId(name, namespaces, buf, offset);
    let requestId = this.generateId(name, namespaces, buf, offset);
    this.dispatcher.emit('RequestIdChanged', requestId);
  }
  private generateId(name, namespaces, buf, offset): string {
    if (typeof (name) == 'string') name = this.stringToBytes(name);
    if (typeof (namespaces) == 'string') namespaces = this.uuidToBytes(namespaces);

    if (!Array.isArray(name)) throw TypeError('name must be an array of bytes');
    if (!Array.isArray(namespaces) || namespaces.length != 16) throw TypeError('namespaces must be an array of bytes');

    // Per 4.3
    let bytes = this.sha1(namespaces.concat(name));
    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    let bytesToUuid = this.bytesToUuid(bytes,offset);
    return buf || bytesToUuid;
  }

  private stringToBytes(str) {
    let strs = encodeURIComponent(str); // UTF8 escape
    let bytes = new Array(strs.length);
    for (let i = 0; i < strs.length; i++) {
      bytes[i] = strs.charCodeAt(i);
    }
    return bytes;
  }
  private uuidToBytes(uuid) {
    // Note: We assume we're being passed a valid uuid string
    let bytes = [];
    uuid.replace(/[a-fA-F0-9]{2}/g, function (hex) {
      bytes.push(parseInt(hex, 16));
    });
    return bytes;
  }

  private sha1(bytes) {
    let K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    let H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

    if (typeof (bytes) == 'string') {
      let msg = encodeURIComponent(bytes); // UTF8 escape
      bytes = new Array(msg.length);
      for (let i = 0; i < msg.length; i++) bytes[i] = msg.charCodeAt(i);
    }

    bytes.push(0x80);

    let l = bytes.length / 4 + 2;
    let N = Math.ceil(l / 16);
    let M = new Array(N);

    for (let i = 0; i < N; i++) {
      M[i] = new Array(16);
      for (let j = 0; j < 16; j++) {
        M[i][j] =
          bytes[i * 64 + j * 4] << 24 |
          bytes[i * 64 + j * 4 + 1] << 16 |
          bytes[i * 64 + j * 4 + 2] << 8 |
          bytes[i * 64 + j * 4 + 3];
      }
    }

    M[N - 1][14] = ((bytes.length - 1) * 8) /
      Math.pow(2, 32); M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((bytes.length - 1) * 8) & 0xffffffff;

    for (let i = 0; i < N; i++) {
      let W = new Array(80);

      for (let t = 0; t < 16; t++) W[t] = M[i][t];
      for (let t = 16; t < 80; t++) {
        W[t] = this.ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
      }

      let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4];

      for (let t = 0; t < 80; t++) {
        let s = Math.floor(t / 20);
        let T = this.ROTL(a, 5) + this.f(s, b, c, d) + e + K[s] + W[t] >>> 0;
        e = d;
        d = c;
        c = this.ROTL(b, 30) >>> 0;
        b = a;
        a = T;
      }

      H[0] = (H[0] + a) >>> 0;
      H[1] = (H[1] + b) >>> 0;
      H[2] = (H[2] + c) >>> 0;
      H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0;
    }

    return [
      H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff,
      H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff,
      H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff,
      H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff,
      H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff
    ];
  }

  private f(s, x, y, z) {
    switch (s) {
      case 0: return (x & y) ^ (~x & z);
      case 1: return x ^ y ^ z;
      case 2: return (x & y) ^ (x & z) ^ (y & z);
      case 3: return x ^ y ^ z;
    }
  }

  private ROTL(x, n) {
    return (x << n) | (x >>> (32 - n));
  }

  private bytesToUuid(buf, offset) {
    let byteToHex = [];
    for (let i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }
    let i = offset || 0;
    let bth = byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] +
      bth[buf[i++]] + bth[buf[i++]] + '-' +
      bth[buf[i++]] + bth[buf[i++]] + '-' +
      bth[buf[i++]] + bth[buf[i++]] + '-' +
      bth[buf[i++]] + bth[buf[i++]] + '-' +
      bth[buf[i++]] + bth[buf[i++]] +
      bth[buf[i++]] + bth[buf[i++]] +
      bth[buf[i++]] + bth[buf[i++]];
  }

}
