<h1 class="page-title">
    Github Repos
</h1>

<div class="content-wrap">

  <ul class="repos">
    {{#each repos}}
      <li class="remote-repo">
        {{github.full_name}}
        {{#if userHasRepo}}
          <button class="remove-repo" data-target="{{userRepo.repo}}">Remove</button>
        {{else}}
          <button class="add-repo" data-target="{{userRepo.repo}}">Add</button>
        {{/if}}
      </li>
    {{/each}}
  </ul>

</div>