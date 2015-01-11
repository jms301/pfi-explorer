Projects = new Meteor.Collection("projects");
Companies = new Meteor.Collection("companies");
Transactions = new Meteor.Collection("transactions");
RichCompanies = new Meteor.Collection("richcompanies");
NaoReports = new Meteor.Collection("naoreports");
NatCharts = new Meteor.Collection("nationalcharts");

//RegionSpend = new Meteor.Collection("pfiSpendRegionData");

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

var cpOverview = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      columns: [['x'].concat(labels),
                ['payment'].concat(data)],
      type: 'bar'
    },
    legend: { show: false},
    axis: {
      x: {
        label: 'years',
        type: 'category'
      },
      y: {label: 'projected cost (£m)'}
    },
    padding: { top: 20}
});

  d3.select('#chart svg').append('text')
    .attr('x', d3.select('#chart svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.4em')
    .text('Projected payments');

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

Template.registerHelper('thisIdStr', function ( ) {
  return this._id._str;
});

Template.chart.rendered = function () {

  var cpOverview = c3.generate({
    bindto: '#chart-' + this.data._id._str,
    data: {
      x: 'x',
      columns: [['x'].concat(this.data.labels),
                ['payment'].concat(this.data.data)],
      type: 'bar'
    },
    legend: { show: false},
    axis: {
      x: {
        type: 'category'
      },
      y: {label: 'projected cost (£m)'}
    }
  });
};


Template.maps.helpers({
  charts: function () {
    return NatCharts.find();
  }
});

Template.map.rendered = function () {

  var map = L.map('map', {
    center: [54.005, -3.0],
    zoom: 6,
    fadeAnimation: false
  });

    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 20, attribution: osmAttrib});

          // start the map in South-East England
              map.addLayer(osm);

};


// test function for bubble chart
test = function () {
  var diameter = 1600,
    color = d3.scale.category20c(),
    format = d3.format(",.0f");
  var svg = d3.select(this.$("svg")[0])
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

  var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);
  var myData = this.data;
  var data = _.map(this.data.data, function (val, i) {
    return {value: val, packageName: myData.labels[i]};
  });

  console.log(data);

  var node = svg.selectAll(".node")
  .data(bubble.nodes({children: data})
    .filter(function(d) { return !d.children; }))
  .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

  node.append("title").text(
      function(d) { return d.packageName + ": £" + format(d.value) + "(m)"});

  node.append("svg:a")
    .attr("xlink:href", function(d) { return d.href;})
    .append("circle")
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.packageName.substring(0, d.r/4);});

};

Template.pfiRecentList.helpers({
  pfiRecent: Projects.find({}, {sort: {date_fin_close: -1}, limit: 5})
});

Template.pfiSpendRegion.rendered = function () {
	var chart;
	var width = 200;
	var height = 200;
	// var regionspend = RegionSpend().find().fetch();
        var testdata = [
        {key: "One", y: 5},
        {key: "Two", y: 2},
        {key: "Three", y: 9},
        {key: "Four", y: 7},
        {key: "Five", y: 4},
        {key: "Six", y: 3},
        {key: "Seven", y: 0.5}
    ];
	var barData = [
		{ values: [{x: 2020, y: 50},
			   {x: 2021, y: 56},
			   {x: 2022, y: 89},
			   {x: 2023, y: 90},
			   {x: 2024, y: 91},
			   {x: 2025, y: 55},
			   {x: 2026, y: 58},
			   {x: 2027, y: 103},
			   {x: 2028, y: 109},
			   {x: 2029, y: 110},
			   {x: 2030, y: 90},
			   {x: 2031, y: 97},
			   {x: 2032, y: 107},
			   {x: 2033, y: 117},
			   {x: 2034, y: 123},
			   {x: 2035, y: 120},
			   {x: 2036, y: 121},
			   {x: 2037, y: 106},
			   {x: 2038, y: 99},
			   {x: 2039, y: 87}],
		  key: "PFI Spend Per Year",
		  color: "#ff7f0d"
		}];

	nv.addGraph(function() {
		chart = nv.models.pieChart()
			.showLegend(false)
			.x(function(d) { return d.key })
			.y(function(d) { return d.y })
			.width(width)
			.height(height)
		
		d3.select('#pfispendregion')
		  .datum(testdata)
		  .attr('width', width)
		  .attr('height', height)
		  .call(chart)

		return chart;
	});

	nv.addGraph(function() {
		chart = nv.models.pieChart()
			.showLegend(false)
			.x(function(d) { return d.key })
			.y(function(d) { return d.y })
			.width(width)
			.height(height)
		
		d3.select('#pfispendtype')
		  .datum(testdata)
		  .attr('width', width)
		  .attr('height', height)
		  .call(chart)

		return chart;
	});

	nv.addGraph(function() {
		chart = nv.models.pieChart()
			.showLegend(false)
			.x(function(d) { return d.key })
			.y(function(d) { return d.y })
			.width(width)
			.height(height)
		
		d3.select('#pfispenddept')
		  .datum(testdata)
		  .attr('width', width)
		  .attr('height', height)
		  .call(chart)

		return chart;
	});

	nv.addGraph(function() {
		chart = nv.models.historicalBarChart();
		chart.useInteractiveGuideline(true)
		     .width(500)
		     .duration(250);

		chart.xAxis.axisLabel("Year");

		chart.yAxis.axisLabel('Payments (£ Billion)');

		d3.select('#pfispendplanned')
		  .datum(barData)
		  .transition()
		  .call(chart);
	});
}
	
