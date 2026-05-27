const fs = require('fs');
const path = require('path');

// Leggi il JSX
const jsx = fs.readFileSync('presenze-clean.jsx', 'utf8');

// Crea cartella dist
if (!fs.existsSync('dist')) fs.mkdirSync('dist');

// Copia funzioni netlify
if (fs.existsSync('netlify')) {
  fs.cpSync('netlify', 'dist/netlify', { recursive: true });
}

// Crea index.html con Babel standalone
const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
  <title>Presenze — Designer Club Srl</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.23.10/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>const { useState, useEffect, useRef } = React;</script>
  <script type="text/babel" data-presets="react">
${jsx.replace(/<\/script>/g, '<\\/script>')}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
  </script>
</body>
</html>`;

fs.writeFileSync('dist/index.html', html);
console.log('Build OK - ' + Math.round(html.length/1024) + 'KB');
