const url = require('url');
const fs = require('fs');
const pth = require('path');

const domains = [
  'www.asos.com',
  'm.asos.com',
  'my.asos.com',
  'secure.asos.com',
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
  fs.readFileSync(pth.resolve(process.cwd(), `dist/${folder}/offer.html`), 'utf-8');

// AnyProxy rule config
module.exports = {
  summary: 'Inject MVT offer code',
  * beforeDealHttpsRequest(req) {
    // Don't attempt to decrypt unless the domain matches
    const hostname = req.host.replace(':443', '');
    if (isDomainMatch(hostname)) {
      return true;
    }
    return false;
  },
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
      const bodyString = response.body.toString();

      return {
        response: Object.assign({}, response, {
          body: bodyString.replace('</body>', `${markup}\n</body>`),
        }),
      };
    }

    return {
      response,
    };
  },
};
