<h1 class="page-title">
  <i class="fa fa-folder"></i>
  <a href="/#/projects" class="breadcrumb-link">Projects</a>
  <span class="breadcrumb-active">{{_id}}</span>
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
    <li class="current-tab"><a href="#"><i class="fa fa-repeat"></i>Builds</a></li>
    <li><a href="#/pull-requests"><i class="fa fa-exchange"></i>Pull Requests</a></li>
    <li><a href="#/branches"><i class="fa fa-code-fork"></i>Branches</a></li>
    <li><a href="#/tags"><i class="fa fa-tags"></i>Tags</a></li>
  </ul>

  <table class="datatable">
    <thead>
      <tr>
        <th width="115">Status</th>
        <th width="250">Message</th>
        <th>Commit</th>
        <th>Committer</th>
        <th width="175">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr data-build={{_id}}>
        <td>
          <a href="/#/codeswarm/codeswarm/builds/f5hs7mhruuqnrf" title="Build Failing">
              <img src="../images/build-failing.png" alt="Build Failing">
          </a>
        </td>
        <td><a href="/#/codeswarm/codeswarm/builds/f5hs7mhruuqnrf"><span class="project">fixed the underscore dep</span></a></td>
        <td><a href="/#/codeswarm/codeswarm/builds/f5hs7mhruuqnrf"><span class="project">f5hs7mhruuqnrf</span></a></td>
        <td><a href="/#/codeswarm/codeswarm/builds/f5hs7mhruuqnrf"><span class="project">pgte</span></a></td>
        <td>
          <a href="/#/codeswarm/codeswarm/builds/f5hs7mhruuqnrf">
            <span class="last-build" data-timestamp="{{this._id}}">
              <span class="last-build--title">Last build:</span>
              2/20/2014 at 8:05am
            </span>
          </a>
        </td>
      </tr>
    </tbody>
  </table>

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