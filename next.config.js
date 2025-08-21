module.exports = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "script-src-elem 'self' 'unsafe-inline' https://challenges.cloudflare.com https://reddimon.com https://track.reddimon.com https://us-assets.i.posthog.com https://cdnjs.cloudflare.com https://www.youtube.com https://youtube.com https://cdn.paddle.com https://paddle.com https://public.profitwell.com"
            }
          ]
        }
      ]
    }
  }