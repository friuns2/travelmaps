import { defineNuxtConfig } from 'nuxt';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable devtools
  devtools: { enabled: true },

  // Nitro configuration
  nitro: {
    preset: "cloudflare-pages"
  },

  // Modules to be included
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/scripts',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv'
  ],

  // Tailwind CSS configuration
  tailwindcss: {
    config: {
      plugins: [require('daisyui')]
    }
  },

  // Disable server-side rendering (SSR)
  ssr: false,

  // App configuration
  app: {
    head: {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`,
          async: true,
          defer: true
        },
        //{ src: 'maps.js', defer: false }
      ]
    }
  },

  // Runtime configuration
  runtimeConfig: {
    public: {
      openWeatherMapApiKey: process.env.OPENWEATHERMAP_API_KEY,
    }
  }
});
