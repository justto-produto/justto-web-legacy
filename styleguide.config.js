module.exports = {
  // components: 'src/components/**/[A-Z]*.vue',
  defaultExample: true,
  pagePerSection: true,
  ribbon: {
    url: 'https://gitlab.com/Justto/justto-web/wikis/',
    text: 'Justto Web Wiki'
  },
  theme: {
    borderRadius: 6,
    color: {
      base: '#343c4b',
      light: '#424242',
      lightest: '#adadad',
      link: '#ffc900',
      linkHover: 'ff8e00 ',
      // border: '#fbf6fb',
      name: '#7f9a44',
      type: '#b77daa',
      error: '#FF4B54',
      // baseBackground: '#2d323b',
      // sidebarBackground: '#ffffff',
      ribbonBackground: '#9461f7',
      ribbonText: '#fff'
    },
    fontFamily: {
      base: "'Montserrat', sans-serif"
    }
  },
  sections: [
    {
      name: 'Buttons',
      components: 'src/components/buttons/**/[A-Z]*.vue'
    },
    {
      name: 'Charts',
      components: 'src/components/charts/**/[A-Z]*.vue'
    },
    {
      name: 'Images',
      components: 'src/components/images/**/[A-Z]*.vue'
    },
    {
      name: 'Layouts',
      components: 'src/components/layouts/**/[A-Z]*.vue'
    },
    {
      name: 'Others',
      components: 'src/components/others/**/[A-Z]*.vue'
    }
  ]
}
