import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        sending: "./frontend/js/sending.js",
        sign: "./frontend/js/sign.js",
        room: "./frontend/js/room.js",
      },
      formats: ["es"],
    },
  },
});
