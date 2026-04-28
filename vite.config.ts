import { defineConfig } from 'vite';
import { resolve } from 'path';
import banner from 'vite-plugin-banner';
import mkcert from 'vite-plugin-mkcert';
import browserslistToEsbuild from "browserslist-to-esbuild";
import sass from 'sass';

export default defineConfig({
  plugins: [
    mkcert(),
    banner({
      content: `
/*!
 * 
 *  ////////////////////////////////////////////////////
 *  //                                                //
 *  //                                                //
 *  //         d8888           d8b 888                //
 *  //        d8P888           Y8P 888                //
 *  //       d8P 888               888                //
 *  //      d8P  888  .d8888b  888 888888 .d88b.      //
 *  //     d88   888  88K      888 888   d8P  Y8b     //
 *  //     8888888888 "Y8888b. 888 888   88888888     //
 *  //           888       X88 888 Y88b. Y8b.         //
 *  //           888   88888P' 888  "Y888 "Y8888      //
 *  //                                                //
 *  //                                                //
 *  ////////////////////////////////////////////////////
 *  //                                                //
 *  //               PETA Remember Me                 //
 *  //                                                //
 *  //        Build Date:  ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })} ${new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}        //
 *  //        Version: ${process.env.npm_package_version}                          //
 *  //                                                //
 *  //            Created by 4Site Studios            //
 *  //     www.4sitestudios.com/engaging-networks     //
 *  //                                                //
 *  ////////////////////////////////////////////////////
 *
 */`,
    }),
  ],
  build: {
    target: browserslistToEsbuild([">1%", "not dead"]),
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'PETARememberMe',
      fileName: 'welcome-back',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        entryFileNames: 'welcome-back.js',
        assetFileNames: 'welcome-back.css',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
  server: {
    allowedHosts: [".peta.org"],
    cors: {
      origin: "*", // Allow all origins (you can restrict this to specific origins if needed)
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  }
});