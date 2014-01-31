module.exports = checkout;

function checkout(build, worker) {
  worker.command('git', ['checkout', build.project.repo]);
}