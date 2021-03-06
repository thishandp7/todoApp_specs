var chai = require('chai'),
  should = chai.should,
  expect = chai.expect,
  Promise = require('bluebird'),
  req = require('superagent-promise')(require('superagent'), Promise),
  chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

let url = process.env.URL || 'http://localhost:8000/todos';

describe('Cross Origin Requests', () => {
  let result;

  console.info('This is the URL: ', url);

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

describe('Create Todo Item', () => {
  let result;

  before(() => {
    result = post(url, { title: 'Wash Cloths' });
  });

  it('should return a 201 CREATED response', () => {
    return assert(result, 'status').to.equal(201);
  });

  it('should receive a location hyperlink', () => {
    return assert(result, 'header.location').to.match(/^https?:\/\/.+\/todos\/[\d]+$/);
  });

  it('should create the item', () => {
    let item = result.then((res) => {
      return get(res.header['location']);
    });

    return assert(item, 'body.title').that.equals('Wash Cloths');
  });

  after(() => {
    return del(url);
  });
});

describe('Update Todo Item', () => {
  let location;

  beforeEach((done) => {
    post(url, { title: 'Wash Cloths' }).then((res) => {
      location = res.header['location'];
      done();
    });
  });

  it('should have completed to true after PUT update', () => {
    let result = update(location, 'PUT', {'completed': true});
    return assert(result, 'body.completed').to.be.true;
  });

  it('should have completed to true after PATCH update', () => {
    let result = update(location, 'PATCH', {'completed': true});
    return assert(result, 'body.completed').to.be.true;
  });

  after(() => {
    return del(url);
  });
});

describe('Delete Todo Item', () => {
  let location;

  beforeEach((done) => {
    post(url, { title: 'Wash Cloths' }).then((res) => {
      location = res.header['location'];
      done();
    });
  });

  it('should return a 204 NO CONTENT response', () => {
    let result = del(location);
    return assert(result, 'status').to.equal(204);
  });

  it('should delete the item', () => {
    let result = del(location).then((res) => {
      return get(location);
    });
    return expect(result).to.eventually.be.rejectedWith('Not Found');
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
