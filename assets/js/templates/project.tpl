<h1 class="page-title">
	{{dir}}
</h1>

<div class="content-wrap">

	<label>Deploy Hook URL (POST)</label>
	<pre id="project-hook">{{hook}}</pre>

	{{#if key}}
	<label>Server Deploy Key</label>
	<pre>{{key}}</pre>
	{{/if}}

	<hr>

	<form id="project-config">

		<h4>Repository</h4>

		<input name="_id" type="hidden" value="{{_id}}">

		{{#if repo}}
		<p>{{repo}}</p>
		{{else}}
		<input id="project-repo" required="true" name="repo" type="text" title="Enter the clone URL" placeholder="git://github.com/username/project.git">
		{{/if}}

    <h4>Branch</h4>
    {{#if branch}}
    <input id="project-branch" required="true" name="branch" type="text" title="Enter the default branch" value="{{branch}}">
    {{else}}
    <input id="project-branch" name="branch" type="text" title="Default branch" placeholder="master" value="master">
    {{/if}}

    {{#unless _id}}
    	<button class="btn-left">Create</button>
    {{/unless}}

	</form>

	<hr>

	{{#if _id}}
		<h4>Delete This Project</h4>

		<p>Deleting the project will remove it, all logs, and the current build from the system.</p>

		<button id="project-confirm-delete" class="hide btn-left">Confirm Delete</button>
		<button id="project-cancel-delete" class="hide btn-right">Cancel</button>
		<button id="project-delete">Delete Project</button>

	{{/if}}


</div>
