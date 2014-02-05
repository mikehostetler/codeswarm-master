module.exports = uuid;

function uuid() {
  return (~~(Math.random() * 1e9)).toString(36) + Date.now().toString(36);
}
