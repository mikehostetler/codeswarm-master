<h1 class="page-title">
    <i class="fa fa-th-list"></i>
    Builds by tag for <a href="#/{{project}}">{{project}}</a>
</h1>

<div class="content-wrap">
    <table class="datatable">
        <thead>
            <th width="100">Tag</th>
            <th>Builds</th>
            <th width="75">Build</th>
        </thead>
        <tbody>
            {{#each tags}}
                <tr>
                    <td>{{name}}</td>
                    <td>
                        {{#if builds.length}}
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
                            <tr data-build={{id}}>
                                <td class="center status-col"">
                                    {{#compare state "failed" operator="==="}}
                                    <a href="#/{{project}}/builds/{{id}}" title="Build Failed"><i class="fa fa-circle red"></i></a>
                                    {{/compare}}

                                    {{#compare state "passed" operator="==="}}
                                    <a href="#/{{project}}/builds/{{id}}" title="Build Passed"><i class="fa fa-circle green"></i></a>
                                    {{/compare}}

                                    {{#compare state "running" operator="==="}}
                                    <a href="#/{{project}}/builds/{{id}}" title="Running"><i class="fa fa-circle yellow"></i></a>
                                    {{/compare}}

                                    {{#compare state "pending" operator="==="}}
                                    <a href="#/{{project}}/builds/{{id}}" title="Pending"><i class="fa fa-circle yellow"></i></a>
                                    {{/compare}}

                                </td>
                                <td class="logs">
                                    Started at {{started_at}}, Triggered by {{triggered_by}}
                                </td>
                                <td class="center logs-col">
                                    <a href="#/{{project}}/builds/{{id}}"><i class="fa fa-clipboard"></i></a>
                                </td>
                            </tr>
                            {{/each}}
                            </tbody>
                            <tfoot></tfoot>
                        </table>
                        {{else}}
                          -
                        {{/if}}
                    </td>
                    <td class="center run-col" data-light="{{id}}">
                        <br>
                        <a class="project-run-build" data-tag="{{this.name}}" data-project="{{../project}}"><i class="fa fa-repeat {{#compare this.state 'running' operator="==="}}fa-spin{{/compare}}"></i></a>
                    </td>
                </tr>
            {{/each}}
        </tbody>
        <tfoot></tfoot>
    </table>
</div>