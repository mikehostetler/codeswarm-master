<h1>Project List</h1>
<table class="datatable">
    <thead>
        <tr>
            <th>Status</th>
            <th>Project</th>
            <th>Repository</th>
            <th>Logs</th>
        </tr>
    </thead>
    <tbody>
    {{#each projects}}
    <tr>
        <td class="center">
            <i class="fa fa-circle"></i>
        </td>
        <td>
            {{this.dir}}
        </td>
        <td>
            {{this.repo}}
        </td>
        <td class="center">
            <i class="fa fa-th-list"></i>
        </td>
    </tr>
    {{/each}}
    </tbody>
</table>