import chai from 'chai';
import{ should, expect } from 'chai';
import Promise from 'bluebird';
import request from 'superagent-promise';
import superagent from 'superagent';

const req = request(superagent, Promise);

import chaiAsPromised from 'chai-as-promised';

let url = process.env.URL || 'http://localhost:8000/todo';

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
