const whois = require("whois");
const url = require("url");

const parseWhoisData = (rawWhoisData) => {
  const lines = rawWhoisData.split("\n");
  const usefulInfo = lines
    .map((line) => {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        return { [key.trim()]: value.trim() };
      }
    })
    .filter((info) => info);

  return usefulInfo;
};

const getDomainInfo = async (inputUrl) => {
  console.log(inputUrl);
  const parsedUrl = new URL(inputUrl);
  console.log(parsedUrl);
  let domain = parsedUrl.hostname;

  domain = domain.replace("www.", "");

  if (!domain.includes("edu") && !domain.includes("gov")) {
    if (domain.split(".").length > 2) {
      domain = domain.split(".").slice(-2).join(".");
    }
  }

  try {
    const data = await new Promise((resolve, reject) => {
      whois.lookup(domain, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const usefulInfo = parseWhoisData(data);
    return {
      valid: true,
      extra: usefulInfo.reduce((acc, cur) => {
        acc = { ...acc, ...cur };
        return acc;
      }, {}),
    };
  } catch (error) {
    return {
      valid: false,
      error: {
        message: error.message,
        stack: error.stack,
      },
    };
  }
};

module.exports = {
  getDomainInfo,
  parseWhoisData,
};
