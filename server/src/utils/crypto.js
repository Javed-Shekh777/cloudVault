const crypto = require('crypto');

const PBKDF2_ITER = 200000; // tune for production (or use Argon2)
const KEY_LEN = 32; // 256-bit
const ALGO = 'aes-256-gcm';

function randomBytesBase64(len = 16) {
  return crypto.randomBytes(len).toString('base64');
}

// Derive key from passphrase + salt (returns Buffer)
function deriveKey(passphrase, saltB64) {
  const salt = Buffer.from(saltB64, 'base64');
  return crypto.pbkdf2Sync(Buffer.from(passphrase, 'utf8'), salt, PBKDF2_ITER, KEY_LEN, 'sha256');
}

// Wrap (encrypt) folderKey using derivedKey (AES-GCM) -> returns { wrappedB64, ivB64, saltB64 }
function wrapFolderKey(folderKeyBuf, passphrase) {
  const saltB64 = randomBytesBase64(16);
  const derived = deriveKey(passphrase, saltB64);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, derived, iv, { authTagLength: 16 });
  const ct = Buffer.concat([cipher.update(folderKeyBuf), cipher.final()]);
  const tag = cipher.getAuthTag();
  const wrapped = Buffer.concat([ct, tag]); // store tag appended
  return { wrappedB64: wrapped.toString('base64'), ivB64: iv.toString('base64'), saltB64 };
}

// Unwrap (decrypt) wrapped folderKey using passphrase -> returns Buffer (raw folder key)
function unwrapFolderKey(wrappedB64, ivB64, passphrase, saltB64) {
  const derived = deriveKey(passphrase, saltB64);
  const iv = Buffer.from(ivB64, 'base64');
  const wrapped = Buffer.from(wrappedB64, 'base64');
  const tag = wrapped.slice(wrapped.length - 16);
  const ct = wrapped.slice(0, wrapped.length - 16);
  const decipher = crypto.createDecipheriv(ALGO, derived, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ct), decipher.final()]);
  return plain; // Buffer -> this is raw folderKey
}

// Generate a new random folder key (Buffer)
function generateFolderKey() {
  return crypto.randomBytes(KEY_LEN);
}

// Encrypt a file buffer with folderKey (returns { cipherBuffer, iv, authTag })
function encryptWithFolderKey(plainBuffer, folderKeyBuf) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, folderKeyBuf, iv, { authTagLength: 16 });
  const ct = Buffer.concat([cipher.update(plainBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  // We will store cipher + tag separately or append tag as end.
  return { cipherBuffer: ct, iv: iv.toString('base64'), authTag: tag.toString('base64') };
}

// Decrypt file cipher buffer with folderKey and iv+authTag
function decryptWithFolderKey(cipherBuffer, folderKeyBuf, ivB64, authTagB64) {
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(authTagB64, 'base64');
  const decipher = crypto.createDecipheriv(ALGO, folderKeyBuf, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(cipherBuffer), decipher.final()]);
  return plain;
}

module.exports = {
  generateFolderKey,
  wrapFolderKey,
  unwrapFolderKey,
  encryptWithFolderKey,
  decryptWithFolderKey,
};
