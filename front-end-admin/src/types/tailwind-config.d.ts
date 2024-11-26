declare module 'tailwindcss/lib/util/color' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parseColor = (value: string): { color: Array<string> } => {}
  export { parseColor }
}

declare module 'tailwind-config' {
  const config: Config
  export default config
}
