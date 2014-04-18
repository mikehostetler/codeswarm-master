<h1 class="page-title">
  Plugins for {{project._id}}
</h1>

<div class="content-wrap">
  <form>
  {{#each plugins}}
    <h2>{{name}}</h2>

    {{#each attributes}}
      <h4>{{label}}:</h4>

      {{#compare type "string" operator="==="}}
        <input type="text" name="{{../../name}}/{{name}}" value="{{value}}" {{#if required}}required{{/if}}>
      {{/compare}}

      {{#compare type "checkbox" operator="==="}}
        <input type="checkbox" name="{{../../name}}/{{name}}" {{#compare value "on" operator="==="}}checked{{/compare}}>
      {{/compare}}

      {{#compare type "text" operator="==="}}
        <textarea name="{{../../name}}/{{name}}" {{#if required}}required{{/if}}>{{value}}</textarea>
      {{/compare}}

      {{#compare type "selectOne" operator="==="}}
        <div>
          <select name="{{../../name}}/{{name}}" {{#if required}}required{{/if}}>
            {{#each from}}
              <option value="{{value}}" {{#if selected}}selected{{/if}}>{{value}}</option>
            {{/each}}
          </select>
        </div>
      {{/compare}}

      {{#compare type "selectMultiple" operator="==="}}
        <ul>
        {{#each from}}
          <li><label style="margin-left: 1em"><input type="checkbox" name="{{../../../name}}/{{../../name}}" value="{{value}}" style="width:auto; display:inline; margin-right: 1em" {{#if selected}}checked{{/if}}>{{value}}</label></li>
        {{/each}}
        </ul>
      {{/compare}}



    {{/each}}

    <hr />
  {{/each}}
    <button class="btn-left">Save</button>
  </form>
</div>