const RENDER_API_BASE = 'https://expert-session-booking-system-1.onrender.com';

const buildUrl = (pathname, search) => {
  const cleanPath = pathname.replace(/^\/api\/?/, '');
  return `${RENDER_API_BASE}/${cleanPath}${search || ''}`;
};

const getHeaders = (reqHeaders) => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(reqHeaders)) {
    const lower = key.toLowerCase();

    if (
      lower === 'host' ||
      lower === 'content-length' ||
      lower === 'connection' ||
      lower === 'accept-encoding' ||
      lower === 'x-forwarded-host' ||
      lower === 'x-forwarded-port' ||
      lower === 'x-forwarded-proto'
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      headers.set(key, value.join(','));
    } else if (typeof value === 'string') {
      headers.set(key, value);
    }
  }

  return headers;
};

export default async function handler(req, res) {
  const parsedUrl = new URL(req.url, 'http://localhost');
  const targetUrl = buildUrl(parsedUrl.pathname, parsedUrl.search);
  const body =
    typeof req.body === 'string' || req.body instanceof Buffer ? req.body : req.body ? JSON.stringify(req.body) : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: getHeaders(req.headers),
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
      redirect: 'follow'
    });

    const contentType = response.headers.get('content-type');
    res.status(response.status);

    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const text = await response.text();
    res.send(text);
  } catch (error) {
    res.status(500).json({ message: 'Proxy request failed', error: error.message });
  }
}
