var googleAuth;
var userData;
var initMessage;

gapi.load('auth2', function () {
	initMessage = "none";
    gapi.auth2.init
	({
        client_id: "984266572878-ahj0e3a15gqkvpvsptc5qc458tq3uq2j.apps.googleusercontent.com",
        scope: "profile email"
    }).then(
		function(auth2)
		{
			googleAuth = auth2;
			auth2.isSignedIn.listen(onSignIn);
			auth2.currentUser.listen(onSignIn);

			var button = document.querySelector('#sign_in');
			button.addEventListener('click',
				function()
				{
					auth2.signIn({prompt:'select_account'}).catch(
					function(error)
					{
						console.log(error);
						if(error.details != null)
						{
							initMessage = error.details;
						}							
						else
						{
							initMessage = error.error;
						}		
						SendEnvironmentLoaded();
					});
				}
			);
		},
		function(error)
		{
			console.log(error);
			if(error.details != null)
			{
				initMessage = error.details;
			}							
			else
			{
				initMessage = error.error;
			}
			if(gameLoaded == false) return;			
			SendEnvironmentLoaded();		
			
		});
});


function SendEnvironmentLoaded()
{
	console.log("gameLoaded: " + gameLoaded);
	if(gameLoaded == false) return;
	unityInstance.SendMessage
	(
        "[Bridge]",
        "SetEnvironmentLoaded",
        initMessage
	);
}

function OnFailure()
{
	console.log("fallo po wea");
}

function LogOutUnityCall()
{
    googleAuth.signOut().then(function () {});
}

function LogInUnityCall()
{
    document.getElementById("sign_in").click();
}

function onSignIn(googleUser)
{
    if (googleAuth.isSignedIn.get() == false) return;
	
    var profile = googleAuth.currentUser.get().getBasicProfile();

    // The ID token you need to pass to your backend:
    userData = profile.getEmail() + "," + profile.getId();

    unityInstance.SendMessage
	(
        "[Bridge]",
        "SetIdUser",
        userData
	);
};