Projects = new Meteor.Collection("projects");
Companies = new Meteor.Collection("companies");
Transactions = new Meteor.Collection("transactions");
RichCompanies = new Meteor.Collection("richcompanies");
NatCharts = new Meteor.Collection("nationalcharts");
NaoReports = new Meteor.Collection("naoreports");

Meteor.publish('naoreports', function () {
  return NaoReports.find({});
});

Meteor.publish('richcompanies', function () {
  return RichCompanies.find({});
});

Meteor.publish('limited_projects', function () {
  return Projects.find({}, {fields: {name: 1, date_fin_close: 1, hmt_id: 1, authority: 1, department: 1, sector: 1, capital_value: 1, contract_years: 1}});
});

Meteor.publish('full_projects', function (hmt_id) {
  return Projects.find({hmt_id: hmt_id});
});

Meteor.publish('companies', function () {
  return Companies.find({});
});

Meteor.publish('transactions', function () {
  return Transactions.find({});
});

Meteor.publish('nationalcharts', function () {
  return NatCharts.find({});
});

Meteor.publish('project_stats', function() {
	Counts.publish(this, 'all_projects', Projects.find({}));
	Counts.publish(this, 'construction_projects', Projects.find({"status": "InConstruction"}));
	Counts.publish(this, 'procurement_projects', Projects.find({date_fin_close: {$lt: "2015-01-10"}}));
	Counts.publish(this, 'live_projects', Projects.find({date_ops: {$lte: "2015-01-01"}}));

});

// Entirely taken from http://stackoverflow.com/questions/18520567/average-aggregation-queries-in-meteor/

Meteor.publish("pfiSpendRegionAgg", function (args) {
    var sub = this;
    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    var pipeline = [
        { $group: {
            _id: "$region.name",
            count: { $sum: "$capital_value" }
        }}
    ];

    db.collection("projects").aggregate(        
        pipeline,

        Meteor.bindEnvironment(
            function(err, result) {
                _.each(result, function(item) {
                  sub.added("pfiSpendRegionData", Random.id(), {
                    key: item._id,
                    y: item.count
                  });
                });
                sub.ready();
            },
            function(error) {
                Meteor._debug( "Error doing aggregation: " + error);
            }
        )
    );
});

Meteor.publish("pfiSpendDeptAgg", function (args) {
    var sub = this;
    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    var pipeline = [
        { $group: {
            _id: "$department.name",
            count: { $sum: "$capital_value" }
        }}
    ];

    db.collection("projects").aggregate(        
        pipeline,

        Meteor.bindEnvironment(
            function(err, result) {
                _.each(result, function(item) {
                  sub.added("pfiSpendDeptData", Random.id(), {
                    key: item._id,
                    y: item.count
                  });
                });
                sub.ready();
            },
            function(error) {
                Meteor._debug( "Error doing aggregation: " + error);
            }
        )
    );
});

Meteor.publish("pfiPlannedSpendAgg", function (args) {
    var sub = this;
    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    var pipeline = [
	{ $unwind : "$payments" },
        { $group: {
            _id: "$payments.year",
            count: { $sum: "$payments.estimated" }
        }}
    ];

    db.collection("projects").aggregate(        
        pipeline,

        Meteor.bindEnvironment(
            function(err, result) {
                _.each(result, function(item) {
                  sub.added("pfiPlannedSpendData", Random.id(), {
                    x: item._id,
                    y: item.count
                  });
                });
                sub.ready();
            },
            function(error) {
                Meteor._debug( "Error doing aggregation: " + error);
            }
        )
    );
});

/*
Meteor.startup(function () {


}); */
