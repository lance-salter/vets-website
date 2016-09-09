const _Environments = {
  staging: { BASE_URL: 'https://dev.vets.gov/api' },
  development: { BASE_URL: 'http://localhost:3000' },
};

function getEnvironment() {
  const platform = process.env.NODE_ENV;
  return _Environments[platform];
}

const environment = getEnvironment();
module.exports = environment;
