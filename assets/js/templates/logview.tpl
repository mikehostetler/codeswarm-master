<h1 class="page-title">
    <i class="fa fa-th-list"></i>
    <span><a href="#!/{{build.project}}">{{project}}</a> - {{_id}} - {{created_at}}</span>
</h1>

{{#each stages}}
<div class="content-wrap">
  <h3>{{name}}</h3>
  {{#each commands}}
    <h3>{{created_at}}</h3>
  	<pre>$ {{command}} {{args}}
{{out}}</pre>
  	<div class="log-bottom"></div>
  {{/each}}
</div>
{{/each}}