<h1 class="page-title">
	{{dir}}
</h1>

<div class="content-wrap">

  {{#if hook}}
  	<label>Deploy Hook URL (POST)</label>
  	<pre id="project-hook">{{hook}}</pre>
  {{/if}}

	{{#if key}}
  	<label>Server Deploy Key</label>
  	<pre>{{key}}</pre>
	{{/if}}

	<hr>

	<form id="project-config">

    <input name="_id" type="hidden" value="{{_id}}">
    <input name="_rev" type="hidden" value="{{_rev}}">

		<h4>Repository</h4>

    {{#if isOwner}}
		  <input id="project-repo" required="true" name="repo" type="text" title="Enter the clone URL" placeholder="git://github.com/username/project.git" value="{{repo}}">
    {{else}}
      <p>{{repo}}</p>
    {{/if}}

    <h4>Branch</h4>
    {{#if isOwner}}
      {{#if branch}}
      <input id="project-branch" required="true" name="branch" type="text" title="Enter the default branch" value="{{branch}}">
      {{else}}
      <input id="project-branch" name="branch" type="text" title="Default branch" placeholder="master" value="master">
      {{/if}}
    {{else}}
      <p>{{branch}}</p>
    {{/if}}

    <h4>Type</h4>
    {{#if isOwner}}
      <select name="type">
        {{#select type}}
          <option value="">Select one</option>
          <option value="node">Node.js</option>
          <option value="browser">Browser</option>
          <option value="custom">Custom</option>
        {{/select}}
      </select>
    {{else}}
      <p>{{type}}</p>
    {{/if}}



    {{#if isOwner}}
      <label style="clear: both; display: inline">
        <input type="checkbox" name="public" class="checkbox" {{#if public}}checked{{/if}}>
        Public
      </label>
    {{else}}
      <p>{{#if public}}Public{{else}}Private{{/if}}</p>
    {{/if}}



    {{#if isOwner}}
      {{#if _id}}
        <button class="btn-left">Save</button>
      {{else}}
      	<button class="btn-left">Create</button>
      {{/if}}
    {{/if}}

	</form>

  {{#if isOwner}}

    {{#if _id}}
      <p><button><a href="#/{{_id}}/plugins">Configure plugins</a></button></p>
    {{/if}}

  	<hr>

  	{{#if _id}}
  		<h4>Delete This Project</h4>

  		<p>Deleting the project will remove it, all logs, and the current build from the system.</p>

  		<button id="project-confirm-delete" class="hide btn-left">Confirm Delete</button>
  		<button id="project-cancel-delete" class="hide btn-right">Cancel</button>
  		<button id="project-delete">Delete Project</button>

  	{{/if}}

  {{/if}}


</div>
