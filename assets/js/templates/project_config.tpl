<h1 class="page-title">
  <i class="fa fa-cog"></i>
  <a href="/#/projects" class="breadcrumb-link">Projects</a>
  <a href="/#/projects/{{_id}}" class="breadcrumb-link breadcrumb-hide">codeswarm/codeswarm</a>
  <span class="breadcrumb-active breadcrumb-hide">Config</span>
  {{#unless restricted}}
  <a href="#/project/new" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
  {{/unless}}
</h1>

<div class="content-wrap">
  <form class="global-form" id="project-config">
    <div class="gf-col">
      <label>Repository</label>
      <input id="project-repo" required="true" name="repo" type="text" title="Enter the clone URL" placeholder="git://github.com/username/project.git" value="{{repo}}">

      <label>Label</label>
      <input type="text" placeholder="Text input">

      <label>Label</label>
      <input type="text" placeholder="Text input">

      <label>Label</label>
      <input type="text" placeholder="Text input">
    </div>

    <div class="gf-col">
      <label>Branch</label>
      <input id="project-branch" required="true" name="branch" type="text" title="Enter the default branch" value="{{branch}}">

      <label>Label</label>
      <input type="text" placeholder="Text input">

      <label>Label</label>
      <input type="text" placeholder="Text input">

      <label>Label</label>
      <input type="text" placeholder="Text input">
    </div>
  </form>
</div>

<!-- <div class="content-wrap">

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

		<input id="project-repo" required="true" name="repo" type="text" title="Enter the clone URL" placeholder="git://github.com/username/project.git" value="{{repo}}">

    <h4>Branch</h4>
    {{#if branch}}
    <input id="project-branch" required="true" name="branch" type="text" title="Enter the default branch" value="{{branch}}">
    {{else}}
    <input id="project-branch" name="branch" type="text" title="Default branch" placeholder="master" value="master">
    {{/if}}

    <label style="clear: both; display: inline">
      <input type="checkbox" name="public" class="checkbox" {{#if public}}checked{{/if}}>
      Public
    </label>


    {{#if _id}}
      <button class="btn-left">Save</button>
    {{else}}
    	<button class="btn-left">Create</button>
    {{/if}}

	</form>

	<hr>

	{{#if _id}}
		<h4>Delete This Project</h4>

		<p>Deleting the project will remove it, all logs, and the current build from the system.</p>

		<button id="project-confirm-delete" class="hide btn-left">Confirm Delete</button>
		<button id="project-cancel-delete" class="hide btn-right">Cancel</button>
		<button id="project-delete">Delete Project</button>

	{{/if}}


</div> -->