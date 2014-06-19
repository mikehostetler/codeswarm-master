<h1 class="page-title">
  <i class="fa fa-lock"></i>
  <span data-bind="html:displayName"></span>
</h1>

<div class="content-wrap">

	<form id="login" class="global-form" data-bind="submit: tryResetPassword">

    <div class="gf-col">
	    <label>Email Address</label>
	    <input type="text" placeholder="Email Address" name="email" data-bind="value: email">
	  </div>

	  <div class="gf-actions">
	    <button>Reset Password</button>
			<a href="#user/login" data-bind="attr: { href: router.convertRouteToHash('user/login') }" class="btn btn-sec">Cancel</a>
    </div>

	</form>

</div>
