const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

function buildEmail({ email, subject, body }) {
  return {
    from: process.env.EMAIL,
    to: process.env.NODE_ENV !== "development" ? email : process.env.TEST_EMAIL,
    subject: subject,
    html: body
  }
}

async function sendUserEmail({ username, email, token }) {
  const mailOptions = buildEmail({
    email,
    subject: 'Confirm Your Email',
    body: `<div>
             Hello ${username}!
             <br></br>
             <br></br>
             Before you can start recommending episodes and stacking sats we are going to do need
             to verify your email address:
             <br></br>
             <br></br>
             <a href="${process.env.CLIENT_DOMAIN}/confirm_email/${token}" >Verify Your Email Address</a>
             <br></br>
             <br></br>
             Best,
             <br></br>
             The Rekr Team
           </div>`
  });
  sendEmail(mailOptions);
}

async function sendPasswordEmail({ username, email, token }) {
  const mailOptions = buildEmail({
    email,
    subject: 'Reset your Password',
    body: `<div>
             Hello ${username}!
             <br></br>
             <br></br>
             Click the following link to update your password.
             <br></br>
             <br></br>
             <a href="${process.env.CLIENT_DOMAIN}/password-reset/${token}" >Update your Password</a>
             <br></br>
             <br></br>
             Best,
             <br></br>
             The Rekr Team
           </div>`
  });
  sendEmail(mailOptions);
}

async function sendPodcastEmail({ title, email, token, satoshis }) {
  const mailOptions = buildEmail({
    email,
    subject: 'Start Receiving Podcast Donations!',
    body: `<div>
             Hello ${title} Admin!
             <br></br>
             <br></br>
             ${satoshis > 0 ?
              `Verify your email address to start receiving donations and to claim an initial <strong>${satoshis.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0})} sats</strong> in donations!`
              : 'Before you can start receiving donations for your episodes we are going to do need to verify your email address:'}
             <br></br>
             <br></br>
             <a href="${process.env.CLIENT_DOMAIN}/confirm_email/${token}" >Verify Your Email Address</a>
             <br></br>
             <br></br>
             Best,
             <br></br>
             The Rekr Team
           </div>`
  });
  sendEmail(mailOptions);
}

function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { sendUserEmail, sendPodcastEmail, sendPasswordEmail };
