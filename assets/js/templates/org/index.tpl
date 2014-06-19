<h1 class="page-title">
  <i class="fa fa-folder"></i>
  Projects
  <a href="#/new-project/" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
</h1>

<div class="content-wrap">
    <table class="datatable">
        <thead>
            <tr>
                <th width="115">Status</th>
                <th>Project</th>
                <th width="175">Last Build</th>
            </tr>
        </thead>

        <tbody>
        <tr ng-repeat="project in projects">
            <project data="project"></project>
        </tr>
        </tbody>


        <tbody>
        <tr>
        	<td class="center empty-projects" colspan="3">
        	  <em>No projects currently exist. <a href="#/new-project/">Create One &raquo;</a></em>
        	</td>
        </tr>
        </tbody>

        </tbody>
    </table>

    <div class="sidebar">
      <div class="sidebar-list-contain">
        <p>You need to be logged in to github in order to add a project.</p>
        <br>
          <form method="post" action="/tokens/github">
              <button class="btn">Login to Github</button>
          </form>

          <h3 class="sidebar-list-title">Filter</h3>
          <select id="org-filter">
          </select>

      </div>
      <br>
      <div class="sidebar-list-contain">
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
      </div>
    </div>
</div>
