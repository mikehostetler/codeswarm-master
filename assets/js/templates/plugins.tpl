<h1 class="page-title">
  Plugins for {{project._id}}
</h1>

<div class="content-wrap">
  <form>
  {{#each plugins}}
    <h2>{{name}}</h2>

    {{#each attributes}}
      <h4>{{label}}:</h4>
      <input type="text" name="{{../name}}/{{name}}" value="{{value}}" {{#if required}}required{{/if}}>
    {{/each}}

    <hr />
  {{/each}}
    <button class="btn-left">Save</button>
  </form>
</div>