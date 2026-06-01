const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = __dirname;
const standaloneDir = path.join(projectDir, '.next', 'standalone');
const staticDir = path.join(projectDir, '.next', 'static');
const publicDir = path.join(projectDir, 'public');
const outputDir = path.join(projectDir, 'cpanel-deploy');

if (!fs.existsSync(standaloneDir)) {
  console.error('Error: .next/standalone does not exist. Run npm run build first.');
  process.exit(1);
}

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

fs.mkdirSync(outputDir, { recursive: true });

console.log('Copying standalone files...');
execSync(`xcopy "${standaloneDir}" "${outputDir}" /E /I /H /Y`, { stdio: 'inherit' });

console.log('Copying static files...');
const destStatic = path.join(outputDir, '.next', 'static');
fs.mkdirSync(destStatic, { recursive: true });
execSync(`xcopy "${staticDir}" "${destStatic}" /E /I /H /Y`, { stdio: 'inherit' });

console.log('Copying public files...');
const destPublic = path.join(outputDir, 'public');
fs.mkdirSync(destPublic, { recursive: true });
execSync(`xcopy "${publicDir}" "${destPublic}" /E /I /H /Y`, { stdio: 'inherit' });

console.log('Zipping the deployment package...');
const zipFile = path.join(projectDir, 'texasia-cpanel-ready.zip');
if (fs.existsSync(zipFile)) fs.rmSync(zipFile);

execSync(`powershell -command "Compress-Archive -Path '${outputDir}\\*' -DestinationPath '${zipFile}'"`, { stdio: 'inherit' });

console.log('Done! Prepared package: texasia-cpanel-ready.zip');
