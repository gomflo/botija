const Feed = require('rss-to-json')
const url = 'https://www.elnorte.com/rss/portada.xml'

export default async (req, res) => {

  const { items } = await Feed.load(url)

  const summary = items.map(item => item = item.title)

  res.status(200).json({
    status: 'ok',
    data: items,
    summary: summary.join('\n\r')
  })
}
