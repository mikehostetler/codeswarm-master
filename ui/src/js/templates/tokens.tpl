<h1 class="page-title">Tokens</h1>

<div class="content-wrap">
	{{#each tokens}}
	<h4 class="token-list-item"><a class="right delete-token" data-token="{{this}}" title="Delete Token"><i class="fa fa-times"></i></a>{{this}}</h4>
	<hr>
	{{/each}}

	<form id="add-token">
		<label>New Token:</label>
		<input type="text" name="token" placeholder="New Token">
		<button>Add</button>
	</form>
</div>