declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_URL: string;
    NODE_ENV: 'development' | 'production';
    PORT: number;
    DATABASE_URL: string;
    ADMIN_NAME: string;
    ADMIN_PASSWORD: string;
    GUEST_NAME: string;
    GUEST_PASSWORD: string;
  }
}
