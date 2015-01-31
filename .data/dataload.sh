mongoimport -h 127.0.0.1:3002 -db meteor -c projects --file ./projects_load.json
mongoimport -h 127.0.0.1:3002 -db meteor -c richcompanies --file ./companies_richard.json
mongoimport -h 127.0.0.1:3002 -db meteor -c transactions --file ./transactions.json
mongoimport -h 127.0.0.1:3002 -db meteor -c companies --file ./reconciled_companies.json
mongoimport -h 127.0.0.1:3002 -db meteor -c naoreports --file ./nao_links.json
mongoimport -h 127.0.0.1:3002 -db meteor -c nationalcharts --file ./national_charts.json 
mongoimport -h 127.0.0.1:3002 -db meteor -c departments --file ./departments_by_year.json 
