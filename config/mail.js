// config/mail.js

// Simulamos la función principal de envío
const sendMail = async (opciones) => {
    // En lugar de conectar a un SMTP, resolvemos en milisegundos
    console.log(`[MOCK EMAIL] Simulación de correo enviado a: ${opciones.to}`);
    return Promise.resolve({ success: true, message: 'Mock email sent' });
};

// Si exportabas un transporter de nodemailer, exporta un objeto vacío o con métodos simulados
const transporter = {
    sendMail: sendMail,
    verify: () => Promise.resolve(true)
};

module.exports = {
    sendMail,
    transporter
};