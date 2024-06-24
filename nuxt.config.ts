// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

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

  app: {
    head: {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`,
          async: true,
          defer: true
        },        
        //{  src: 'maps.js',defer: false}
      ]
    } 
  }
})