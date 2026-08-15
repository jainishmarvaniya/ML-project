import http from 'http';
import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '../../backend');
const host = '127.0.0.1';
const port = 8000;
const backendUrl = `http://${host}:${port}/`;
const venvPythonPath = path.join(
  backendDir,
  '.venv',
  process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python'
);

function isBackendRunning() {
  return new Promise((resolve) => {
    const request = http.get(backendUrl, (response) => {
      response.resume();
      resolve(true);
    });

    request.setTimeout(1200, () => {
      request.destroy();
      resolve(false);
    });

    request.on('error', () => resolve(false));
  });
}

function findPythonCommand() {
  const configured = process.env.PYTHON || process.env.PYTHON_PATH;
  if (configured) return configured;
  if (process.platform === 'win32') return 'py';
  return 'python3';
}

function ensureBackendVirtualEnv() {
  if (fs.existsSync(venvPythonPath)) {
    return;
  }

  const pythonCommand = findPythonCommand();
  const venvArgs = process.platform === 'win32' ? ['-3', '-m', 'venv', '.venv'] : ['-m', 'venv', '.venv'];

  console.log(`Creating backend virtual environment with: ${pythonCommand} ${venvArgs.join(' ')}`);

  const result = spawnSync(pythonCommand, venvArgs, {
    cwd: backendDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    throw new Error(`Failed to create Python virtual environment. Exit code: ${result.status}`);
  }
}

function ensureBackendDependencies() {
  const requirementsPath = path.join(backendDir, 'requirements.txt');
  if (!fs.existsSync(requirementsPath)) {
    return;
  }

  const check = spawnSync(venvPythonPath, ['-c', 'import uvicorn, fastapi'], {
    cwd: backendDir,
    stdio: 'inherit',
  });

  if (check.status === 0) {
    return;
  }

  console.log('Installing backend Python dependencies...');
  const installResult = spawnSync(venvPythonPath, ['-m', 'pip', 'install', '-r', 'requirements.txt'], {
    cwd: backendDir,
    stdio: 'inherit',
  });

  if (installResult.status !== 0) {
    throw new Error(`Failed to install backend dependencies. Exit code: ${installResult.status}`);
  }
}

function startBackend() {
  const moduleEntry = fs.existsSync(path.join(backendDir, 'main.py')) ? 'main:app' : 'app.main:app';

  console.log(`Starting backend on ${backendUrl} with: ${venvPythonPath} -m uvicorn ${moduleEntry} --reload --host ${host} --port ${port}`);

  const child = spawn(venvPythonPath, ['-m', 'uvicorn', moduleEntry, '--reload', '--host', host, '--port', String(port)], {
    cwd: backendDir,
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Backend exited with code ${code}`);
    }
  });
}

async function main() {
  try {
    const running = await isBackendRunning();

    if (running) {
      console.log(`Backend already running at ${backendUrl}. Skipping startup.`);
      return;
    }

    ensureBackendVirtualEnv();
    ensureBackendDependencies();
    startBackend();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
