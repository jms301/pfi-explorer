Router.configure({
  loadingTemplate: 'myLoading',
  layoutTemplate: 'layout'
});

Router.onBeforeAction('loading');

Router.route('/', function () {
  this.render('projectslist');
})

Router.route('/project/:hmt_id',
  function () { this.render('projectfull'); },
  {
    data: function () {
      return Projects.findOne({hmt_id: parseInt(this.params.hmt_id)});
    },
    name: "project",
 }
);
