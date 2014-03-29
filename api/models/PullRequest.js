module.exports = {

  tableName: 'pull_requests',

  attributes: {

    project: {
      type: 'string',
      required: true
    },

    github_data: 'json'

  }
};
