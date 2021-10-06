const connectedClients = new Map();

exports.events = (req, res) => {
  if (connectedClients.has(req.session.id)) connectedClients.get(req.session.id).end();
  connectedClients.set(req.session.id, res);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.write(`:${(new Array(2049)).join(' ')}\n`);
  res.write('retry: 2000\n');
  res.flush();
};

export function sendMessage(data, event, sender) {
  connectedClients.forEach((res, sessionId) => {
    if (sessionId === sender) return;
    res.write(`id: ${Date.now()}\n`);
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    res.flush();
  });
}
