<h1>Logs for {{project}}</h1>

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
            {{#compare value "fail" operator="==="}}
            <a href="#/logs/{{this.dir}}/{{this.state.id}}" title="Build Failed"><i class="fa fa-circle red"></i></a>
            {{/compare}}
            
            {{#compare value "pass" operator="==="}}
            <a href="#/logs/{{this.dir}}/{{this.state.id}}" title="Build Passed"><i class="fa fa-circle green"></i></a>
            {{/compare}}
        </td>
        <td>
            {{key}}
        </td>
        <td class="center">
            <a href="#/config/{{this.dir}}"><i class="fa fa-cog"></i></a>
        </td>
    </tr>
    {{/key_value}}
    </tbody>
</table>