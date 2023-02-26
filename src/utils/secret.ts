import { enc, AES, mode, pad } from "crypto-ts"; //引用AES源码js
const key = enc.Utf8.parse("0123456701234567"); //十六位十六进制数作为密钥
const iv = enc.Utf8.parse("1234567812345678"); //十六位十六进制数作为密钥偏移量

export class Secret {
  public constructor() {}
  //解密方法
  public decrypt(word: string): string {
    let encryptedHexStr = enc.Hex.parse(word);
    let srcs = enc.Hex.stringify(encryptedHexStr);
    let decrypt = AES.decrypt(srcs, key, {
      iv: iv,
      mode: mode.CBC,
      padding: pad.PKCS7,
    });
    let decryptedStr = decrypt.toString(enc.Utf8);
    return decryptedStr.toString();
  }

  //加密方法
  public encrypt(word: string): string {
    let srcs = enc.Utf8.parse(word);
    let encrypted = AES.encrypt(srcs, key, {
      iv: iv,
      mode: mode.CBC,
      padding: pad.PKCS7,
    });
    if (encrypted.ciphertext == undefined) {
      return "";
    } else {
      return encrypted.ciphertext.toString().toUpperCase();
    }
  }
}
export default new Secret();
