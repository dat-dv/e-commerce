type DatabaseEnv = {
  POSTGRES_HOST?: string;
  POSTGRES_PORT?: string | number;
  POSTGRES_USER?: string;
  POSTGRES_PASSWORD?: string;
  POSTGRES_DB?: string;
  POSTGRES_SCHEMA?: string;
};

export function buildPostgresUrl(env: DatabaseEnv): string {
  const host = env.POSTGRES_HOST;
  const port = env.POSTGRES_PORT;
  const user = env.POSTGRES_USER;
  const password = env.POSTGRES_PASSWORD;
  const database = env.POSTGRES_DB;
  const schema = env.POSTGRES_SCHEMA ?? 'public';

  if (!host || !port || !user || !password || !database) {
    throw new Error(
      'PostgreSQL env is incomplete. Required: POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB.',
    );
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  const encodedSchema = encodeURIComponent(schema);

  return `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}?schema=${encodedSchema}`;
}
