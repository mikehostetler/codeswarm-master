module.exports = purge;

function purge(build, worker) {
  worker.command('rm', ['-rf', build.dir], {cwd: build.dir + '/..'});
  worker.end();
}