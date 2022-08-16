import ogs from 'open-graph-scraper';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { url } = req.query
    const options = { url: url as string };
    ogs(options, (error, results, response) => {
      if (error) {
        return res.status(200).json({ error })
      }
      if (results) {
        return res.status(200).json({ results })
      }
      if (response) {
        return res.status(200).json({ response })
      }
    });
  }
}