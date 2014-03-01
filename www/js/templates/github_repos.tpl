<h1 class="page-title">
    Github Repos
</h1>

<div class="content-wrap">

  {{#if user.isAdmin}}<button class="direct-add">I want to setup a repo that is not mine</button>{{/if}}

  <ul class="repos">
    {{#each repos}}
      <li class="remote-repo">
        {{github.full_name}}
        {{#if userHasRepo}}
          <button class="remove-repo" data-target="{{userRepo._id}}">Remove</button>
        {{else}}
          <button class="add-repo" data-target="{{github.git_url}}">Add</button>
        {{/if}}
      </li>
    {{/each}}
  </ul>

</div>