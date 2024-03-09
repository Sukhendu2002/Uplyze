const sslChecker = require("ssl-checker");

const checkSSL = async (website) => {
  const { url } = website;
  try {
    const ssl = await sslChecker(url, {
      method: "GET",
    });
    console.log("SSL check", ssl);
    return {
      valid: ssl.valid,
      expires: ssl.valid ? new Date(ssl.valid_to) : null,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      valid: false,
      expires: null,
    };
  }
};

module.exports = checkSSL;
