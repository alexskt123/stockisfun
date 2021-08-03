const list = [5, 20, 60]

export default async (req, res) => {
  const { ticker = null } = req.query

  const result = await getPriceMA(ticker)

  res.statusCode = 200
  res.json(result)
}

export const getPriceMA = ticker => {
  const compareKeys = list.reduce((acc, cur) => {
    const others = list.filter(x => x !== cur)

    others.forEach(x => {
      const key = cur < x ? `${cur}<${x}` : `${x}>${cur}`
      acc[key] = 'Yes'
    })

    return acc
  }, {})

  // console.log({ compareKeys })
  return {
    ticker,
    ...compareKeys
  }
}
