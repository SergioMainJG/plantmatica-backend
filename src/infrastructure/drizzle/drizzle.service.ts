import { Injectable } from "@nestjs/common";
import { drizzle } from 'drizzle-orm/node-postgres';
import { envs } from '~/config/envs/envs.config'

@Injectable()
export class DrizzleService{
  private readonly db: ReturnType<typeof drizzle> ;

  constructor(){
    this.db = drizzle( envs.POSTGRES_URL );
  }

  getDb(): typeof this.db{
    return this.db;
  }
}