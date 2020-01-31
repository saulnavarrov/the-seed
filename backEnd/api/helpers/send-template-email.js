module.exports = {


  friendlyName: 'Send template email',


  description: 'Enviar un correo electrónico utilizando una plantilla.',


  extendedDescription:
`Para facilitar las pruebas y el desarrollo, si la dirección de correo electrónico proporcionada "a"
termina en "@ example.com",entonces el mensaje de correo electrónico se escribirá en el terminal en
lugar de enviarse realmente. (Gracias [@simonratner] (https://github.com/simonratner)!)`,


  inputs: {

    template: {
      description: 'La ruta relativa a una plantilla EJS dentro de nuestra carpeta `views/emails/` - SIN la extensión de archivo.',
      extendedDescription:`Use cadenas como "foo" o "foo / bar", pero NUNCA "foo/bar.ejs". Por ejemplo,
      "marketing / welcome" enviaría un correo electrónico utilizando la plantilla "views/emails/marketing/welcome.ejs".`,
      example: 'reset-password',
      type: 'string',
      required: true
    },

    templateData: {
      description: 'Un diccionario de datos que será accesible en la plantilla EJS.',
      extendedDescription: `Cada clave será una variable local accesible en la plantilla. Por ejemplo, si usted suministra
      un diccionario con una 'friends' key, and 'friends' es una matriz como '([{name: "Chandra"}, {nombre: "María"}])',
      Entonces podrás acceder a 'friends' desde la plantilla:
      '''
      <ul>
        <% for (friend of friends) { %>
          <li> <%= friend.name %> </ li>
        <% }); %>
      </ul>
      '''
      Esto es EJS, así que use '<% =%>' para inyectar el contenido escapado de HTML de una variable,
      <%= %>' para omitir el escape de HTML e inyectar los datos como están, o '<%%>' para ejecutar
      algún código JavaScript como una declaración 'if' o 'for' loop`,
      type: {},
      defaultsTo: {}
    },

    to: {
      description: 'La dirección de correo electrónico del destinatario principal.',
      extendedDescription:`Si esta es una dirección que termina en "@example.com",
      entonces no envíe el mensaje. En su lugar, simplemente inicie sesión en la
      consola.`,
      example: 'foo@bar.com',
      required: true
    },

    subject: {
      description: 'El asunto del email.',
      example: 'Hola!',
      defaultsTo: ''
    },

    layout: {
      description:
      `Establecer en 'falso' para deshabilitar los diseños por completo, o proporcionar
      la ruta (relativa views/layouts/') a un diseño de correo electrónico anulado.`,
      defaultsTo: 'layout-email',
      custom: (layout)=>layout===false || _.isString(layout)
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Informe de entrega de correo electrónico',
      outputDescription: 'Un diccionario de información sobre lo que pasó.',
      outputType: {
        loggedInsteadOfSending: 'boolean'
      }
    }

  },


  fn: async function(inputs, exits) {

    var path = require('path');
    var url = require('url');
    var util = require('util');


    if (!_.startsWith(path.basename(inputs.template), 'email-')) {
      sails.log.warn(`
        La "plantilla" que se pasó a 'sendTemplateEmail()' no comienza con "email-",
        pero por convención, todos los archivos de plantilla de correo electrónico en
        'views/emails/' deberían tener espacios de nombres de esta manera.
        (Esto facilita la búsqueda de plantillas de correo electrónico por nombre del
        archivo; p.ej. cuando se usa CMD/CTRL+P en Sublime Text.)
        Continuando independientemente,..`
      );
    }

    if (_.startsWith(inputs.template, 'views/') || _.startsWith(inputs.template, 'emails/')) {
      throw new Error(
        `La "plantilla" que se pasó a 'sendTemplateEmail()' tenía el prefijo
         'emails/' o 'views/', pero se supone que esa parte debe omitirse. En cambio, por favor
         simplemente especifique la ruta a la plantilla de correo electrónico deseada relativa desde 'views/emails/'.
         Por ejemplo:
           template: \'email-reset-password\'
         O:
           template: \'admin/email-contact-form\'
          [?] Si no está seguro o necesita asesoramiento, consulte https://sailsjs.com/support
        `
      );
    }//•

    // Determine appropriate email layout and template to use.
    var emailTemplatePath = path.join('emails/', inputs.template);
    var layout;
    if (inputs.layout) {
      layout = path.relative(path.dirname(emailTemplatePath), path.resolve('layouts/', inputs.layout));
    } else {
      layout = false;
    }

    // Compile HTML template.
    // > Note that we set the layout, provide access to core `url` package (for
    // > building links and image srcs, etc.), and also provide access to core
    // > `util` package (for dumping debug data in internal emails).
    var htmlEmailContents = await sails.renderView(
      emailTemplatePath,
      Object.assign({layout, url, util }, inputs.templateData)
    )
    .intercept((err)=>{
      err.message =
      `No se pudo compilar la plantilla de vista.
      (Por lo general, esto significa que los datos proporcionados no son válidos o faltan piezas).
      Detalles:`+
      err.message;
      return err;
    });

    // Sometimes only log info to the console about the email that WOULD have been sent.
    // Specifically, if the "To" email address is anything "@example.com".
    //
    // > This is used below when determining whether to actually send the email,
    // > for convenience during development, but also for safety.  (For example,
    // > a special-cased version of "user@example.com" is used by Trend Micro Mars
    // > scanner to "check apks for malware".)
    var isToAddressConsideredFake = Boolean(inputs.to.match(/@example\.com$/i));

    // If that's the case, or if we're in the "test" environment, then log
    // the email instead of sending it:
    if (sails.config.environment === 'test' || isToAddressConsideredFake) {
      sails.log(
`Se omitió el envío de correo electrónico, ya sea porque la dirección de correo electrónico "Para" terminó en "@example.com"
o porque el actual "sails.config.environment" está configurado para "test".

Pero de todos modos, esto es lo que SE HABRÍA enviado:
-=-=-=-=-=-=-=-=-=-=-=-=-= Email log =-=-=-=-=-=-=-=-=-=-=-=-=-
To: ${inputs.to}
Subject: ${inputs.subject}

Body:
${htmlEmailContents}
-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-`);
    } else {
      // Otherwise, we'll check that all required Mailgun credentials are set up
      // and, if so, continue to actually send the email.

      if (!sails.config.custom.mailgunSecret || !sails.config.custom.mailgunDomain) {
        throw new Error(`No se puede entregar el correo electrónico a "${inputs.to}" porque:
        `+(()=>{
          let problems = [];
          if (!sails.config.custom.mailgunSecret) {
            problems.push(' • Falta el secreto de Mailgun en la configuración de esta aplicación (`sails.config.custom.mailgunSecret`)');
          }
          if (!sails.config.custom.mailgunDomain) {
            problems.push(' • Falta el dominio de Mailgun en la configuración de esta aplicación (`sails.config.custom.mailgunDomain`)');
          }
          return problems.join('\n');
        })()+`

Para resolver estos problemas de configuración, agregue las variables de configuración que faltan a
"config/custom.js" - o en la staging/production, configúrelos como sistema
entorno vars. (Si no tiene un dominio o secreto Mailgun, puede
Regístrese gratis en https://mailgun.com para recibir credenciales de sandbox.)

> Tenga en cuenta que, para su comodidad durante el desarrollo, existe otra alternativa:
> En lugar de configurar credenciales reales de Mailgun, puede "falsificar" el correo electrónico
> entrega mediante el uso de cualquier dirección de correo electrónico que termine en "@example.com". Esta voluntad
> escriba correos electrónicos automatizados en sus registros en lugar de enviarlos realmente.
> (Para simular hacer clic en un enlace de un correo electrónico, simplemente copie y pegue el enlace
> desde la salida del terminal a su navegador.)

  [?] Si no está seguro, visite https: // sailsjs.com / support`
        );
      }

      await sails.helpers.mailgun.sendEmailHtml.with({
        htmlMessage: htmlEmailContents,
        to: inputs.to,
        subject: inputs.subject,
        testMode: sails.config.custom.sendEmailtestMode
      });

    }//ﬁ

    // All done!
    return exits.success({
      loggedInsteadOfSending: isToAddressConsideredFake
    });

  }

};
