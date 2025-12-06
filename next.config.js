/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.csv': {
          loaders: ['raw-loader'],
          as: '*.js'
        }
      }
    }
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      use: 'raw-loader'
    });
    return config;
  }
};

module.exports = nextConfig;
