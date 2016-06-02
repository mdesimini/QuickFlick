app.factory('Authentication', ['$rootScope', '$firebaseAuth', '$firebaseObject', '$location', 'FIREBASE_URL', function($rootScope, $firebaseAuth, $firebaseObject, $location, FIREBASE_URL) {
    
    var ref = new Firebase(FIREBASE_URL);    
    var auth = $firebaseAuth(ref);    
    
    auth.$onAuth(function(authUser) {
       if(authUser) {
           var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid);
           var userObj = $firebaseObject(userRef);
           $rootScope.currentUser = userObj;
       } else {
           $rootScope.currentUser = '';
       }
    });
    
    return {
        login: function(user) {
            auth.$authWithPassword({
                email: user.email,
                password: user.password
            }).then(function(regUser){
                $location.path('/');
            }).catch(function(error){
                $rootScope.message = error.message;
            });
            //$rootScope.message = "Hey, " + $scope.user.email;  
        },
        
        logout: function() {
            return auth.$unauth(); //logout
        },  //require Authentication
        
        requireAuth: function() {
            return auth.$requireAuth();
        },
        
        register: function(user) {
              auth.$createUser({
                  email: user.email,
                  password: user.password
              }).then(function(regUser){
                  
                  //var favArray = [];
                  
                  var regRef = new Firebase(FIREBASE_URL + 'users')
                  .child(regUser.uid).set({
                      date: Firebase.ServerValue.TIMESTAMP,
                      regUser: regUser.uid,
                      firstname: user.firstname,
                      lastname: user.lastname,
                      email: user.email
                      // set favorites array to push to: ??  favorites: []
                      
                      
                  }); //user info
                  
                  
                  $rootScope.message = "Hey, " + user.firstname + ", you're registered!";
                 $location.path('/login');
              }).catch(function(error){
                  $rootScope.message = error.message;
              });  //create user            
        }
    };
    
}]); //factory
