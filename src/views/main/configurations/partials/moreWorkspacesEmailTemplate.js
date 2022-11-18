export default ({ workspaceName, keyAccountName, workspaceSubDomain }) => {
  return `<body>
    <div style="color: #343C4B !important; background-color: #FFFFFF !important; margin: -8px; font-family: Montserrat, Verdana, Geneva, Tahoma, sans-serif;">
      <div style="padding: 32px 0;text-align: center; background-color: #FAFAFA;">
        <img src="https://storage.googleapis.com/justto_app/emails/logo-justto-email.png" alt="JUSTTO" />
      </div>

      <table border="0" cellpadding="0" width="100%">
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="750">
              <tr>
                <td align="center">
                  <img src="https://justtoemails.blob.core.windows.net/media/header-purple.png" border="0" alt="">
                </td>
              </tr>
              <tr>
                <td bgcolor="#ffffff" style="padding: 0px 30px 40px 30px;">
                  <table border="0" cellpadding="0" width="100%">
                    <tr>
                      <td><br>
                        <center>
                          <br>
                          Olá Financeiro, tudo bem? 
                          <br><br>
                          <p>
                            Cliente da workspace ${workspaceName}(${workspaceSubDomain}), teve seu limite de workspaces excedido.
                         </p>
                          <p>
                            Favor entrar em contato com o Key Acoount ${keyAccountName}, para verificar se teve alteração de valor de mensalidade
                          </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>


      <div style="padding: 32px 0;text-align: center; background-color: #424242 !important;">
        <h2 style="color: #FF9300;">
          Use #SOUJUSTTO nas redes sociais
        </h2>

        <div style="margin-bottom: 24px;">
          <a href="https://www.linkedin.com/company/justto/mycompany/" target="_blank" rel="noopener noreferrer" style="margin: 0 8px; display: inline; color: transparent !important;">
            <img src="https://storage.googleapis.com/justto_app/emails/gray-linkedin.png" alt="LinkedIn" />
          </a>
          <a href="https://www.instagram.com/sou.justto" target="_blank" rel="noopener noreferrer" style="margin: 0 8px; display: inline; color: transparent !important;">
            <img src="https://storage.googleapis.com/justto_app/emails/gray-instagram.png" alt="Instagram" />
          </a>
          <a href="https://www.facebook.com/souJustto" target="_blank" rel="noopener noreferrer" style="margin: 0 8px; display: inline; color: transparent !important;">
            <img src="https://storage.googleapis.com/justto_app/emails/gray-facebook.png" alt="Facebook" />
          </a>
          <a href="https://www.youtube.com/channel/UCbag5plsA_iFMluXnPOKTNQ" target="_blank" rel="noopener noreferrer" style="margin: 0 8px; display: inline; color: transparent !important;">
            <img src="https://storage.googleapis.com/justto_app/emails/gray-youtube.png" alt="YouTube" />
          </a>
        </div>

        <table style="text-align: justify; color: #757575;" align="center">
          <tbody>
            <tr>
              <td style="padding-right: 32px;">
                <address>
                  <img src="https://storage.googleapis.com/justto_app/emails/location.png" />
                  Av. Paulista, 171
                  <br>
                  4º andar, Bela Vista
                  <br>
                  <span style="font-weight: 600;">SÃO PAULO</span>
                </address>
              </td>

              <td style="color: #757575; padding-left: 32px;">
                <span style="font-weight: 600; color: #FF9300;">FALE CONOSCO</span>
                <br>
                <a style="color: #757575;" href="mailto:sou@justto.com.br">sou@justto.com.br</a>
                <br>
                <a style="color: #757575;" href="mailto:imprensa@justto.com.br">imprensa@justto.com.br</a>
              </td>
            </tr>
          </tbody>
        </table>

        <p style="color: #757575; margin-top: 24px;">
          Justto Inovações Tecnológicas S.A. Copyrights © 2012 - 2021.
          <br>
          Todos os Direitos Reservados
        </p>
      </div>
    </div>
  </body>
  `
}
