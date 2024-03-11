const whois = require("whois");
const url = require("url");

const getDomainInfo = async (website) => {
  const { url } = website;

  const parsedUrl = url.parse(inputUrl);
  let domain = parsedUrl.hostname;

  // Remove subdomains
  const subdomains = domain.split(".").slice(0, -2); // Remove the last two elements
  if (subdomains.length > 0) {
    domain = subdomains.join(".");
  }

  console.log(domain);
  try {
    await whois.lookup(
      domain,
      {
        server: "whois.verisign-grs.com",
        follow: 2,
        verbose: true,
      },
      (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(data);
      }
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = getDomainInfo;
