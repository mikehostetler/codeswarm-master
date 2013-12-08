<h1>Tokens</h1>

<hr>

{{#each tokens}}
<h4><a class="right delete-token" data-token="{{this}}" title="Delete Token"><i class="fa fa-times"></i></a>{{this}}</h4>
<hr>
{{/each}}

<form id="add-token">
	<label>New Token:</label>
	<input type="text" name="token" placeholder="New Token">
	<button>Add</button>
</form>