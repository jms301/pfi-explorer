Router.configure({
  loadingTemplate: 'myLoading',
  layoutTemplate: 'layout'
});

Router.onBeforeAction('loading');

Router.route('/',
  function () {
    this.render('projectslist');
  },
  {
   waitOn: function () {
    return Meteor.subscribe('limited_projects');
   }
  }
);

Router.route('/project/:hmt_id',
  function () { this.render('projectfull'); },
  {
    waitOn : function () {
      return [Meteor.subscribe('full_projects', parseInt(this.params.hmt_id)),
              Meteor.subscribe('companies')];
    },
    data: function () {
      return Projects.findOne({hmt_id: parseInt(this.params.hmt_id)});
    },
    name: "project",
    action : function () {
         if (this.ready()) this.render();
    }
  }
);
