module.exports = checkout;

function checkout(build, worker) {
  worker.command('mkdir', ['-p', build.dir], { cwd: ''});
  worker.end();
}