/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 이 부분이 TypeScript/React 파일을 포함하도록
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}