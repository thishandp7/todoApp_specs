var chai = require('chai'),
  should = chai.should,
  expect = chai.expect,
  Promise = require('bluebird'),
  req = require('superagent-promise')(require('superagent'), Promise),
  chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

let url = process.env.URL || 'http://localhost:8000/todos';

describe('Cross Origin Requests', () => {
  var result;

  before(() => {
    result = req('OPTIONS', url)
      .set('Origin', 'http://someplace.com')
      .end();
  });

  it('should return the correct CORS headers', () => {
    return assert(result, 'header').to.contain.all.keys([
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
    ]);
  });

  it('should allow all origins', () => {
    return assert(result, 'header.access-control-allow-origin').to.equal('*');
  });
});

const post = (url, data) => {
  return req.post(url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
    .end();
};

const get = (url) => {
  return req.get(url)
    .set('Accept', 'application/json')
    .end();
};

const del = (url) => {
  return req.del(url).end();
};

const update = (url, method, data) => {
  return req(method, url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .send(data)
    .end();
};

const assert = (result, prop) => {
  return expect(result).to.eventually.have.deep.property(prop);
};
