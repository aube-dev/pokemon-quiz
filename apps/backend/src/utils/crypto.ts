/**
 * @fileoverview
 * 이 파일 내 함수들은, 간단한 암복호화를 위해 개발되었습니다. 용도 자체가 보안이 아니므로, 보안이 중요한 곳에 사용하지 마세요.
 * 해당 함수들은 정말 평문이 보이는 것을 방지하는 용입니다.
 */

import { createCipheriv, randomBytes, createDecipheriv } from 'crypto'

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM 권장 IV 길이

/**
 * encrypt
 * @param {string} text - 암호화할 평문
 * @param {string} secretKey - 32바이트 길이의 비밀키
 */
function encrypt(text: string, secretKey: string) {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, Buffer.from(secretKey), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    // iv, authTag, encrypted 데이터를 조합하여 반환 (나중에 복호화 시 필요)
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * decrypt
 * @param {string} cipherText - 'iv:authTag:encryptedData' 형식의 문자열
 * @param {string} secretKey - 암호화 시 사용한 비밀키
 */
function decrypt(cipherText: string, secretKey: string) {
    const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, Buffer.from(secretKey), iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

export { encrypt, decrypt };