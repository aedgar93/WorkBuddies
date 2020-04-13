module.exports = function() {
  return  `
<head>
      <!-- NAME: 1 COLUMN - FULL WIDTH -->
      <!--[if gte mso 15]>
        <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title></title>

      <style type="text/css">
        p {
          margin: 10px 0;
          padding: 0;
        }

        table {
          border-collapse: collapse;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          display: block;
          margin: 0;
          padding: 0;
        }

        img,
        a img {
          border: 0;
          height: auto;
          outline: none;
          text-decoration: none;
        }

        body,
        #bodyTable,
        #bodyCell {
          height: 100%;
          margin: 0;
          padding: 0;
          width: 100%;
        }

        .mcnPreviewText {
          display: none !important;
        }

        #outlook a {
          padding: 0;
        }

        img {
          -ms-interpolation-mode: bicubic;
        }

        table {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }

        .ReadMsgBody {
          width: 100%;
        }

        .ExternalClass {
          width: 100%;
        }

        p,
        a,
        li,
        td,
        blockquote {
          mso-line-height-rule: exactly;
        }

        a[href^=tel],
        a[href^=sms] {
          color: inherit;
          cursor: default;
          text-decoration: none;
        }

        p,
        a,
        li,
        td,
        body,
        table,
        blockquote {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass td,
        .ExternalClass div,
        .ExternalClass span,
        .ExternalClass font {
          line-height: 100%;
        }

        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }

        .templateContainer {
          max-width: 600px !important;
        }

        a.mcnButton {
          display: block;
        }

        .mcnImage,
        .mcnRetinaImage {
          vertical-align: bottom;
        }

        .mcnTextContent {
          word-break: break-word;
        }

        .mcnTextContent img {
          height: auto !important;
        }

        .mcnDividerBlock {
          table-layout: fixed !important;
        }

        body,
        #bodyTable {
          background-color: #ffffff;
        }

        #bodyCell {
          border-top: 0;
        }

        h1 {
          color: #202020;
          font-family: Helvetica;
          font-size: 26px;
          font-style: normal;
          font-weight: bold;
          line-height: 125%;
          letter-spacing: normal;
          text-align: left;
        }

        h2 {
          color: #202020;
          font-family: Helvetica;
          font-size: 22px;
          font-style: normal;
          font-weight: bold;
          line-height: 125%;
          letter-spacing: normal;
          text-align: left;
        }

        h3 {
          color: #202020;
          font-family: Helvetica;
          font-size: 20px;
          font-style: normal;
          font-weight: bold;
          line-height: 125%;
          letter-spacing: normal;
          text-align: left;
        }

        h4 {
          color: #202020;
          font-family: Helvetica;
          font-size: 18px;
          font-style: normal;
          font-weight: bold;
          line-height: 125%;
          letter-spacing: normal;
          text-align: left;
        }

        #templatePreheader {
          background-color: #ffffff;
          background-image: none;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          border-top: 0;
          border-bottom: 0;
          padding-top: 0px;
          padding-bottom: 0px;
        }

        #templatePreheader .mcnTextContent,
        #templatePreheader .mcnTextContent p {
          color: #656565;
          font-family: Helvetica;
          font-size: 12px;
          line-height: 150%;
          text-align: left;
        }

        #templatePreheader .mcnTextContent a,
        #templatePreheader .mcnTextContent p a {
          color: #656565;
          font-weight: normal;
          text-decoration: underline;
        }

        #templateHeader {
          background-color: #FFFFFF;
          background-image: none;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          border-top: 0;
          border-bottom: 0;
          padding-top: 9px;
          padding-bottom: 0;
        }

        #templateHeader .mcnTextContent,
        #templateHeader .mcnTextContent p {
          color: #202020;
          font-family: Helvetica;
          font-size: 16px;
          line-height: 150%;
          text-align: left;
        }

        #templateHeader .mcnTextContent a,
        #templateHeader .mcnTextContent p a {
          color: #007C89;
          font-weight: normal;
          text-decoration: underline;
        }

        #templateBody {
          background-color: #FFFFFF;
          background-image: none;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          border-top: 0;
          border-bottom: 0;
          padding-top: 9px;
          padding-bottom: 9px;
        }

        #templateBody .mcnTextContent,
        #templateBody .mcnTextContent p {
          color: #202020;
          font-family: Helvetica;
          font-size: 16px;
          line-height: 150%;
          text-align: left;
        }

        #templateBody .mcnTextContent a,
        #templateBody .mcnTextContent p a {
          color: #007C89;
          font-weight: normal;
          text-decoration: underline;
        }

        #templateFooter {
          background-color: #ffffff;
          background-image: none;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          border-top: 0;
          border-bottom: 0;
          padding-top: 0px;
          padding-bottom: 0px;
        }

        #templateFooter .mcnTextContent,
        #templateFooter .mcnTextContent p {
          color: #656565;
          font-family: Helvetica;
          font-size: 12px;
          line-height: 150%;
          text-align: center;
        }

        #templateFooter .mcnTextContent a,
        #templateFooter .mcnTextContent p a {
          color: #656565;
          font-weight: normal;
          text-decoration: underline;
        }

        @media only screen and (min-width:768px) {
          .templateContainer {
            width: 600px !important;
          }

        }

        @media only screen and (max-width: 480px) {

          body,
          table,
          td,
          p,
          a,
          li,
          blockquote {
            -webkit-text-size-adjust: none !important;
          }

        }

        @media only screen and (max-width: 480px) {
          body {
            width: 100% !important;
            min-width: 100% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          #bodyCell {
            padding-top: 10px !important;
          }

        }

        @media only screen and (max-width: 480px) {
          .mcnRetinaImage {
            max-width: 100% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          .mcnImage {
            width: 100% !important;
          }

        }

        @media only screen and (max-width: 480px) {

          .mcnCartContainer,
          .mcnCaptionTopContent,
          .mcnRecContentContainer,
          .mcnCaptionBottomContent,
          .mcnTextContentContainer,
          .mcnBoxedTextContentContainer,
          .mcnImageGroupContentContainer,
          .mcnCaptionLeftTextContentContainer,
          .mcnCaptionRightTextContentContainer,
          .mcnCaptionLeftImageContentContainer,
          .mcnCaptionRightImageContentContainer,
          .mcnImageCardLeftTextContentContainer,
          .mcnImageCardRightTextContentContainer,
          .mcnImageCardLeftImageContentContainer,
          .mcnImageCardRightImageContentContainer {
            max-width: 100% !important;
            width: 100% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          .mcnBoxedTextContentContainer {
            min-width: 100% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          .mcnImageGroupContent {
            padding: 9px !important;
          }

        }

        @media only screen and (max-width: 480px) {

          .mcnCaptionLeftContentOuter .mcnTextContent,
          .mcnCaptionRightContentOuter .mcnTextContent {
            padding-top: 9px !important;
          }

        }

        @media only screen and (max-width: 480px) {

          .mcnImageCardTopImageContent,
          .mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,
          .mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent {
            padding-top: 18px !important;
          }

        }

        @media only screen and (max-width: 480px) {
          .mcnImageCardBottomImageContent {
            padding-bottom: 9px !important;
          }

        }

        @media only screen and (max-width: 480px) {
          .mcnImageGroupBlockInner {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }

        }

        @media only screen and (max-width: 480px) {
          .mcnImageGroupBlockOuter {
            padding-top: 9px !important;
            padding-bottom: 9px !important;
          }

        }

        @media only screen and (max-width: 480px) {

          .mcnTextContent,
          .mcnBoxedTextContentColumn {
            padding-right: 18px !important;
            padding-left: 18px !important;
          }

        }

        @media only screen and (max-width: 480px) {

          .mcnImageCardLeftImageContent,
          .mcnImageCardRightImageContent {
            padding-right: 18px !important;
            padding-bottom: 0 !important;
            padding-left: 18px !important;
          }

        }

        @media only screen and (max-width: 480px) {
          .mcpreview-image-uploader {
            display: none !important;
            width: 100% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          h1 {
            font-size: 22px !important;
            line-height: 125% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          h2 {
            font-size: 20px !important;
            line-height: 125% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          h3 {
            font-size: 18px !important;
            line-height: 125% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          h4 {
            font-size: 16px !important;
            line-height: 150% !important;
          }

        }

        @media only screen and (max-width: 480px) {

          .mcnBoxedTextContentContainer .mcnTextContent,
          .mcnBoxedTextContentContainer .mcnTextContent p {
            font-size: 14px !important;
            line-height: 150% !important;
          }

        }

        @media only screen and (max-width: 480px) {
          #templatePreheader {
            display: block !important;
          }

        }

        @media only screen and (max-width: 480px) {

          #templatePreheader .mcnTextContent,
          #templatePreheader .mcnTextContent p {
            font-size: 14px !important;
            line-height: 150% !important;
          }

        }

        @media only screen and (max-width: 480px) {

          #templateHeader .mcnTextContent,
          #templateHeader .mcnTextContent p {
            font-size: 16px !important;
            line-height: 150% !important;
          }

        }

        @media only screen and (max-width: 480px) {

          #templateBody .mcnTextContent,
          #templateBody .mcnTextContent p {
            font-size: 16px !important;
            line-height: 150% !important;
          }

        }

        @media only screen and (max-width: 480px) {

          #templateFooter .mcnTextContent,
          #templateFooter .mcnTextContent p {
            font-size: 14px !important;
            line-height: 150% !important;
          }

        }
      </style>
    </head>

    <body
      style="height: 100%;margin: 0;padding: 0;width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #ffffff;">
      <!--
-->
      <center>
        <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"
          style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 0;width: 100%;background-color: #ffffff;">
          <tr>
            <td align="center" valign="top" id="bodyCell"
              style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;height: 100%;margin: 0;padding: 0;width: 100%;border-top: 0;">
              <!-- BEGIN TEMPLATE // -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%"
                style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                <tr>
                  <td align="center" valign="top" id="templateHeader"
                    style="background:#FFFFFF none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FFFFFF;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 0;">
                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                      class="templateContainer"
                      style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;max-width: 600px !important;">
                      <tr>
                        <td valign="top" class="headerContainer"
                          style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"
                            style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                            <tbody class="mcnImageBlockOuter">
                              <tr>
                                <td valign="top"
                                  style="padding: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"
                                  class="mcnImageBlockInner">
                                  <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0"
                                    class="mcnImageContentContainer"
                                    style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                    <tbody>
                                      <tr>
                                        <td class="mcnImageContent" valign="top"
                                          style="padding-right: 9px;padding-left: 9px;padding-top: 0;padding-bottom: 0;text-align: center;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">


                                          <img align="center" alt=""
                                            src="https://mcusercontent.com/13e8757f915c60d5856f71d24/images/b9f4d62f-fb3f-4e9a-b899-802b54aaccd2.jpg"
                                            width="198.9"
                                            style="max-width: 510px;padding-bottom: 0;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;"
                                            class="mcnImage">


                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                  </td>
                </tr>
                <tr>
                  <td align="center" valign="top" id="templateBody"
                    style="background:#FFFFFF none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FFFFFF;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 9px;">
                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                      class="templateContainer"
                      style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;max-width: 600px !important;">
                      <tr>
                        <td valign="top" class="bodyContainer"
                          style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                            style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                            <tbody class="mcnTextBlockOuter">
                              <tr>
                                <td valign="top" class="mcnTextBlockInner"
                                  style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                  <!--[if mso]>
                <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                <tr>
                <![endif]-->

                                  <!--[if mso]>
                <td valign="top" width="600" style="width:600px;">
                <![endif]-->
                                  <table align="left" border="0" cellpadding="0" cellspacing="0"
                                    style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"
                                    width="100%" class="mcnTextContentContainer">
                                    <tbody>
                                      <tr>

                                        <td valign="top" class="mcnTextContent"
                                          style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">

                                          <h1
                                            style="text-align: center;display: block;margin: 0;padding: 0;color: #202020;font-family: Helvetica;font-size: 26px;font-style: normal;font-weight: bold;line-height: 125%;letter-spacing: normal;">
                                            {{greeting}} {{admin_name}} invited you to join Work Buddies!</h1>

                                          <p
                                            style="text-align: center;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;">
                                            <span style="color:#7F68FF"><strong><span style="font-size:15px">Get to know
                                                  your co-workers, one activity at a time.</span></strong></span></p>

                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if mso]>
                </td>
                <![endif]-->

                                  <!--[if mso]>
                </tr>
                </table>
                <![endif]-->
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock"
                            style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                            <tbody class="mcnButtonBlockOuter">
                              <tr>
                                <td
                                  style="padding-top: 0;padding-right: 18px;padding-bottom: 18px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"
                                  valign="top" align="center" class="mcnButtonBlockInner">
                                  <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer"
                                    style="border-collapse: separate !important;border-radius: 4px;background-color: #7F68FF;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                    <tbody>
                                      <tr>
                                        <td align="center" valign="middle" class="mcnButtonContent"
                                          style="font-family: Arial;font-size: 16px;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                          <a class="mcnButton " title="Join Today" href="{{link}}"
                                            target="_blank"
                                            style="font-weight: bold;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Join
                                            Today</a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                            style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                            <tbody class="mcnTextBlockOuter">
                              <tr>
                                <td valign="top" class="mcnTextBlockInner"
                                  style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                  <!--[if mso]>
                <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                <tr>
                <![endif]-->

                                  <!--[if mso]>
                <td valign="top" width="600" style="width:600px;">
                <![endif]-->
                                  <table align="left" border="0" cellpadding="0" cellspacing="0"
                                    style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"
                                    width="100%" class="mcnTextContentContainer">
                                    <tbody>
                                      <tr>

                                        <td valign="top" class="mcnTextContent"
                                          style="padding: 0px 18px 9px;line-height: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;text-align: left;">

                                          <div style="text-align: center;"><span style="color:#808080"><span
                                                style="font-size:14px">Each week you will be paired up with someone from
                                                your office. Talk to your buddy and find a time to complete an
                                                activity.</span></span></div>

                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if mso]>
                </td>
                <![endif]-->

                                  <!--[if mso]>
                </tr>
                </table>
                <![endif]-->
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                  </td>
                </tr>
                <tr>
                  <td align="center" valign="top" id="templateFooter"
                    style="background:#ffffff none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #ffffff;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 0px;padding-bottom: 0px;">
                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                      class="templateContainer"
                      style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;max-width: 600px !important;">
                      <tr>
                        <td valign="top" class="footerContainer"
                          style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                            style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                            <tbody class="mcnTextBlockOuter">
                              <tr>
                                <td valign="top" class="mcnTextBlockInner"
                                  style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                  <!--[if mso]>
                <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                <tr>
                <![endif]-->

                                  <!--[if mso]>
                <td valign="top" width="600" style="width:600px;">
                <![endif]-->
                                  <table align="left" border="0" cellpadding="0" cellspacing="0"
                                    style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"
                                    width="100%" class="mcnTextContentContainer">
                                    <tbody>
                                      <tr>

                                        <td valign="top" class="mcnTextContent"
                                          style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #656565;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">

                                          <span style="color:#808080">&copy;2020 Work Buddies</span><br>
                                          &nbsp;
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if mso]>
                </td>
                <![endif]-->

                                  <!--[if mso]>
                </tr>
                </table>
                <![endif]-->
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                  </td>
                </tr>
              </table>
              <!-- // END TEMPLATE -->
            </td>
          </tr>
        </table>
      </center>
      <center>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <style type="text/css">
          @media only screen and (max-width: 480px) {
            table#canspamBar td {
              font-size: 14px !important;
            }

            table#canspamBar td a {
              display: block !important;
              margin-top: 10px !important;
            }
          }
        </style>
      </center>
    </body>
    `;
  };
