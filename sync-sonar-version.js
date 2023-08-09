const fs = require('fs')

fs.readFile('package.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo a.json:', err)
    return
  }

  try {
    const jsonData = JSON.parse(data)
    const version = jsonData.version

    fs.readFile('sonar-project.properties', 'utf8', (err, propertiesData) => {
      if (err) {
        console.info('Erro ao ler o arquivo sonar-project.properties:', err)
        return
      }

      const updatedPropertiesData = propertiesData.replace(/(sonar\.projectVersion=).*/, `$1${version}`)

      fs.writeFile('sonar-project.properties', updatedPropertiesData, 'utf8', (err) => {
        if (err) {
          console.info('Erro ao escrever o arquivo sonar-project.properties:', err)
          return
        }
        console.log('Valor da versão atualizado com sucesso!')
      })
    })
  } catch (jsonError) {
    console.info('Erro ao analisar o JSON de a.json:', jsonError)
  }
})
