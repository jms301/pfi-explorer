Projects = new Meteor.Collection("projects");
Companies = new Meteor.Collection("companies");
Transactions = new Meteor.Collection("transactions");

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

