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
                <th class="center">Label</th>
                <th class="center">Description</th>
                <th class="center">Edit</th>
            </tr>
        </thead>
        <tbody>
          {{#each tags}}
            <tr>
                <td class="center">
                    <i data-starred="{{starred}}" data-tag="{{name}}" class="star fa fa-star {{#if starred}}yellow{{/if}}"></i>
                </td>
                <td class="center">{{name}}</td>
                <td data-tag="{{name}}" class="label center">{{label}}</td>
                <td data-tag="{{name}}" class="description center">{{description}}</td>
                <td><button class="edit" data-tag="{{name}}">Edit</button></td>
            </tr>
          {{/each}}
        </tr></td>
        </tbody>
    </table>
</div>