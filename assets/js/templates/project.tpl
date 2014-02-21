<h1 class="page-title">
  <i class="fa fa-folder"></i>
  <a href="/#/projects" class="breadcrumb-link">Projects</a>
  <span class="breadcrumb-active breadcrumb-hide">{{_id}}</span>
  {{#unless restricted}}
  <a href="#/project/new" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
  {{/unless}}
</h1>

<div class="content-wrap">
  <h1 class="project-title">{{_id}} 
    <span class="project-title--status">
      <img src="../images/build-failing.png" alt="Build Failing">
    </span>

    <a href="#" class="btn btn-sec"><i class="fa fa-cog"></i>Settings</a>
  </h1>

  <ul class="tabs-horiz">
    <li class="builds-tab"><a href="#/{{_id}}/builds"><i class="fa fa-repeat"></i>Builds</a></li>
    <li class="pull-requests-tab"><a href="#/{{_id}}/pull-requests"><i class="fa fa-exchange"></i>Pull Requests</a></li>
    <li class="branches-tab"><a href="#/{{_id}}/branches"><i class="fa fa-code-fork"></i>Branches</a></li>
  </ul>

  <div id="project-contain">
   
  </div>

  <div class="sidebar">
    <section class="sidebar-glance-contain">
      <h3 class="sidebar-glance-title">At a Glance</h3>
      <p class="sidebar-glance"><span><strong>6</strong> authors</span> have pushed <span><strong>66</strong> commits</span> to all branches, excluding merges. On master, <span><strong>70</strong> files</span> have changed and there have been <span><strong>50,134</strong> additions</span> and <span><strong>729</strong> deletions</span>.</p>
    </section>

    <section class="sidebar-list-contain">
      <h3 class="sidebar-list-title">Recent project builds</h3>

      <ul class="sidebar-list">
        <li><a href="#">
          <strong>jQuery/jQuery</strong> - <time>Feb 11, 2014</time>
          <span>Commit d792e40 by rwaldron</span>
        </a></li>
        <li><a href="#">
          <strong>guardian/frontend</strong> - <time>Feb 10, 2014</time>
          <span>Commit d792e40 by trevanhetzel</span>
        </a></li>
        <li><a href="#">
          <strong>jQuery/jQuery</strong> - <time>Feb 11, 2014</time>
          <span>Commit d792e40 by rwaldron</span>
        </a></li>
        <li><a href="#">
          <strong>guardian/frontend</strong> - <time>Feb 10, 2014</time>
          <span>Commit d792e40 by trevanhetzel</span>
        </a></li>
        <li><a href="#">
          <strong>jQuery/jQuery</strong> - <time>Feb 11, 2014</time>
          <span>Commit d792e40 by rwaldron</span>
        </a></li>
      </ul>

      <div class="sidebar-list-actions">
        <a href="#" class="btn btn-sml">View all</a>
      </div>
    </section>
  </div>
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


</div>
 -->