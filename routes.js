Router.configure({
  loadingTemplate: 'loading',
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

Router.route('/dashboard',
  function () {
    this.render('dashboard');
  },
  {
   waitOn: function () {
    return [Meteor.subscribe('limited_projects'), Meteor.subscribe('pfiSpendRegionAgg'), Meteor.subscribe('pfiSpendDeptAgg'), Meteor.subscribe('pfiPlannedSpendAgg'), Meteor.subscribe('project_stats')];
   }
  }
);

Router.route('/about');
Router.route('/timeline');
Router.route('/trackers');

Router.route('/maps',
  function () { this.render('maps'); },
  {
    waitOn : function () {
      Meteor.subscribe('nationalcharts');
    },
    name: "maps",
    action : function () {
         if (this.ready()) this.render();
    }
  }
);

Router.route('/charts',
  function () { this.render('charts'); },
  {
    waitOn : function () {
      return [Meteor.subscribe('nationalcharts'), Meteor.subscribe('departmentsyearly')];
    },
    name: "charts",
    action : function () {
         if (this.ready()) this.render();
    }
  }
);

Router.route('/project/:hmt_id',
  function () { this.render('projectfull'); },
  {
    waitOn : function () {
      return [Meteor.subscribe('full_projects', parseInt(this.params.hmt_id)),
              Meteor.subscribe('companies'),
              Meteor.subscribe('transactions'),
              Meteor.subscribe('naoreports'),
              Meteor.subscribe('richcompanies'),
];
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
