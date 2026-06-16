import { defineConfig } from 'drizzle-kit';
import { envs } from '~/config/envs/envs.config';

const basePathForSchemasPaths = `./src/infrastructure/drizzle/schema/`;

export default defineConfig({
  out: './data',
  schema: [
    `${basePathForSchemasPaths}/user-drizzle.schema.ts`
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: envs.POSTGRES_URL,
  },
});
