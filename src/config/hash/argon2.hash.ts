import { Cryptographically_Algorithms, HashingPassword } from "./contract.hash";

const algorithm: Cryptographically_Algorithms ='argon2id';
const memoryCost = 64;
const timeCost = 3;

class Argon2Adapter implements HashingPassword {

  private static instance: Argon2Adapter | null = null;

  private constructor(){}

  static get getInstance(): Argon2Adapter{
    if( this.instance ) return this.instance;
    this.instance = new Argon2Adapter();
    return this.instance;
  }

  hash = ( password: string ): Promise<string> =>{
    return Bun.password.hash( password, {
      algorithm: algorithm as 'argon2id',
      memoryCost,
      timeCost,
    })  
  };

  verify=  ( password: string, hash: string ): Promise<boolean> =>{
    return Bun.password.verify(password, hash);
  };
}

export const passwordsConfig = Argon2Adapter.getInstance;