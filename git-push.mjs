import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';
import http from 'isomorphic-git/http/node/index.cjs';

const dir = process.cwd();
const repoUrl = 'https://github.com/charankumarare-cmd/student-management-system.git';
const commitMessage = 'Initial commit - Student Management System';
const token = process.env.GITHUB_TOKEN || process.argv[2];

async function main() {
  if (!token) {
    console.log('STATUS: READY_TO_PUSH');
    console.log('[Git Engine] Files staged and ready.');
    console.log('ERROR_TOKEN_REQUIRED: GitHub Personal Access Token (PAT) or credentials required to push.');
    process.exit(1);
  }

  console.log('[Git Engine] Initializing local repository...');
  await git.init({ fs, dir });

  console.log('[Git Engine] Staging all project files...');
  
  function getFiles(dirPath) {
    let results = [];
    const list = fs.readdirSync(dirPath);
    list.forEach(file => {
      if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'node' || file === '.env') return;
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else {
        const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');
        results.push(relPath);
      }
    });
    return results;
  }

  const files = getFiles(dir);
  for (const filepath of files) {
    await git.add({ fs, dir, filepath });
  }

  console.log(`[Git Engine] Creating commit: "${commitMessage}"...`);
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Charan Kumar',
      email: 'charankumarare@gmail.com',
    },
    message: commitMessage
  });
  console.log(`[Git Engine] Commit created with SHA: ${sha}`);

  console.log(`[Git Engine] Pushing to remote ${repoUrl}...`);
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    url: repoUrl,
    onAuth: () => ({ username: token }),
  });

  if (pushResult.ok) {
    console.log('SUCCESS: Project successfully pushed to GitHub!');
  } else {
    console.log('[Git Engine] Push Result:', pushResult);
  }
}

main().catch(err => {
  console.error('[Git Push Error]', err.message || err);
  process.exit(1);
});
