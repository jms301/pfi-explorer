Projects = new Meteor.Collection("projects");
Companies = new Meteor.Collection("companies");
Transactions = new Meteor.Collection("transactions");
RichCompanies = new Meteor.Collection("richcompanies");
NaoReports = new Meteor.Collection("naoreports");
NatCharts = new Meteor.Collection("nationalcharts");

Session.setDefault("showPayments", true);
Session.setDefault("showTransaction", false);
Session.setDefault("showEquity", false);

// Hacks & Cludges:
// bootstrap 3 navbar fix
fix_top_padding = function () {

  $('body').css({"padding-top": $(".navbar").height() + 30 + "px"});
};

//Body - body doesn't work very well with iron router but layout does!
Template.layout.rendered = function () {
  fix_top_padding();
};


fix_top_padding = function () {
    $('body').css({"padding-top": $(".navbar").height() + 30 + "px"});
};

Template.layout.rendered = function () {
  fix_top_padding();
};

Template.projectslist.helpers({
  projects: function () {
    return Projects.find({}, {fields:
       {name: 1,
        date_fin_close: 1,
        hmt_id: 1,
        authority: 1,
        department: 1,
        sector: 1,
        capital_value: 1,
        contract_years: 1}
    });
  },
  settings: function () {
    return {
      collection: 'projects',
      rowsPerPage: 10,
      showFilter: true,
      fields: [ {key:'name', label: "Name",
                 tmpl: Template.nameTmpl},
                {key: 'date_fin_close',
                 label: "Date of Financial Close"},
                {key: 'authority.name',
                 label: "Authority Name"},
                {key: 'department.name',
                 label: "Department Name"},
                {key: 'sector.name',
                 label: "Sector Name"},
                {key: 'capital_value',
                 label: "Capital Value (£ m)"},
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
  equityshown: function () {
    return Session.get("showEquity")? "show" : "hidden";
  },
  paymentsshown: function () {
    return Session.get("showPayments")? "show" : "hidden";
  },
  transactionsshown: function () {
    return Session.get("showTransactions")? "show" : "hidden";
  },
  richcompanyname: function (companyid) {
    return RichCompanies.findOne({id: companyid}).name;
  },

  opencompanydata: function () {
    if(this && this.spv && this.spv.name) {
      var ocd =  Companies.findOne({pfi_name: this.spv.name});
      return  (ocd || null);
    } else {
      return null;
    }
  },
  naoreportdata: function () {
    return NaoReports.find({hmt_id: this.hmt_id});
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

Template.projectfull.rendered = function( ){

  var labels = _.map(this.data.payments, function (payment, i) {
    return payment.year;
  });
  var data = _.map(this.data.payments, function (payment, i) {
    return payment.estimated;
  });

  var pStart = 0; //final leading zero
  var pEnd = 0; //first trailing zero
  for (i = 1; i< data.length; i++) {
    if(data[i] != 0) {
       pStart = i-1;
       break;
    }
  }
  for(i=data.length-2; i>=0; i--) {
    if(data[i] !=0) {
      pEnd = i+2;
      break;
    }
  }

  data=data.slice(pStart, pEnd);
  labels=labels.slice(pStart,pEnd);

  var chartData = {
    labels: labels,
    datasets: [{
      label: "Payments",
      fillColor: "rgba(151,187,205,0.2)",
      strokeColor: "rgba(151,187,205,1)",
      pointColor: "rgba(151,187,205,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
      data: data
    }]
  };
  ctx = $("#paymentsChart").get(0).getContext("2d");
  var myLineChart = new Chart(ctx).Line(chartData, {
      pointHitDetectionRadius : 5,
      pointDotRadius : 3,
      animation: false
    });
  return "";
};

Template.projectfull.events({
  'click #payments' : function () {
    Session.set("showPayments", !Session.get("showPayments"));
  },
  'click #transactions' : function () {
    Session.set("showTransactions", !Session.get("showTransactions"));
  },
  'click #equity' : function () {
    Session.set("showEquity", !Session.get("showEquity"));
  }
});

Template.charts.helpers({

  charts: function () {
    return NatCharts.find({});
  }

});

Template.chart.rendered = function () {
  var chartData = {
    labels: this.data.labels,
    datasets: [{
      label: "Payments",
      fillColor: "rgba(151,187,205,0.2)",
      strokeColor: "rgba(151,187,205,1)",
      pointColor: "rgba(151,187,205,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
      data: this.data.data
    }]
  };

  ctx = this.$(".nationalchart").get(0).getContext("2d");
  var myLineChart = new Chart(ctx).Line(chartData, {
      pointHitDetectionRadius : 1,
      pointDotRadius : 3,
      animation: false
    });
  return "";
};
