import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'; // Assuming you are using React

// export default defineConfig({
//   plugins: [react()], // Don't forget to include necessary plugins if you have them
//   base: '/cg-247artists-trail/', // <--- ADD THIS LINE AND CUSTOMIZE FOR EACH APP

//   build: {
//     assetsInclude: [
//       "**/*.jpeg",
//       "**/*.jpg",
//       "**/*.png",
//       "**/*.svg",
//       "**/*.gif",
//     ],
//     // `copyPublicDir` is true by default for `build`, so explicitly setting it often isn't necessary
//     // copyPublicDir: true, // You can remove this if you want default behavior

//     rollupOptions: {
//       output: {
//         // This setting will put all assets (images, fonts, etc.) directly into 'assets/'
//         // instead of 'assets/img/', 'assets/font/' etc., which is fine.
//         assetFileNames: "assets/[name].[ext]",
//       },
//     },
//   },
// });
export default defineConfig({
  base: '/cg-247artists-trail/',
})