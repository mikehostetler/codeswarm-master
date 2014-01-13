<h1 class="page-title">
    <i class="fa fa-folder"></i>
    Project List
    <a href="#/project/new" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
</h1>

<div class="content-wrap">
    <table class="datatable">
        <thead>
            <tr>
                <th class="center" width="75">Status</th>
                <th class="center" width="65">Build</th>
                <th>Project</th>
                <th class="center" width="60">Logs</th>
                <th class="center" width="75">Config</th>
            </tr>
        </thead>
        <tbody>
        {{#each projects}}
        <tr>
            <td class="center status-col" data-status="{{this.dir}}">

                <br>
            
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
            <td class="center run-col">
                <br>
            	<a class="project-run-build" data-project="{{this.dir}}"><i class="fa fa-repeat"></i></a>
            </td>
            
            
            <td>
                <h4 class="project">{{this.dir}}</h4>
                <em class="repo">{{this.repo}}</em>
                <span class="last-build">
                    Last Build:
                    <span data-timestamp="{{this.dir}}">
                    {{#if this.state}}
                    {{this.state.timestamp}}
                    {{else}}
                    Never
                    {{/if}}
                    </span>
                </span>

                <ul class="table-actions">
                    <li>
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
                    </li>
                    <li>
                        <a class="project-run-build" data-project="{{this.dir}}"><i class="fa fa-repeat"></i></a>
                    </li>
                    <li>
                        {{#if this.state}}
                        <a href="#/logs/{{this.dir}}"><i class="fa fa-th-list"></i></a>
                        {{else}}
                        N/A
                        {{/if}}
                    </li>
                    <li>
                        <a href="#/project/{{this.dir}}"><i class="fa fa-cog"></i></a>
                    </li>
                </ul>
            </td>
            
            <td class="center logs-col">
                <br>
            	{{#if this.state}}
                <a href="#/logs/{{this.dir}}"><i class="fa fa-th-list"></i></a>
                {{else}}
                N/A
                {{/if}}
            </td>
            <td class="center settings-col">
                <br>
                <a href="#/project/{{this.dir}}"><i class="fa fa-cog"></i></a>
            </td>
        </tr>
        {{/each}}
        </tbody>
    </table>
</div>