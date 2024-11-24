export const logger = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};
