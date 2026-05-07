const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    let statusColor;
    if (statusCode >= 500) statusColor = '\x1b[31m';
    else if (statusCode >= 400) statusColor = '\x1b[33m';
    else if (statusCode >= 300) statusColor = '\x1b[36m';
    else if (statusCode >= 200) statusColor = '\x1b[32m';
    else statusColor = '\x1b[37m';

    let methodColor;
    switch (method) {
      case 'GET': methodColor = '\x1b[32m'; break;
      case 'POST': methodColor = '\x1b[33m'; break;
      case 'PUT': methodColor = '\x1b[36m'; break;
      case 'PATCH': methodColor = '\x1b[35m'; break;
      case 'DELETE': methodColor = '\x1b[31m'; break;
      default: methodColor = '\x1b[37m';
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    console.log(
      `\x1b[2m${timestamp}\x1b[0m ` +
      `${methodColor}${method.padEnd(7)}\x1b[0m ` +
      `${statusColor}${statusCode}\x1b[0m ` +
      `\x1b[37m${duration.toString().padStart(4)}ms\x1b[0m ` +
      `\x1b[2m${originalUrl}\x1b[0m ` +
      `\x1b[90m${ip}\x1b[0m`
    );
  });

  next();
};

export default loggerMiddleware;