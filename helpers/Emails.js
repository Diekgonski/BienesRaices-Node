import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, nombre, token } = datos;

      // Enviar Email
      await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu Cuenta en BienesRaices.com',
        text: 'Confirma tu Cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirma tu cuenta</a></p>

            <p>Si tu no creaste esta cuenta, por favor ignora este mensaje</p>
        `   
            
      })
}

const emailOlvideMiPassword = async (datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const { email, nombre, token } = datos;

    // Enviar Email
    await transport.sendMail({
      from: 'BienesRaices.com',
      to: email,
      subject: 'Restablece tu Password BienesRaices.com',
      text: 'Restablece tu Password BienesRaices.com',
      html: `
          <p>Hola ${nombre}, has solicitado restablecer tu password en BienesRaices.com</p>

          <p>Sigue el siguiente enlace para generar un password nuevo: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recuperarPassword/${token}">Restablecer Password</a></p>

          <p>Si tu no solicitaste el cambio de password, por favor ignora este mensaje</p>
      `   
          
    });
}

const emailNotificacionNuevoMensaje = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, nombrePropiedad, emailSolicitante, nombreSolicitante, idPropiedad } = datos;

  // Enviar Email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Nuevo mensaje en tu publicación de BienesRaices.com',
    text: '¡Alguien esta interesado en tu propiedad!',
    html: `
        <p>Hola ${nombre}, alguien esta interesado en tu propiedad ${nombrePropiedad} y te ha enviado un nuevo mensaje, los detalles del solicitante: </p>

        <p>- Nombre Solicitante: ${nombreSolicitante}</p>
        <p>- Email Solicitante: ${emailSolicitante}</p>

        <p>Sigue el siguiente enlace para ver el nuevo mensaje: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/mensajes/${idPropiedad}">Ver Nuevo Mensaje</a></p>
    `   
        
  });
}

export {
    emailRegistro,
    emailOlvideMiPassword,
    emailNotificacionNuevoMensaje
}