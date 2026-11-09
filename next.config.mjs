/** @type {import('next').NextConfig} */
const nextConfig = {
  // Blog HTML and metadata are read locally during static generation.
  outputFileTracingIncludes: {
    '/blog/**': ['./content/blog/**/*'],
  },
}

export default nextConfig
