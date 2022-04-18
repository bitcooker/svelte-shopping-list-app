const production = !process.env.ROLLUP_WATCH;
module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [

  ],
  purge: {
    content: [
     "./src/**/*.svelte",

    ],
    // enabled: production // disable purge in dev
  },
  theme: {
    extend: {
      colors: {
        'grey':"#aea4a4",
        'berry':"#FF0066",
        'berry-dark':"#cc0454"

      },
      width: {
        "w-fit": "fit-content",
        "max-w-fit": {"max-width": "max-content"}
      }
    },
  }
};