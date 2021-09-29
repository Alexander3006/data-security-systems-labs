import crypto from 'crypto';

export class Chipher {
  constructor({secret, algorithm, iv_length}) {
    this.secret = secret ?? '12345678912345678912345678912345';
    this.algorithm = algorithm ?? 'aes-256-ctr';
    this.iv_length = iv_length ?? 16;
  }

  async encrypt(data) {
    try {
      const {secret, algorithm, iv_length} = this;
      let iv = crypto.randomBytes(iv_length);
      const cipher = crypto.createCipheriv(algorithm, secret, iv);
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      const result = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
      return result;
    } catch (err) {
      console.dir({
        message: 'Encrypt error',
        error: err,
      });
      throw err;
    }
  }

  async decrypt(content) {
    try {
      const {secret, algorithm} = this;
      const [iv, data] = content.split(':');
      const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(iv, 'hex'));
      const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(data, 'hex')),
        decipher.final(),
      ]);
      return decrpyted.toString();
    } catch (err) {
      console.dir({
        message: 'Decrypt error',
        error: err,
      });
      throw err;
    }
  }
}
