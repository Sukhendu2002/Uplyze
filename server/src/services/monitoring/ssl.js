const https = require("https");

const checkSSL = async (url) => {
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

    const sslData = {
      validFrom: response.socket.getPeerCertificate().valid_from,
      validTo: response.socket.getPeerCertificate().valid_to,
      issuer: response.socket.getPeerCertificate().issuer,
    };

    return sslData;
  } catch (err) {
    console.error("Error occurred during SSL check:", err);
    return { error: "SSL check failed" };
  }
};

module.exports = checkSSL;
