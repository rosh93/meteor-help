Template.linkPage.events({
  'click .claim-owner': function (e,t) {
    e.preventDefault();
    Meteor.call('claimLinkOwner', this._id);
  }
});

Template.linkPage.created = function() {
  document.title = this.data.name + ' - ' + 'Meteor Help, Ratings and Reviews for Meteor Content';
}

Template.linkPage.destroyed = function() {
  document.title = 'Meteor Help - A catalog of content from the best in the Meteor and Javascript community';
}