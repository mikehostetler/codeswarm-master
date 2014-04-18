<h1 class="page-title">
    <i class="fa fa-folder"></i>
    Project List

    <input class="project-search right" id="project-search" type="text" placeholder="Search">

    {{#unless restricted}}
      <a href="#/project/new" class="btn right"><i class="fa fa-plus-circle"></i>New Project</a>
    {{/unless}}


</h1>

<div class="content-wrap" id="project-list">
    {{{projects}}}
</div>