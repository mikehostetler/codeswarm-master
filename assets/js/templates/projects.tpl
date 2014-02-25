<h1 class="page-title">
  <i class="fa fa-folder"></i>
  Projects
  {{#unless restricted}}
  <a href="#/add-your-project" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
  {{/unless}}
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
        {{#each projects}}
        <tr>
            <td data-status="{{_id}}">
                {{#compare state "failed" operator="==="}}
                <a href="#/{{_id}}/" title="Build Failing">
                    <img src="../images/build-failing.png" alt="Build Failing">
                </a>
                {{/compare}}

                {{#compare state "passed" operator="==="}}
                <a href="#/{{_id}}/" title="Build Passing">
                    <img src="../images/build-passing.png" alt="Build Passing">
                </a>
                {{/compare}}

                {{#compare state "running" operator="==="}}
                <a href="#/{{_id}}/" title="Processing">
                    <img src="../images/build-pending.png" alt="Build Pending">
                </a>
                {{/compare}}

                {{#compare state undefined operator="==="}}
                <a title="No Builds"><i class="fa fa-circle"></i></a>
                {{/compare}}
            </td>

            <td>
                <a href="{{this.view}}">
            	{{#if this.view}}
                <h4 class="project">{{this._id}}</h4>
                {{/if}}
                <em class="repo">{{this.repo}}</em>
                </a>
            </td>

            <td>
                <a href="{{this.view}}">
                    <span class="last-build" data-timestamp="{{this._id}}">
                        <span class="last-build--title">Last build:</span>
                        {{#if this.ended_at}}
                          {{ended_at}}
                        {{else}}
                          Never
                        {{/if}}
                    </span>
                </a>
            </td>
        </tr>

        {{else}}
        <tr>
        	<td class="center empty-projects" colspan="5"><em>No projects currently exist. <a href="#/project/new">Create One &raquo;</a></em></td>
        </tr>
        {{/each}}
        </tbody>
    </table>

    <div class="sidebar">
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