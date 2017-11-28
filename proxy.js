const url = require('url');
const fs = require('fs');

const domains = [
  'asos.com',
];

const isDomainMatch = (hostname) => {
  let isMatch = false;
  domains.forEach((domain) => {
    isMatch = (domain.indexOf(hostname) > -1) ? true : isMatch;
  });
  return isMatch;
};

const isHtmlRequest = requestHeaders =>
  requestHeaders.Accept && requestHeaders.Accept.indexOf('text/html') > -1;


const isValidResponse = response =>
  response.statusCode === 200 || response.statusCode === 304;

const getMarkup = folder =>
  fs.readFileSync(`./dist/${folder}/offer.html`, 'utf-8');

// AnyProxy rule config
module.exports = {
  summary: 'Inject MVT offer code',
  * beforeSendResponse(requestDetail, responseDetail) {
    const { hostname, headers, path } = requestDetail.requestOptions;
    const { response } = responseDetail;
    const { query } = url.parse(path, true);

    if (
      isDomainMatch(hostname) &&
      isHtmlRequest(headers) &&
      isValidResponse(response) &&
      query.mvt !== undefined
    ) {
      // eslint-disable-next-line no-console
      console.log('REQUEST to a targeted domain detected');
      // eslint-disable-next-line no-console
      console.log('VARIANT DETECTED', query.mvt);

      const markup = getMarkup(query.mvt);

      return {
        response: Object.assign({}, response, {
          body: response.body.toString().replace(
            '</body>',
            `${markup}\n</body>`,
          ),
        }),
      };
    }

    return {
      response,
    };
  },
};
