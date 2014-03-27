module.exports = getCommitInfo;

function getCommitInfo(build, worker) {
  var cmd = worker.command('git', ['log', '--name-status', 'HEAD^..HEAD'], {silent: true});
  var out = '';
  cmd.stdout.setEncoding('utf8');
  cmd.stdout.on('data', function(d) {
    out += d;
  });
  cmd.once('close', closed);

  function closed(code) {
    if (code != 0) return worker.end();
    build.git = parseCommitInfo(out);
    worker.end();
  }
}

function parseCommitInfo(out) {
  var i = 0, line;
  var lines = out.split('\n').map(trim);

  var commit = parseCommit(lines[i++]);

  line = lines[i++];
  if (line.match(/Merge:/)) line = lines[i++];
  var author = parseAuthor(line);
  var date   = parseDate(lines[i++]);

  if (lines[i++]) throw new Error('Line ' + i +' of git log output should be empty');

  var message = '';
  while(lines[i]) {
    message += lines[i] + '\n';
    i ++;
  }

  message = message.slice(0, message.length - 1);

  return {
    commit: commit,
    author: author,
    date: date,
    message: message
  }

}

function parseCommit(line) {
  if (! line) return;
  var commit;
  var match = line.match(/commit (.+)/);
  if (match) commit = match[1];
  return commit;
}

function parseAuthor(line) {
  if (! line) return {};
  var name, email;
  var match = line.match(/Author: (.+)/);
  if (match) {
    name = match[1];
    if (name) {
      match = name.match(/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}/);
      if (match) email = match[0];
    }
  }
  return {
    name: name,
    email: email
  };
}

function parseDate(line) {
  if (! line) return;
  var date;
  var match = line.match(/Date: (.+)/);
  if (match) date = new Date(match[1]);
  return date;
}

/// Misc

function trim(s) {
  return s.trim();
}