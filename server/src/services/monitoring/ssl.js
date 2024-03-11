const https = require("https");

const checkSSL = async (url) => {
  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }

  if (!url.startsWith("https://")) {
    url = `https://${url}`;
  }
  console.log("Checking SSL for:", url);
  try {
    const response = await new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            reject(
              new Error(`Request failed with status code ${res.statusCode}`)
            );
            return;
          }
          resolve(res);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
    const certificate = response.socket.getPeerCertificate();
    const valid_to = new Date(certificate.valid_to).getTime();
    const now = new Date().getTime();
    const days = Math.floor((valid_to - now) / (1000 * 60 * 60 * 24));

    return {
      valid: days > 0 ? true : false,
      extra: {
        days,
        issuer: certificate.issuer,
        subject: certificate.subject,
        valid_from: certificate.valid_from,
        valid_to: certificate.valid_to,
      },
    };
  } catch (err) {
    return {
      valid: false,
      extra: {
        error: err.message,
      },
    };
  }
};

module.exports = checkSSL;
