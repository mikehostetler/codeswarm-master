<h1 class="page-title">
    <i class="fa fa-th-list"></i>
    Builds for <a href="#/{{project}}">{{project}}</a>
</h1>

<div class="content-wrap">
    <table class="datatable">
        <thead>
            <tr>
                <th width="75">Status</th>
                <th>Data</th>
                <th width="70">Open</th>
            </tr>
        </thead>
        <tbody>
        {{#each builds}}
        <tr data-build={{_id}}>
            <td class="center status-col"">
                {{#compare state "failed" operator="==="}}
                <a href="#/{{project}}/builds/{{_id}}" title="Build Failed"><i class="fa fa-circle red"></i></a>
                {{/compare}}

                {{#compare state "passed" operator="==="}}
                <a href="#/{{project}}/builds/{{_id}}" title="Build Passed"><i class="fa fa-circle green"></i></a>
                {{/compare}}

                {{#compare state "running" operator="==="}}
                <a href="#/{{project}}/builds/{{_id}}" title="Running"><i class="fa fa-circle yellow"></i></a>
                {{/compare}}

                {{#compare state "pending" operator="==="}}
                <a href="#/{{project}}/builds/{{_id}}" title="Pending"><i class="fa fa-circle yellow"></i></a>
                {{/compare}}

            </td>
            <td class="logs">
                Started at {{started_at}}, Triggered by {{triggered_by}}
            </td>
            <td class="center logs-col">
                <a href="#/{{project}}/builds/{{_id}}"><i class="fa fa-clipboard"></i></a>
            </td>
        </tr>
        {{/each}}
        </tbody>
    </table>
</div>