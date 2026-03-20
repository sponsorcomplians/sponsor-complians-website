import { spawn } from 'child_process';

const child = spawn('npx', ['drizzle-kit', 'generate'], {
  cwd: '/home/ubuntu/sponsor-complians',
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env }
});

let output = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);
  
  // When we see a prompt with ❯ (selection prompt), send Enter to accept default
  if (text.includes('❯') || text.includes('create column') || text.includes('rename column')) {
    setTimeout(() => {
      child.stdin.write('\n');
    }, 100);
  }
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stderr.write(text);
  
  if (text.includes('❯') || text.includes('create column') || text.includes('rename column')) {
    setTimeout(() => {
      child.stdin.write('\n');
    }, 100);
  }
});

child.on('close', (code) => {
  console.log(`\n\nProcess exited with code ${code}`);
});

// Safety timeout after 120 seconds
setTimeout(() => {
  console.log('\nTimeout reached, killing process');
  child.kill();
}, 120000);
