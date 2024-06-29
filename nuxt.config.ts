// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages"
  },

  modules: ['@nuxtjs/tailwindcss', "@nuxt/scripts", "@nuxt/eslint"],
  tailwindcss: {
    config: {
      plugins: [require('daisyui')]
    }
  },

  ssr: false,

  app: {
    head: { 
      meta: [        
        {
          name: 'description',
          content: 'Travel Creator helps you discover and plan your travel itineraries. Explore attractions, create custom itineraries, and visualize your travel plans on an interactive map.'
        }
      ],
      script: [
      // {src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`,async: true, defer: true},        
        { src: 'maps.js', defer: false }, {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-WT3VZNT7E6',
          async: true
        },
        {
          children: `
        window.dataLayer = window.dataLayer || []; 
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-WT3VZNT7E6');
      `,
          type: 'text/javascript'
        } 

      ]
    }
  }
})