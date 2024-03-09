const axios = require("axios");
const { URL } = require("url");

const checkHttpStatus = async (website) => {
  const { url } = website;

  try {
    new URL(url);
  } catch (error) {
    return {
      httpStatus: 400,
      uptime: false,
    };
  }

  try {
    const response = await axios.get(url);
    const { status } = response;

    return {
      httpStatus: status,
      uptime: status >= 200 && status < 400,
    };
  } catch (error) {
    if (error.response) {
      return {
        httpStatus: error.response.status,
        uptime: false,
      };
    } else if (error.request) {
      return {
        httpStatus: 503,
        uptime: false,
      };
    } else {
      return {
        httpStatus: 503,
        uptime: false,
      };
    }
  }
};

module.exports = checkHttpStatus;
