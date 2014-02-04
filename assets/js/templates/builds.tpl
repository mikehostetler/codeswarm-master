<h1 class="page-title">
    <i class="fa fa-th-list"></i>
    Builds for <a href="#/{{project}}">{{project}}</a>
</h1>

<div class="content-wrap">
    <table class="datatable">
        <thead>
            <tr>
                <th width="75">Status</th>
                <th>Timestamp</th>
                <th width="70">Open</th>
            </tr>
        </thead>
        <tbody>
        {{#each builds}}
        <tr>
            <td class="center status-col">
                {{#compare status "fail" operator="==="}}
                <a href="#/logs/{{value.project}}/{{key}}" title="Build Failed"><i class="fa fa-circle red"></i></a>
                {{/compare}}

                {{#compare status "pass" operator="==="}}
                <a href="#/logs/{{value.project}}/{{key}}" title="Build Passed"><i class="fa fa-circle green"></i></a>
                {{/compare}}
            </td>
            <td class="logs">
                {{date}}

                <ul class="table-actions">
                    <li>
                        {{#compare status "fail" operator="==="}}
                        <a href="#/logs/{{value.project}}/{{key}}" title="Build Failed"><i class="fa fa-circle red"></i></a>
                        {{/compare}}

                        {{#compare status "pass" operator="==="}}
                        <a href="#/logs/{{value.project}}/{{key}}" title="Build Passed"><i class="fa fa-circle green"></i></a>
                        {{/compare}}
                    </li>
                    <li>
                        <a href="#/logs/{{project}}/{{key}}"><i class="fa fa-clipboard"></i></a>
                    </li>
                </ul>
            </td>
            <td class="center logs-col">
                <a href="#/{{project}}/builds/{{id}}"><i class="fa fa-clipboard"></i></a>
            </td>
        </tr>
        {{/each}}
        </tbody>
    </table>
</div>