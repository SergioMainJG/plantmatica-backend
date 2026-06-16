const CRYPTOGRAPHICALLY_SECURE_ALGORITHMS = {
  argon2id: 'argon2id',
  argon2i: 'argon2i',
  argon2d: 'argon2d',
  bcrypt: 'bcrypt', 
  yescrypt: 'yescrypt',
  scrypt: 'scrypt',
  pbkdf2: 'PBKDF2-HMAC-SHA-512',
} as const;

export type Cryptographically_Algorithms = (typeof CRYPTOGRAPHICALLY_SECURE_ALGORITHMS)[keyof typeof CRYPTOGRAPHICALLY_SECURE_ALGORITHMS];

export interface HashingPassword {
  hash: (password: string) => Promise<string>;
  verify: (password: string, hash: string) => Promise<boolean>;
}