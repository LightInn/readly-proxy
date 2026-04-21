import type {NextApiRequest, NextApiResponse} from 'next'
import {Readability} from "@mozilla/readability";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("/read called");

    const url = req.query.url
    // const url = c.req.query('url')
    console.log(url);


    if (!url) {
        res.status(503).json({error: 'URL param is required'})
        return;
    }

    const targetUrl = Array.isArray(url) ? url[0] : url;
    const html = await fetch(new URL(targetUrl)).then(response => response.text())

    // Load jsdom lazily in the API handler to avoid server startup/module interop issues.
    const {JSDOM} = await import('jsdom');


    const doc = new JSDOM(html, {
        url: targetUrl,
    });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();


// return json
    res.status(200).json(article)
}