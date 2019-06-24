describe('Testing the excel form', function () {
    it ('Uploading the right file imports data from the excel successfully', function() {

        const testUrl = 'https://encodable.com/uploaddemo/';
        const fileName = 'planilha-modelo.xlsx';
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const fileInput = 'input[type=file]';

        cy.visit(testUrl);
        cy.upload_file(fileName, fileType, fileInput);
        cy.get('#other_form_input2').type('input_content2');

        cy.get('button').contains('Submit').click();

        cy.get('.result-dialog').should('contain', 'X elements from the excel where successfully imported');
    })
})