GlobalSubs = [
  Meteor.subscribe('userData'),
  Meteor.subscribe('userLinks'),
  Meteor.subscribe('userRankings')
];

Router.configure({
  layoutTemplate: 'layout',

  waitOn: function() {
    return GlobalSubs;
  }
});

linkListController = RouteController.extend({
  onBeforeAction: function () {
    if ( this.params && this.params.type ) {
      Session.set('allLinks.types', [this.params.type]);
    } else {
      Session.set('allLinks.types', null);
    }
  },
  waitOn: function() {
    var params = {
      sort: Session.get('allLinks.sort'),
      limit: Session.get('allLinks.limit'),
      skip: Session.get('allLinks.skip'),
      types: Session.get('allLinks.types')
    }
    return [
      Meteor.subscribe('allLinks', params)
    ]
  }
});

Router.map(function() {

  this.route('home', {
    path: '/',
    template: 'home',
    controller: linkListController
  });

  this.route('link', {
    path: '/l/:slug',
    template: 'linkPage',
    waitOn: function() {
      return [
        Meteor.subscribe('linkBySlug', this.params.slug)
      ]
    },
    data: function() {
      return Links.findOne({slug: this.params.slug})
    },
    onBeforeAction: function() {
      if ( this.ready() ) {
        Meteor.subscribe('linkComments', this.data()._id);
      }
    }
  });

  this.route('editLink', {
    path: '/edit/:slug',
    template: 'editLink',
    waitOn: function() {
      return [
        Meteor.subscribe('linkBySlug', this.params.slug)
      ]
    },
    data: function() {
      return Links.findOne({slug: this.params.slug})
    },
    action: function() {
      if ( !Meteor.user() || !this.data().linkOwner(Meteor.user()) ) {
        Router.go('home');
        Alerts.add('Sorry, you can not edit that link');
      } else {
        this.render();
      }
    }
  });

  this.route('newLink', {
    path: '/new',
    template: 'newLink',
    action: function() {
      if ( !Meteor.user() ) {
        Router.go('home');
        Alerts.add('You must be logged in to add a new link');
      } else {
        this.render();
      }
    }
  });

  this.route('type', {
    path: '/t/:type',
    template: 'home',
    controller: linkListController
  });

});