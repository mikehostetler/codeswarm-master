<h1 class="page-title">
  <i class="fa fa-cog"></i>
  <a href="/#/projects" class="breadcrumb-link">Projects &raquo;</a>
  <!-- ko if: _id -->
<a class="breadcrumb-link breadcrumb-hide" data-bind="text: _id, attr: { 'href': _id }"></a>
  <!-- /ko -->
  <!-- ko ifnot: _id -->
<a class="breadcrumb-link breadcrumb-hide">New Project</a>
  <!-- /ko -->
  <span class="breadcrumb-active breadcrumb-hide">&raquo;&nbsp;Config</span>
  <!-- ko ifnot: newProject -->
  <a href="#/new-project" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
  <!-- /ko -->
</h1>

<div class="content-wrap">
  <div class="sidebar">
    <section class="sidebar-list-contain">
      <h3 class="sidebar-list-title">Config options</h3>

      <ul class="sidebar-list">
        <li class="sidebar-list--active">
          <a class="show-repo" data-link="repo"><strong>Repository</strong></a>
        </li>
        <!-- ko if: newProject -->
        <li>
          <a class="show-github" data-link="github"><strong>GitHub</strong></a>
        </li>
        <!-- /ko -->
      </ul>
    </section>
  </div>

  <section class="view view-repo">
    <form class="global-form project-config-form" id="project-config" data-bind="submit: trySaveProject">
      <div class="gf-col">

        <label>Repository</label>
        <input required="true" title="Enter the project repository" type="text" placeholder="ssh://git@github.com:organization/project.git" data-bind="value: repo">

        <label>Branch</label>
        <!-- ko if: availableBranches().length -->
        <select data-bind="options: availableBranches, value: branch"></select>
        <!-- /ko -->
        <!-- ko ifnot: availableBranches().length -->
        <input required="true" type="text" title="Enter the default branch" placeholder="Branch Name" data-bind="value: branch">
        <!-- /ko -->

        <label style="clear: both; display: inline">
          <input type="checkbox" name="public" class="checkbox" value="true" data-bind="checked: public">
          Public
        </label>

      <br>

      <!-- ko ifnot: newProject -->
      <button class="btn">Save</button>
      <button class="btn btn-sec" data-bind="text: deleteBtn, click: deleteProject">Delete</button>
      <!-- /ko -->
      <!-- ko if: newProject -->
    	<button class="btn">Create</button>
      <!-- /ko -->

      </div>

    </form>
  </section>

  <section class="view view-github" style="display: none;">
    <div class="gf-col">
      <!-- ko ifnot: token -->
      <p>You need to be logged in to github in order to add a project.</p>

      <br>

        <form method="post" action="/tokens/github">

            <button class="btn">Login to Github</button>

        </form>

      <!-- /ko -->

      <!-- ko if: token -->
      <label>Select Repo</label>
      <ul class="repo-list" data-bind="foreach: repos">
        <li>
          <a data-bind="attr: { 'data-url': url, 'data-branches-url': branches_url, 'data-default-branch': default_branch }, click: $root.selectRepo">
            <span data-bind="text: name"></span>
            <span class="repo-meta">
            <i class="fa fa-code-fork"></i><span data-bind="text: forks"></span>
            <i class="fa fa-star"></i><span data-bind="text: stars"></span>
            <i class="fa fa-eye"></i><span data-bind="text: watchers"></span>
            </span>
          </a>
        </li>
      </ul>
      <!-- /ko -->
    </div>

  </section>


</div>