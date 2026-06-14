import { defineConfig } from 'drizzle-kit';
import { envs } from '../envs/envs.config';

const basePathForSchemasPaths = `./src/application`;

export default defineConfig({
  out: './data',
  schema: [
    `${basePathForSchemasPaths}/user/schema/user-drizzle.schema.ts`
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: envs.POSTGRES_URL,
  },
});
