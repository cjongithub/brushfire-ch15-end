/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  home: function(req, res) {

    if (!req.session.userId) {
      return res.view('homepage', {
        me: null
      });
    }

    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage', {
          me: null
        });
      }

      return res.view('homepage', {
        me: {
          email: user.email,
          username: user.username,
          gravatarURL: user.gravatarURL,
          admin: user.admin
        }
      });
    });
  },

  editProfile: function(req, res) {

    if (!req.session.userId) {
      return res.redirect('/');
    }

    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        console.log('error: ', err);
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage');
      }

      return res.view('edit-profile', {
        me: {
          email: user.email,
          username: user.username,
          gravatarURL: user.gravatarURL,
          admin: user.admin
        }
      });
    });
  },

  profile: function(req, res) {

    // Fake tutorials array
    var tutorials = [{
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '4'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '4'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '4'
    }];

    // Look up the user record for the `username` parameter
    User.findOne({
      username: req.param('username')
    }).exec(function(err, foundByUsername) {
      if (err) {
        return res.negotiate(err);
      }

      // If no user exists with the username specified in the URL,
      // show the 404 page.
      if (!foundByUsername) {
        return res.notFound();
      }

      // If the requesting user-agent is not logged-in,
      // just show the profile page.
      if (!req.session.userId) {
        return res.view('profile', {
          me: null,
          username: foundByUsername.username,
          gravatarURL: foundByUsername.gravatarURL,
          tutorials: tutorials
        });
      }

      // Otherwise the user-agent IS logged in.
      // 

      // Look up the logged-in user from the database.
      User.findOne({id: req.session.userId}).exec(function (err, loggedInUser){
        if (err) {
          return res.negotiate(err);
        }

        if (!loggedInUser) {
          return res.serverError('User record from logged in user is missing?');
        }

        // We'll provide `me` as a local to the profile page view.
        // (this is so we can render the logged-in navbar state, etc.)
        var me = {
          email: loggedInUser.email,
          username: loggedInUser.username,
          gravatarURL: loggedInUser.gravatarURL,
          admin: loggedInUser.admin
        };

        // We'll provide the `isMe` flag to the profile page view
        // if the logged-in user is the same as the user whose profile this is.
        if (req.session.userId === foundByUsername.id) {
          me.isMe = true;
        }
        
        return res.view('profile', {
          me: me,
          username: foundByUsername.username,
          gravatarURL: foundByUsername.gravatarURL,
          tutorials: tutorials
        });
        
      }); //</ User.findOne({id: req.session.userId})
    });// </find user by username>
  },

  signin: function(req, res) {
    if (req.session.userId) {
      return res.redirect('/');
    }

    return res.view('signin', {
      me: null
    });
  },

  signup: function(req, res) {
    if (req.session.userId) {
      return res.redirect('/');
    }

    return res.view('signup', {
      me: null
    });
  },

  restoreProfile: function(req, res) {

    if (req.session.userId) {
      return res.redirect('/');
    }

    return res.view('restore-profile', {
      me: null
    });
  },

  administration: function(req, res) {
    if (!req.session.userId) {
      return res.redirect('/');
    }

    User.findOne(req.session.userId, function(err, user) {

      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage');
      }

      if (user.admin) {
        return res.view('administration', {
          me: {
            email: user.email,
            username: user.username,
            gravatarURL: user.gravatarURL,
            admin: user.admin
          }
        });
      } else {
        return res.view('homepage', {
          me: {
            id: user.id,
            email: user.email,
            username: user.username,
            gravatarURL: user.gravatarURL,
            admin: user.admin
          }
        });
      }
    });
  },

  // #1
  passwordRecoveryEmail: function(req, res) {

    if (req.session.userId) {
      return res.redirect('/');
    }

    return res.view('./password-recovery/password-recovery-email', {
      me: null
    });
  },

  // #2
  passwordRecoveryEmailSent: function(req, res) {

    if (req.session.userId) {
      return res.redirect('/');
    }

    return res.view('./password-recovery/password-recovery-email-sent', {
      me: null
    });
  },

  // #3
  passwordReset: function(req, res) {

    // Get the passwordRecoveryToken and render the view
    res.view('./password-recovery/password-reset', {
      me: null,
      passwordRecoveryToken: req.param('passwordRecoveryToken')
    });

  },

  browseTutorials: function(req, res) {

    // Fake tutorials array
    var tutorials = [{
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }, {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '5'
    }];

    // If not logged in set `me` property to `null` and pass tutorials to the view
    if (!req.session.userId) {
      return res.view('tutorials-list', {
        me: null,
        tutorials: tutorials
      });
    }

    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage', {
          me: null
        });
      }

      return res.view('tutorials-list', {
        me: {
          email: user.email,
          gravatarURL: user.gravatarURL,
          username: user.username,
          admin: user.admin
        },
        tutorials: tutorials
      });
    });
  },

  tutorialDetail: function(req, res) {

    // Fake tutorials detail dictionaryarray
    var tutorial = {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sails-in-action',
      id: 1,
      createdAt: '2015-09-27T16:32:55.000Z',
      updatedAt: '2015-10-07T14:57:12.000Z',
      totalTime: '3h 22m',
      stars: '4',
      videos: [{
        id: 55,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 23,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 34,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 64,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 95,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 106,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 73,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 88,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 96,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }, {
        id: 108,
        title: 'Tation libris prodesset nam id. Qui no epicuri oportere. Tritani delicata vix eu.',
        duration: '10m 43s',
      }]
    };

      // Format the date the Tutorial was created into time ago (e.g. 10 days ago)
      var Datetime = require('machinepack-datetime');
      
      var formatDate = function(date) {  
        var niceTimeAgoString = Datetime.timeFrom({
          toWhen: Datetime.parse({
            datetime: date
          }).execSync(),
          fromWhen: new Date().getTime()
        }).execSync();

        return niceTimeAgoString;
      };

      tutorial.createdAt = formatDate(tutorial.createdAt);
      tutorial.updatedAt = formatDate(tutorial.updatedAt);

    // If not logged in set `me` property to `null` and pass the tutorial to the view
    if (!req.session.userId) {
      return res.view('tutorials-detail', {
        me: null,
        stars: tutorial.stars,
        tutorial: tutorial
      });
    }

    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('tutorials-detail', {
          me: null
        });
      }

  
      return res.view('tutorials-detail', {
        me: {
          email: user.email,
          gravatarURL: user.gravatarURL,
          username: user.username,
          admin: user.admin
        },
        stars: tutorial.stars,
        tutorial: tutorial
      });
    });
  },

  newTutorial: function(req, res) {

    // If not logged in set `me` property to `null` and redirect to the signin view.
    if (!req.session.userId) {
      return res.redirect('/signin');
    }

    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.redirect('tutorials');
      }

      return res.view('tutorials-detail-new', {
        me: {
          email: user.email,
          gravatarURL: user.gravatarURL,
          username: user.username,
          admin: user.admin
        }
      });
    });
  },

  editTutorial: function(req, res) {

    // If not logged in set `me` property to `null` and redirect to the signin view.
    if (!req.session.userId) {
      return res.redirect('/signin');
    }

    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.redirect('/tutorials');
      }

      return res.view('tutorials-detail-edit', {
        me: {
          email: user.email,
          gravatarURL: user.gravatarURL,
          username: user.username,
          admin: user.admin
        }
      });
    });
  },

  newVideo: function(req, res) {

    var tutorial = {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '4'
    };

    // If not logged in set `me` property to `null` and pass the fakeTutorialList to the view
    if (!req.session.userId) {
      return res.view('tutorials-detail-video-new', {
        me: null,
        tutorial: tutorial
      });
    }

    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('tutorials-detail-video-new', {
          me: null
        });
      }

      return res.view('tutorials-detail-video-new', {
        me: {
          email: user.email,
          username: user.username,
          gravatarURL: user.gravatarURL,
          admin: user.admin
        },
        tutorial: tutorial
      });
    });
  },

  editVideo: function(req, res) {

    var tutorial = {
      title: 'Sed ut perspiciatis unde omnis',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea.',
      owner: 'sailsinaction',
      createdOn: '2015-09-27T16:32:55.000Z',
      totalTime: '3h 22m',
      stars: '4'
    };

    // If not logged in set `me` property to `null` and redirect to the signin view.
    if (!req.session.userId) {
      return res.redirect('/signin');
    }

    User.findOne(req.session.userId, function(err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.redirect('/tutorials');
      }

      return res.view('tutorials-detail-video-edit', {
        me: {
          email: user.email,
          username: user.username,
          gravatarURL: user.gravatarURL,
          admin: user.admin
        },
        tutorial: tutorial
      });
    });
  }
};