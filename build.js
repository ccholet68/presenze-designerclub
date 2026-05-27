const fs = require('fs');

// Leggi il JSX
const jsx = fs.readFileSync('presenze-clean.jsx', 'utf8');

// Crea cartella dist
if (!fs.existsSync('dist')) fs.mkdirSync('dist');

// Copia funzioni netlify
if (fs.existsSync('netlify')) {
  fs.cpSync('netlify', 'dist/netlify', { recursive: true });
}

// Compila JSX con Babel
const babel = require('@babel/core');
const result = babel.transformSync(jsx, {
  presets: ['@babel/preset-react'],
  filename: 'presenze-clean.jsx'
});

fs.writeFileSync('dist/presenze-compiled.js', result.code);

// Crea index.html che usa il file compilato
const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
  <title>Presenze — Designer Club Srl</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
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
  <script src="presenze-compiled.js"></script>
  <script>
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
  </script>
</body>
</html>`;

fs.writeFileSync('dist/index.html', html);
console.log('Build OK - ' + Math.round(html.length/1024) + 'KB');
