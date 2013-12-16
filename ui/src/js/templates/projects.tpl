<h1>Project List</h1>
<table class="datatable">
    <thead>
        <tr>
            <th class="center" width="75">Status</th>
            <th class="center" width="65">Build</th>
            <th>Last Build</th>
            <th>Project</th>
            <th>Repository</th>
            <th class="center" width="60">Logs</th>
            <th class="center" width="75">Config</th>
        </tr>
    </thead>
    <tbody>
    {{#each projects}}
    <tr>
        <td class="center" data-status="{{this.dir}}">
        
            {{#compare this.state.status "fail" operator="==="}}
            <a href="#/logs/{{this.dir}}/{{this.state.id}}" title="Build Failing"><i class="fa fa-circle red"></i></a>
            {{/compare}}
            
            {{#compare this.state.status "pass" operator="==="}}
            <a href="#/logs/{{this.dir}}/{{this.state.id}}" title="Build Passing"><i class="fa fa-circle green"></i></a>
            {{/compare}}
            
            {{#compare this.state.status "processing" operator="==="}}
            <a href="#/logs/{{this.dir}}/{{this.state.id}}" title="Processing"><i class="fa fa-refresh fa-circle yellow"></i></a>
            {{/compare}}
            
            {{#compare this.state.status undefined operator="==="}}
            <a title="No Builds"><i class="fa fa-circle"></i></a>
            {{/compare}}
            
        </td>
        <td class="center">
        	<a class="project-run-build" data-project="{{this.dir}}"><i class="fa fa-repeat"></i></a>
        </td>
        <td data-timestamp="{{this.dir}}">
            {{#if this.state}}
            {{this.state.timestamp}}
            {{else}}
            Never
            {{/if}}
        </td>
        <td title="{{this.dir}}">
            {{this.dir}}
        </td>
        <td title="{{this.repo}}">
            {{this.repo}}
        </td>
        <td class="center">
        	{{#if this.state}}
            <a href="#/logs/{{this.dir}}"><i class="fa fa-th-list"></i></a>
            {{else}}
            N/A
            {{/if}}
        </td>
        <td class="center">
            <a href="#/project/{{this.dir}}"><i class="fa fa-cog"></i></a>
        </td>
    </tr>
    {{/each}}
    </tbody>
</table>