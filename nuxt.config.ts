// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  
  nitro: {
    preset: "cloudflare-pages"
  },
  
  modules: ['@nuxtjs/tailwindcss', "@nuxt/scripts"],
  
  tailwindcss: {
    config: {
      plugins: [require('daisyui')]
    }
  },
  
  ssr: false,
  
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
    }
  },
  
  app: {
    head: {
      script: [
        {
          src: 'https://maps.googleapis.com/maps/api/js?key=',
          async: true,
          defer: true
        },
        // { src: 'maps.js', defer: false }
      ]
    }
  },

  // Add this to ensure environment variables are loaded
  build: {
    transpile: ['@googlemaps/js-api-loader']
  }
})