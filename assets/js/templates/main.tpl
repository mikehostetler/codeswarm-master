<h1 class="page-title"> </h1>

<div class="content-wrap">
    <h3>Codeswarm Home Page</h3>

    <span ng-hide="{{ loggedin }}">
        <h4>Projects</h4>

        <table class="datatable projects">
            <thead>
            <tr>
                <th class="center" width="75">Status</th>
                <th class="center" width="65">Build</th>
                <th>Project</th>
                <th class="center" width="60">Branch</th>
                <th class="center" width="60">id</th>
            </tr>
            </thead>
            <tbody data-bind="foreach: projects">
            <tr>
                <td class="center status-col" data-bind="text: state"></td>
                <td class="center run-col" data-bind="text: ended_at"></td>
                <td></td>
                <td class="center logs-col" data-bind="text: branch"></td>
                <td class="center logs-col" data-bind="text: id"></td>
            </tr>
            </tbody>
        </table>
 
    </span>

    <span ng-hide="{{ loggedin }}">
        <h4>You're Logged Out. Log in to see your projects.</h4>
        <p>Welcome, thanks for sponsors, login form</p>
    </span>

    <div class="sidebar">
        <div class="sidebar-list-contain">
            <p>You need to be logged in to github in order to add a project.</p>

            <br>

            <ng-form method="post" action="{{ url_prefix + '/tokens/github'}}">

                <button class="btn">Login to Github</button>

            </ng-form>

            <h3 class="sidebar-list-title">Filter</h3>
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
