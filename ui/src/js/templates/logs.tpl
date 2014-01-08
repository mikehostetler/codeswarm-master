<h1 class="page-title">
    <i class="fa fa-th-list"></i>
    Logs for {{project}}
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
        {{#key_value logs}}
        <tr>
            <td class="center">
                {{#compare value.status "fail" operator="==="}}
                <a href="#/logs/{{value.project}}/{{key}}" title="Build Failed"><i class="fa fa-circle red"></i></a>
                {{/compare}}
                
                {{#compare value.status "pass" operator="==="}}
                <a href="#/logs/{{value.project}}/{{key}}" title="Build Passed"><i class="fa fa-circle green"></i></a>
                {{/compare}}
            </td>
            <td>
                {{value.date}}
            </td>
            <td class="center">
                <a href="#/logs/{{value.project}}/{{key}}"><i class="fa fa-clipboard"></i></a>
            </td>
        </tr>
        {{/key_value}}
        </tbody>
    </table>
</div>