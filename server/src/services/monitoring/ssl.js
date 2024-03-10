const https = require("https");
const http = require("http");

const checkSSL = async (website) => {
  const { url } = website;
  try {
    const protocol = url.startsWith("https://") ? https : http;

    return new Promise((resolve, reject) => {
      const req = protocol.get(url, (res) => {
        const isSSL = res.socket.encrypted;
        resolve(isSSL);
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.end();
    });
  } catch (err) {
    throw err;
  }
};

module.exports = checkSSL;
