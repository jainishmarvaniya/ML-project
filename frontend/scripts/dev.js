import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');
const backendDir = path.resolve(__dirname, '../../backend');
const host = '127.0.0.1';
const port = 8000;
const backendUrl = `http://${host}:${port}/`;
const venvPythonPath = path.join(backendDir, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');

function waitForBackend() {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const tryCheck = () => {
      const req = http.get(backendUrl, (res) => {
        res.resume();
        resolve();
      });

      req.on('error', () => {
        if (Date.now() - startedAt > 60000) {
          reject(new Error(`Backend did not become ready at ${backendUrl} within 60 seconds.`));
          return;
        }
        setTimeout(tryCheck, 1000);
      });

      req.setTimeout(1500, () => {
        req.destroy();
        if (Date.now() - startedAt > 60000) {
          reject(new Error(`Backend did not become ready at ${backendUrl} within 60 seconds.`));
          return;
        }
        setTimeout(tryCheck, 1000);
      });
    };

    tryCheck();
  });
}

function ensureBackendRunning() {
  return new Promise((resolve) => {
    const req = http.get(backendUrl, (res) => {
      res.resume();
      console.log(`Backend already running at ${backendUrl}. Skipping startup.`);
      resolve();
    });

    req.on('error', () => {
      const moduleEntry = fs.existsSync(path.join(backendDir, 'main.py')) ? 'main:app' : 'app.main:app';
      const child = spawn(venvPythonPath, ['-m', 'uvicorn', moduleEntry, '--reload', '--host', host, '--port', String(port)], {
        cwd: backendDir,
        stdio: 'inherit',
      });

      child.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Backend exited with code ${code}`);
          process.exit(code ?? 1);
        }
      });

      waitForBackend()
        .then(() => resolve())
        .catch((error) => {
          console.error(error.message);
          process.exit(1);
        });
    });
  });
}

async function main() {
  await ensureBackendRunning();

  console.log('Starting frontend...');

  const vite = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite', '--host', '127.0.0.1', '--port', '5173', '--open'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  vite.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

main();
