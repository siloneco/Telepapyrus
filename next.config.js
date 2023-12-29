const remotePattern = {
  protocol: 'https',
  hostname: process.env.REMOTE_ASSETS_ALLOWED_HOSTNAME,
  port: '',
  pathname: '/**',
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Rehype Pretty Code to work.
  // See: https://github.com/atomiks/rehype-pretty-code/issues/128 and https://github.com/siloneco/Telepapyrus/pull/192
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    })
    return config
  },
  output: 'standalone',
  images: {
    remotePatterns: remotePattern.hostname ? [remotePattern] : [],
  },
}

module.exports = nextConfig
