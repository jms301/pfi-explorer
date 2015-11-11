mongoimport -h 127.0.0.1:27017 -d meteor -c projects ./projects_load.json
mongoimport -h 127.0.0.1:27017 -d meteor -c richcompanies ./companies_richard.json
mongoimport -h 127.0.0.1:27017 -d meteor -c transactions ./transactions.json
mongoimport -h 127.0.0.1:27017 -d meteor -c companies ./reconciled_companies.json
mongoimport -h 127.0.0.1:27017 -d meteor -c naoreports ./nao_links.json
mongoimport -h 127.0.0.1:27017 -d meteor -c nationalcharts ./national_charts.json 
mongoimport -h 127.0.0.1:27017 -d meteor -c departments ./departments_by_year.json 
