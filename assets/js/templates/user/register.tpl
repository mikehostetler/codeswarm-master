<h1 class="page-title">
    <i class="fa fa-lock"></i>
    Register
</h1>

<div class="content-wrap">
    <form id="register" class="global-form" ng-submit="register(credentials)">

        <div class="gf-col">
            <h3>Quickly register with:</h3>
            <ul>
                <li><a ng-href="{{prefix}}/auth/github">Log in with Github</a></li>
            </ul>
        </div>

        <div class="gf-col">
            <h3>Or create an account:</h3>

            <label>Username</label>
            <input type="text" placeholder="Username" name="username" ng-model="credentials.username">

            <label>Email</label>
            <input type="text" placeholder="Email Address" name="email" ng-model="credentials.email">

            <label>Password</label>
            <input type="password" placeholder="Password" name="password" ng-model="credentials.password">

        </div>

        <div class="gf-actions">
            <p>By registering, you are agreeing to the <a href="">Terms of Service</a> and the <a href="">Privacy
                    Policy.</a></p>
            <br/>
            <button>Register</button>
            <a ng-href="#user/login" class="btn btn-sec">Already have an Account?</a>
        </div>

    </form>

</div>
