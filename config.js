const env = process.env;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = es6Promise.Promise;
import es6Promise from 'es6-promise';
mongoose.Promise = es6Promise.Promise;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var express = require('express');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
import Tweet from './models/tweet'
import apiRouter from './api';
import Keys from './keys';

export const nodeEnv = env.NODE_ENV || 'development';

export const logStars = function(message) {
  console.info('**********');
  console.info(message);
  console.info('**********');
};
const DATABASEUrl = 'mongodb://localhost/jobhunt_dbseeding'
export default {
  port: env.PORT || 8080,
  host: env.HOST || '0.0.0.0',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  },
  configDB(){
  	  mongoose.connect(DATABASEUrl);
  	  return mongoose.connection;
  },
  configRequestParser(server){
	  server.use(bodyParser.json({limit: '5mb'}));
	  server.use(bodyParser.urlencoded({ extended: true, limit: '5mb'}));
	  server.use(cookieParser());

	  server.use(expressValidator({
	    errorFormatter: function(param, msg, value) {
	        var namespace = param.split('.')
	        , root    = namespace.shift()
	        , formParam = root;

	      while(namespace.length) {
	        formParam += '[' + namespace.shift() + ']';
	      }
	      return {
	        param : formParam,
	        msg   : msg,
	        value : value
	      };
	    }
	  }));
	},
	configViewEngine(server){
  		server.use(express.static('public'));
  		server.set('view engine', 'ejs');
	}, 
	configAuth(server){
		  server.use(session({
		    secret: Keys.sessionSalt,
		    saveUninitialized: true,
		    resave: true
		  }));
		  server.use(passport.initialize());
		  server.use(passport.session());
		  passport.use(new LocalStrategy({
		    usernameField: 'user[username]',
		    passwordField: 'user[password]'
		  },
		  function(username, password, done) {
		    User.getUserByUsername(username, function(user, err){
		        if(!user){
		          return done(null, false, {message: 'Unknown User'});
		        }
		        User.comparePassword(password, user.password, function(err, isMatch){
		          if(err) throw err;
		          if(isMatch){
		            return done(null, user);
		          } else {
		            return done(null, false, {message: 'Invalid password'});
		          }
		        });
		     });
		  }));
		  passport.serializeUser(function(user, done) {
		    done(null, user.id);
		  });

		  passport.deserializeUser(function(id, done) {
		    User.getUserById(id, function(err, user) {
		      done(err, user);
		    });
		  });
	},
	setupRoutes(server){
		server.get('*.js', function (req, res, next) {
		  req.url = req.url + '.gz';
		  res.set('Content-Encoding', 'gzip');
		  next();
		});
		server.use('/api', apiRouter);
		server.get('/*', (req, res) => {
			let currUser;
			if (req.user){
				currUser = {};
				currUser.username = req.user.username;
				currUser.usersBeingFollowed = req.user.usersBeingFollowed;
				currUser.usersFollowing = req.user.usersFollowing;
				currUser.firstName = req.user.firstName;
				currUser.lastName = req.user.lastName;
				currUser.notifications = req.user.notifications;
				currUser.profileImg = req.user.profileImg;
				currUser.coverImg = req.user.coverImg;
				currUser["_id"] = req.user["_id"];
				Tweet.getTweetCount(req.user['_id'], (err, tweetCount) => {
					currUser.tweetCount = tweetCount;
					res.render('index', {currentUser: currUser});
				})
			} else {
				currUser = undefined;
				res.render('index', {currentUser: currUser});
			}
  		});
	}
};
