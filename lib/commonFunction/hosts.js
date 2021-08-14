const getShareUrl = () => {
  return 'https://stockisfun.vercel.app'
}

const getHost = () => {
  return `http://${process.env.VERCEL_URL}`
}

const getHostForETFDb = () => {
  return process.env.ETFDBENV
}

export { getShareUrl, getHost, getHostForETFDb }
