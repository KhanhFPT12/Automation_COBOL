const nodemailer = require('nodemailer');

const t = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'foreverlaboy333@gmail.com',
    pass: 'gpopbggvmfagzlmc',
  },
});

t.verify()
  .then(() => console.log('SMTP OK - connection works'))
  .catch(e => console.error('SMTP FAIL:', e.message));
