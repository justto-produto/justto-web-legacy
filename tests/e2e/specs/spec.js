const attachFiles = require('cypress-form-data-with-file-upload')
beforeEach(() => {
  cy.visit('localhost:3000')
})
it('uploads', () => {
  // files to upload for each input[type="file"] by name
  // we are going to construct a single text file in this test
  // for <input type="file" name="fileToUpload" />
  const files = {
    fileToUpload: new File(['foo bar'], 'test-file.txt', {
      type: 'text/plain'
    })
  }
  // get the form element and attach files to upload
  cy.get('form').then(attachFiles(files))

  // submit the form
  cy.get('input[type="submit"]').click()

  // check returned page
  // or check url
  // or spy on the XHR form submission
})