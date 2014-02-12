module.exports = checkout;

function checkout(build, worker) {
  console.log('build:', build);
  worker.command('mkdir', ['-p', build.dir], { cwd: ''});
  worker.end();
}