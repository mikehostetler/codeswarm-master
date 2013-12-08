<h1>Tokens</h1>

<hr>

{{#each tokens}}
<h4><a class="right" title="Delete Token"><i class="fa fa-times"></i></a>{{this}}</h4>
<hr>
{{/each}}

<label>New Token:</label>
<input type="text" name="token" placeholder="New Token">
<button>Add</button>