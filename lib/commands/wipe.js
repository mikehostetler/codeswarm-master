module.exports = wipe;

function wipe(build, worker) {
  worker.command('rm', ['-rf', build.dir], { cwd: ''});
  worker.end();
}