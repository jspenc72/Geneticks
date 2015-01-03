'use strict';
angular.module('Geneticks.services', [])
.factory('$db', function() {
	// PouchDB.destroy('geneticks', function(err, info) { 
	// 	console.log(info);
	// });
	if(window.sqlitePlugin){
		console.log(window.sqlitePlugin);
	}
	var genedb = new PouchDB('geneticks'); 

	genedb.info(function(err, info) { 
		console.log(info);
		console.log(genedb.adapter);

	})
	genedb.setSchema([
	  {
	    singular: 'gene',
	    plural: 'genes',
	    relations: {
	      test: {belongsTo: 'test'}
	    }
	  },
	  {
	    singular: 'test',
	    plural: 'tests',
	    relations: {
	      laboratory: {belongsTo: 'laboratory'}
	    }
	  },
	  {
	    singular: 'laboratory',
	    plural: 'laboratories',
	    relations: {
	      tests: {hasMany: 'test'}
	    }
	  }
	]);
	return genedb;
})
.factory('Genes', function($db){
	var all = function(callback){
		return $db.rel.find('gene');
	};
	var create = function(doc){
	    doc.createdAt = new Date().toISOString();
	    doc.updatedAt = new Date().toISOString();
		return $db.rel.save('gene', doc);
	};
	var read = function(ids){
		return $db.rel.find('gene', ids);
	};
	var update = function(doc){
	    doc.updatedAt = new Date().toISOString();
		return $db.rel.save('gene', angular.copy(doc));
	};
	var destroy = function(doc){		
		return $db.rel.del('gene', doc);
	};
	var bulk = function(docs, callback){
		return $db.bulkDocs(docs, callback);
	};
  return {
    all: function(){
    	return all();
    },
    create: function(doc){
    	return create(doc);
    },
    read: function(ids){
    	return read(ids);
    },
    update: function(doc){
    	return update(doc);
    },
    destroy: function(doc){
    	return destroy(doc);
    },
    bulk: function(docs, callback){
    	return bulk(docs, callback);
    }
  }
})
.factory('Tests', function($db){
	var all = function(callback){
		return $db.rel.find('test');
	};
	var create = function(doc){
	    doc.createdAt = new Date().toISOString();
	    doc.updatedAt = new Date().toISOString();
		return $db.rel.save('test', doc);
	};
	var read = function(ids){
		return $db.rel.find('test', ids);
	};
	var update = function(doc){
	    doc.updatedAt = new Date().toISOString();
		return $db.rel.save('test', angular.copy(doc));
	};
	var destroy = function(doc){
		return $db.rel.del('test', doc);
	};
	var bulk = function(docs, callback){
		return $db.bulkDocs(docs, callback);
	};
  return {
    all: function(){
    	return all();
    },
    create: function(doc){
    	return create(doc);
    },
    read: function(ids){
    	return read(ids);
    },
    update: function(doc){
    	return update(doc);
    },
    destroy: function(doc){
    	return destroy(doc);
    },
    bulk: function(docs, callback){
    	return bulk(docs, callback);
    }
  }
})
.factory('Laboratories', function($db){
	var all = function(callback){
		return $db.rel.find('laboratory');
	};
	var create = function(doc){
	    doc.createdAt = new Date().toISOString();
	    doc.updatedAt = new Date().toISOString();
		return $db.rel.save('laboratory', doc);
	};
	var read = function(ids){
		return $db.rel.find('laboratory', ids);
	};
	var update = function(doc){
	    doc.updatedAt = new Date().toISOString();
		return $db.rel.save('laboratory', angular.copy(doc));
	};
	var destroy = function(doc){
		return $db.rel.del('laboratory', doc);
	};
  return {
    all: function(){
    	return all();
    },
    create: function(doc){
    	return create(doc);
    },
    read: function(ids){
    	return read(ids);
    },
    update: function(doc){
    	return update(doc);
    },
    destroy: function(doc){
    	return destroy(doc);
    }
  }
})
.factory('userdb_pub_remote', function(){
  var x = function(user){
    var hex, i;
    var str = user; //
    var result = "";
    var dbname = "userdb-pub-";
    for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += hex;
      if(i==str.length-1){
        dbname += result;
        return dbname;
      }
    }       
  }
  return{
    init: function(){
  		var db = new PouchDB('http://api.geneticks.com:5984/'+x(localStorage.getItem('FMD_USER')));
  		return db;
    },
    dbname: function(){
      return x(localStorage.getItem('FMD_USER'));
    }
  }
})
.factory('userdb_pri_remote', function(){
  var x = function(user){
    var hex, i;
    var str = user; //
    var result = "";
    var dbname = "userdb-pri-";
    for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += hex;
      if(i==str.length-1){
        dbname += result;
        return dbname;
      }
    }       
  }
  return{
    init: function(username){
  		var db = new PouchDB('http://api.geneticks.com:5984');
      if(username){
        var db = new PouchDB('http://api.geneticks.com:5984/'+username);
      }else{
        var db = new PouchDB('http://api.geneticks.com:5984/');
      }
      return db;

    },
    dbname: function(username){
      console.log()
      return x(localStorage.getItem('FMD_USER'));
    }
  }
})
.factory('userdb_pub_local', function(){
  var x = function(user){
    var hex, i;
    var str = user; //
    var result = "";
    var dbname = "userdb-";
    for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += hex;
      if(i==str.length-1){
        dbname += result;
        // console.log("Open USERDB"+dbname);
        return dbname;
      }
    }       
  }
  return{
    init: function(){
      var db = new PouchDB(x(localStorage.getItem('FMD_USER')));
      return db;
    },
    setUser: function(username){
      localStorage['FMD_USER'] = username;  
      console.log(localStorage.getItem('FMD_USER'));
      return localStorage.getItem('FMD_USER');
    },
    destroy: function(dbname){
      var db = new PouchDB(dbname);
      db.destroy(function(err, info) { 
        if(err){
          alert("Failed to Destroy Database: "+dbname);
        }else{
          console.log(info);
        }
      });
    },
    info: function(callback){
      var db = new PouchDB(x(localStorage.getItem('FMD_USER')));
      db.info(function(err, info) { 
        if(err){
          console.log(err);
          return;
        }else{
          console.log(info);
          callback(info);
        }
      });
    }
  }
})
.factory('userdb_pri_local', function(){
  var x = function(user){
    var hex, i;
    var str = user; //
    var result = "";
    var dbname = "userdb-";
    for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += hex;
      if(i==str.length-1){
        dbname += result;
        // console.log("Open USERDB"+dbname);
        return dbname;
      }
    }       
  }
  return{
    init: function(){
      var db = new PouchDB(x(localStorage.getItem('FMD_USER')));
      return db;
    },
    setUser: function(username){
      localStorage['FMD_USER'] = username;  
      console.log(localStorage.getItem('FMD_USER'));
      return localStorage.getItem('FMD_USER');
    },
    destroy: function(dbname){
      var db = new PouchDB(dbname);
      db.destroy(function(err, info) { 
        if(err){
          alert("Failed to Destroy Database: "+dbname);
        }else{
          console.log(info);
        }
      });
    },
    info: function(callback){
      var db = new PouchDB(x(localStorage.getItem('FMD_USER')));
      db.info(function(err, info) { 
        if(err){
          console.log(err);
          return;
        }else{
          console.log(info);
          callback(info);
        }
      });
    }
  }
})
.factory('GeneticksAuth', function(userdb_pri_remote, userdb_pub_remote, userdb_pri_local, userdb_pub_local){
  var signup = function(username, password, metadata){
    var db = new PouchDB('http://api.geneticks.org:5984/_utils');
    db.signup(username, password, metadata, function (err, response) {
      if (err) {
        console.log(err);
        if (err.name === 'conflict') {
          // $scope.showSignInAlert("Sign Up Error", "<center><p> "+ $scope.loginData.user.username+" already exists, choose another username</p></center>");          
          alert(username+' already exists, choose another username');
        } else if (err.name === 'forbidden') {
          // $scope.showSignInAlert("Sign Up Error", "<center><p>Invalid Username</p></center>");          
          alert('Invalid Username');
          // invalid username
        }else{
          alert(err.message);
          //HTTP Cosmic Rays.
        }
      }else if(response){
        console.log(response);
        alert('Sign Up Successful, Please wait while we sign you in.');
      }
    });
  };
  var login = function(username, password){
    var db = new PouchDB('http://api.geneticks.org:5984/_utils');
    db.login(username, password, function (err, response) {
      if(response){
        console.log(response);
      }
      if (err) {
        console.log(err);
      }
    });
  };
  var logout = function(){
    var db = new PouchDB('http://api.geneticks.org:5984/_utils');
    db.logout(function (err, response) {
      if (err) {
        // network 
        console.log(err);
      }else{
        console.log(response);
      }
    })
  };
  var session = function(){
    var db = new PouchDB('http://api.geneticks.org:5984/_utils');
    db.getSession(function (err, response) {
      if (err) {
        // network error
        console.log(err);
      } else if (!response.userCtx.name) {
        // nobody's logged in
        console.log("No one is currently logged in.");
        console.log(response);
      } else{
        console.log(response);        
        // response.userCtx.name is the current user
      }
    });
  };
  return {
    signup: function(username, password, metadata){
      return signup(username, password, metadata);
    },
    login: function(username, password){
      return login(username, password);
    },
    logout: function(){
      return logout();
    },
    session: function(){
      return session();
    }
  }
});