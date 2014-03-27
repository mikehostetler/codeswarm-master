<h1 class="page-title">
    <i class="fa fa-folder"></i>
    {{project}} tags
</h1>

<div class="content-wrap" id="tag-list">
    <table class="datatable">
        <thead>
            <tr>
                <th class="center" width="100">Starred</th>
                <th class="center" width="200">Name</th>
                <th class="center">Commit hash</th>
            </tr>
        </thead>
        <tbody>
          {{#each tags}}
            <tr>
                <td class="center">
                    <i data-starred="{{starred}}" data-tag="{{name}}" class="star fa fa-star {{#if starred}}yellow{{/if}}"></i>
                </td>
                <td class="center">{{name}}</td>
                <td class="center">{{commit.sha}}</td>
            </tr>
          {{/each}}
        </tr></td>
        </tbody>
    </table>
</div>