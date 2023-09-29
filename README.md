[![wercker status](https://app.wercker.com/status/05b7de415f5b4c9f8fd128edd932c80e/s/ "wercker status")](https://app.wercker.com/project/byKey/05b7de415f5b4c9f8fd128edd932c80e)

# Justto Web 2.0

Novo sistema web da ProJuris que agora funciona. :heart:

[:point_right: Leia a documentação antes de programar!! :point_left:](https://gitlab.com/Justto/justto-web/wikis/)

## Dev stack :wrench:
- [Vue.js](https://vuejs.org/)
- [Webpack](https://webpack.js.org/)
- [ESLint](https://eslint.org/)
- [Unit test: Jest](https://jestjs.io/)
- [E2e test: Cypress](https://www.cypress.io/)
- [Sass](https://sass-lang.com/)
- [Element.ui](http://element-cn.eleme.io)
- [JS Standard Pattern](https://standardjs.com/)

### Como rodar via prompt

###### Instale as dependências
`yarn install`

###### Para subir servidor de desenvolvimento:

`yarn serve`

###### Acesse:

`http://localhost:8080/`

###### Para build:

`yarn build`

###### Para styleguide:

`yarn styleguide`

###### .env.local
VUE_APP_BASE_URL=https://backend.justto.app/
BASE_URL=https://backend.justto.app/
