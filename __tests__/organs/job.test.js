const fs = require('fs');
const path = require('path');

const registerUser = require('../../organs/admins/registerUser').main;
const api = require('../../organs/job/api');
var job;

beforeAll( async () => {
  const username = (Math.random() * 420).toString();
  await registerUser(username);
  const wallet = fs.readFileSync(path.join(__dirname, `../../wallet/${username}.id`), {encoding: 'utf8'});
  user = { username, wallet: JSON.parse(wallet) };
});

it('Should create a job', async () => {
  job = await api.create({
    type: 'confirmation',
    data: {},
    chaincode: 'identity',
    key: 'identityKey',
    user,
  });

  expect(Array.isArray(job.workersIds)).toBeTruthy();
  expect(job.jobId).toBeDefined();
});


it('Should get a job', async () => {
  const getJob = await api.get({
    user,
    jobId: job.jobId,
  });

  console.log({getJob})
  expect(getJob.chaincode).toBe('identity');
  expect(getJob.creator).toBeDefined();
  expect(getJob.data).toBeDefined();
  expect(getJob.key).toBe('identityKey');
  expect(getJob.type).toBe('confirmation');
});

it('Should not get a job', async () => {
  var isError = false;
  const getJob = await api.get({
    user,
    jobId: 'wrongJobId',
  }).catch(e => isError = true);

  expect(isError).toBeTruthy();
});

it('Should list jobs', async () => {

});

it('Should complete a job', async () => {

});