Projects = new Meteor.Collection("projects");
Companies = new Meteor.Collection("companies");
Transactions = new Meteor.Collection("transactions");

Session.setDefault("showPayments", false);
Session.setDefault("showTransaction", false);

Template.projectslist.helpers({
  projects: function () {
    return Projects.find({});
  },
  settings: function () {
    return {
      collection: 'projects',
      rowsPerPage: 10,
      showFilter: true,
      fields: [ {key:'name', label: "Name",
                 tmpl: Template.nameTmpl},
                {key: 'date_fin_close',
                 label: "Date of Final Close"},
                {key: 'authority.name',
                 label: "Authority Name"},
                {key: 'department.name',
                 label: "Department Name"},
                {key: 'sector.name',
                 label: "Sector Name"},
                {key: 'capital_value',
                 label: "Capital Value"},
                {key: 'contract_years',
                 label: "Contract Years"}]
    };
  }
});

Template.projectfull.helpers({
  prettyshow: function () {
    return JSON.stringify(this, true, 2);
  },
  filtered_payments: function () {
    return _.filter(this.payments, function (item) {
      return item.estimated != "0";
    });
  },
  paymentsshown: function () {
    return Session.get("showPayments")? "show" : "hidden";
  },
  transactionsshown: function () {
    return Session.get("showTransactions")? "show" : "hidden";
  },
  opencompanydata: function () {
    if(this && this.spv && this.spv.name) {
      var ocd =  Companies.findOne({pfi_name: this.spv.name});
      return  (ocd || null);
    } else {
      return null;
    }
  },
  transactiondata: function () { 
    if(this && this.hmt_id) {
      var trans =  Transactions.find({hmt_id: this.hmt_id}, {sort: {transaction_id: 1}});
      return (trans || []);
    } else {  
      return [];
    }
  } 
});

Template.projectfull.events({
  'click #payments' : function () {
    Session.set("showPayments", !Session.get("showPayments"));
  },
  'click #transactions' : function () {
    Session.set("showTransactions", !Session.get("showTransactions"));
  }
});
