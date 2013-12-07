<h1>Project List</h1>
<table class="datatable">
    <thead>
        <tr>
            <th width="75">Status</th>
            <th>Project</th>
            <th>Repository</th>
            <th width="60">Logs</th>
            <th width="75">Config</th>
        </tr>
    </thead>
    <tbody>
    {{#each projects}}
    <tr>
        <td class="center">
            {{#compare this.state.status "fail" operator="==="}}
            <a href="#/logs/{{this.dir}}/{{this.state.id}}" title="Build Failing"><i class="fa fa-circle red"></i></a>
            {{/compare}}
            
            {{#compare this.state.status "pass" operator="==="}}
            <a href="#/logs/{{this.dir}}/{{this.state.id}}" title="Build Passing"><i class="fa fa-circle green"></i></a>
            {{/compare}}
            
            {{#compare this.state.status undefined operator="==="}}
            <a title="No Builds"><i class="fa fa-circle yellow"></i></a>
            {{/compare}}
            
        </td>
        <td title="{{this.dir}}">
            {{this.dir}}
        </td>
        <td title="{{this.repo}}">
            {{this.repo}}
        </td>
        <td class="center">
            <a href="#/logs/{{this.dir}}"><i class="fa fa-th-list"></i></a>
        </td>
        <td class="center">
            <a href="#/project/{{this.dir}}"><i class="fa fa-cog"></i></a>
        </td>
    </tr>
    {{/each}}
    </tbody>
</table>