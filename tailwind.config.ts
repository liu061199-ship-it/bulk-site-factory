import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121417",
        cloud: "#f5f7fb",
        line: "#d9e1ea"
      }
    }
  },
  plugins: []
};

export default config;
