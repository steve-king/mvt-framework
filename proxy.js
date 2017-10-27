const domains = [
  'steveking.info'
]

module.exports = {
  summary: 'a rule to modify response',
  *beforeSendResponse(requestDetail, responseDetail) {

    const { hostname, headers } = requestDetail.requestOptions;
    const { statusCode } = responseDetail.response;
    
    if (
      hostname.indexOf(domains[0]) > -1 && // TODO: check each item in domains array
      headers.Accept && headers.Accept.indexOf('text/html') > -1 && 
      statusCode === 200
    ) {
      console.log('REQUEST to a targeted domain detected');
    
      const responseBody = responseDetail.response.body.toString();
      const newResponse = Object.assign({}, responseDetail.response);
      newResponse.body = responseBody.replace('</body>', '<h1>Hello from Any Proxy!</h1></body>');
      
      return {
        response: newResponse
      };
    }
  }
};
