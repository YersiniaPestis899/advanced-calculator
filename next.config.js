/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['three', 'plotly.js', 'algebrite'],
  },
  transpilePackages: ['react-plotly.js'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        stream: false,
        crypto: false,
        buffer: false,
        util: false
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;
