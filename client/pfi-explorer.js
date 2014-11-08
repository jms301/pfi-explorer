Projects = new Meteor.Collection("projects");

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
  } 
});

Template.projectfull.rendered = function () { 
    console.log("this");
    console.log(this.data);
    var values = _.map(
      this.payments, function (item) { 
       return {x: item.year, y: item.estimated};
    });
    
    console.log("values");
    console.log(values);
    var payments = [{ values: values, key: "payments"}];  

    console.log("payments");
    console.log(payments);

    nv.addGraph(function() {
    console.log("payments inner");
      console.log(payments);
      console.log(exampleData());
      var chart = nv.models.discreteBarChart()
      .x(function(d) { return d.x })    //Specify the data accessors.
      .y(function(d) { return d.y })
      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
      .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      .transitionDuration(350);

      d3.select('#chart svg')
        .datum(exampleData())
        .call(chart);

      nv.utils.windowResize(chart.update);
      return chart;
    });
};

exampleData = function () {
 return  [ 
    {
      key: "Cumulative Return",
      values: [
        { 
          "label" : "A Label" ,
          "value" : -29.765957771107
        } , 
        { 
          "label" : "B Label" , 
          "value" : 0
        } , 
        { 
          "label" : "C Label" , 
          "value" : 32.807804682612
        } , 
        { 
          "label" : "D Label" , 
          "value" : 196.45946739256
        } , 
        { 
          "label" : "E Label" ,
          "value" : 0.19434030906893
        } , 
        { 
          "label" : "F Label" , 
          "value" : -98.079782601442
        } , 
        { 
          "label" : "G Label" , 
          "value" : -13.925743130903
        } , 
        { 
          "label" : "H Label" , 
          "value" : -5.1387322875705
        }
      ]
    }
  ]

};
