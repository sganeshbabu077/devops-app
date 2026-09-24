const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.end(`
        <h1>AWS DevOps Project</h1>
        <p>Application running inside Docker</p>
        <p>Environment: Development</p>
    `);
});

server.listen(3000, () => {
    console.log('Application running on port 3000');
});
