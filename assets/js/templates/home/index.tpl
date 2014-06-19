<h1 class="page-title" data-bind="html:displayName"> </h1>

<div class="content-wrap">
	<h3>{{userdata.username| uppercase}}'s Home Page</h3>

    <span ng-show="loggedin">
        <h4>Projects</h4>

        <table class="datatable projects">
            <thead>
                <tr>
                    <th class="center" width="100">Status</th>
                    <th class="center" width="100">Build</th>
                    <th>Project</th>
                    <th class="center" width="100">Branch</th>
                    <th class="center" width="100">id</th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="project in projects">
                    <td class="center status-col" >{{project.status}}</td>
                    <td class="center run-col">{{project.build}}</td>
                    <td class="center run-col">{{project.reponame}}</td>
                    <td class="center logs-col">{{project.branch}}</td>
                    <td class="center logs-col">{{project.commitid}}</td>
                </tr>
            </tbody>
        </table>
 
    </span>

    <span ng-hide="loggedin">
        <h4> You're Logged Out. Log in to see your projects.</h4>
        <p>Welcome, thanks for sponsors, login form</p>
    </span>

    <div class="sidebar">
      <div class="sidebar-list-contain">
        <p>{{userdata.username| uppercase}} You need to be logged in to github in order to add a project.</p>

        <br>

          <form method="post" action="/tokens/github">

              <button class="btn">Login to Github</button>

          </form>

          <h3 class="sidebar-list-title">Filter <input ng-model="projectfilter"></h3>
      </div>
      <br>
      <div class="sidebar-list-contain">
        <h3 class="sidebar-list-title">Recent project builds</h3>

        <ul class="sidebar-list" ng-repeat="project in projects | filter:projectfilter">
          <sidebarlist data="project"></sidebarlist>
        </ul>

        <div class="sidebar-list-actions">
          <a href="#" class="btn btn-sml">View all</a>
        </div>
      </div>
    </div>
</div>
