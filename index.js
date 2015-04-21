var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var traverse = require('traverse');

function HttpError(message, response){
		return {
			message:message,
			response:response
		}
	}

function API(key){
	var httpOptions = {
		url: 'https://api.dol.gov/V1/',
		headers: {
			'User-Agent': 'node-dol-api-client',
			'Accept': 'application/json',
			'Authorization': 'ApiKey=' + key
		}
	};
	
	function parseResponse(response, body) {
		if (response.statusCode == 200) {
			var info = JSON.parse(body);
			return info.d;
		}
		else{
			throw HttpError("non 200 HTTP response returned from server.", response);
		}
	}
	
	function removeApiRoot(url){
		if(!url){ return url; }
		
		var rootIndex = url.toLowerCase().indexOf('/v1/');
		
		if(rootIndex < 0){ return url; }
		
		rootIndex += 4;
		
		return url.substring(rootIndex)
	}
	
	function lazyGetDataFunc(uri){
		return function(){
			return getData(uri);
		};
	}
	
	function parseOData(results){
		traverse(results).forEach(function(x) {
			switch(this.key){
				case "__deferred":
					var endPoint = removeApiRoot(x.uri);
					this.update(lazyGetDataFunc(endPoint));
					break;
				case "__next":
					var endPoint = removeApiRoot(x);
					this.update(lazyGetDataFunc(endPoint));
					break;
			}
		});

		return results;
	}
	function getData(endPoint){
		var opts = JSON.parse(JSON.stringify(httpOptions)); //prevent the options from being unintentionally modified down stream.
		opts.url += removeApiRoot(endPoint);

		return request(opts)
			.spread(parseResponse)
			.then(parseOData)
		;
	}
	
	function DataSet(applyToObj, name, endPoint, apiObj){
		Object.defineProperty(applyToObj, name, {
			value: function(filter) { 
				if(filter){
				}else{
					return apiObj.getDataFromEndpoint(endPoint);
				}
			},
			enumerable: false,
			configurable: true
		});
	}
	
	var api = {
		getDataFromEndpoint:function(endPoint){
			if(typeof(endPoint) === 'string'){
				return getData(endPoint);
			}
		}
	}
	api.apiMetrics = {};
	DataSet(api.apiMetrics, 'allDol', 'APIMetrics/AllDOL/', api);
	DataSet(api.apiMetrics.allDol, 'topDataTables', 'APIMetrics/AllDOL/TopDataTables', api);
	DataSet(api.apiMetrics.allDol, 'topDataTablesPerDays', 'APIMetrics/AllDOL/TopDataTablesPerDays', api);
	DataSet(api.apiMetrics.allDol, 'topDataTablesPerMonths', 'APIMetrics/AllDOL/TopDataTablesPerMonths', api);
	DataSet(api.apiMetrics.allDol, 'topDataTablesPerWeeks', 'APIMetrics/AllDOL/TopDataTablesPerWeeks', api);
	DataSet(api.apiMetrics.allDol, 'topDataTablesPerYears', 'APIMetrics/AllDOL/TopDataTablesPerYears', api);
	DataSet(api.apiMetrics.allDol, 'topDatasets', 'APIMetrics/AllDOL/TopDatasets', api);
	DataSet(api.apiMetrics.allDol, 'topDatasetsPerDays', 'APIMetrics/AllDOL/TopDatasetsPerDays', api);
	DataSet(api.apiMetrics.allDol, 'topDatasetsPerMonths', 'APIMetrics/AllDOL/TopDatasetsPerMonths', api);
	DataSet(api.apiMetrics.allDol, 'topDatasetsPerWeeks', 'APIMetrics/AllDOL/TopDatasetsPerWeeks', api);
	DataSet(api.apiMetrics.allDol, 'topDatasetsPerYears', 'APIMetrics/AllDOL/TopDatasetsPerYears', api);
	DataSet(api, 'autoWorkers', 'AutoWorkers/', api);
	DataSet(api.autoWorkers, 'carClosedRepurposed', 'AutoWorkers/CAR_ClosedRepurposed', api);
	
	return api;
}

function EndPoint(uri){
	this.uri = uri
}

function getAll(data, results){
	var results = results || [];
	
	results = results.concat(data.results);
	
	if(data.__next){
		return data.__next().then(function(r){
			return getAll(r, results);
		});
	}
	return results;
}

var api = API('11cdcea3-eb1f-456b-8e38-8af381f5222d');

function getResults(d){ return d.hasOwnProperty("results") ? d.results : d; }
function head(n){ return n[0]; }
var log = console.log;

/*
api.ouiInitialClaims()
	.then(getAll)
	.then(function(r){
		log(r.length);
	})
;
api.formsAgencies()
	.then(getResults)
	.then(head)
	.then(log)
;
api.safetyHealthChemicalExposureInspections()
	.then(getResults)
	.then(head)
	.then(log)
;
*/

function filter(ary){
	return ary.map(function(item){ return item.datasetPath; });
}

function geteach(ary){
	var accu = [];
	
	ary.forEach(function(endpoint){
		api.getDataFromEndpoint(endpoint)
			.then(getResults)
			.then(function(item){
				accu.push( {
					endpoint: endpoint,
					data: item
				});
			})
			.catch(HttpError, function(e){
				//console.log(e.message, e.response.statusCode, e.response.req.path);
			})
		;
	});
	
	return accu;
}

function Error(name){
	return function(e){
		console.log("Error on API:", name);
	};
}

function Count(name){
	return function(ary){
		if(ary.results){
			console.log(name, " Results: ", ary.results.length);
		}else if(ary.EntitySets){
			console.log(name, " EntitySets: ", ary.EntitySets.length);
		}
	}
}

function CallCountError(obj, name){
	obj().then(Count(name)).catch(Error(name));
}

/** APIMetrics ** 

CallCountError(api.apiMetrics.allDol, "api.apiMetrics.allDol");
CallCountError(api.apiMetrics.allDol.topDataTables, "api.apiMetrics.allDol.topDataTables");
CallCountError(api.apiMetrics.allDol.topDataTablesPerDays, "api.apiMetrics.allDol.topDataTablesPerDays");
CallCountError(api.apiMetrics.allDol.topDataTablesPerMonths, "api.apiMetrics.allDol.topDataTablesPerMonths");
CallCountError(api.apiMetrics.allDol.topDataTablesPerWeeks, "api.apiMetrics.allDol.topDataTablesPerWeeks");
CallCountError(api.apiMetrics.allDol.topDataTablesPerYears, "api.apiMetrics.allDol.topDataTablesPerYears");
CallCountError(api.apiMetrics.allDol.topDatasets, "api.apiMetrics.allDol.topDatasets");
CallCountError(api.apiMetrics.allDol.topDatasetsPerDays, "api.apiMetrics.allDol.topDatasetsPerDays");
CallCountError(api.apiMetrics.allDol.topDatasetsPerMonths, "api.apiMetrics.allDol.topDatasetsPerMonths");
CallCountError(api.apiMetrics.allDol.topDatasetsPerWeeks, "api.apiMetrics.allDol.topDatasetsPerWeeks");
CallCountError(api.apiMetrics.allDol.topDatasetsPerYears, "api.apiMetrics.allDol.topDatasetsPerYears");
***/

CallCountError(api.autoWorkers, "api.autoWorkers");
CallCountError(api.autoWorkers.carClosedRepurposed, "api.autoWorkers.carClosedRepurposed");



/*
api.metadata()
	.then(getResults)
	.then(filter)
	.map(function(endpoint){
		return api.getDataFromEndpoint(endpoint)
				.then(function(set){
					return set.EntitySets;
				})
				.map(function(entity){
					return {
						endpoint:endpoint, 
						entity: entity
					};
				})
				.catch(HttpError, function(e){
					//throw e;
				})
		;
	})
	.then(function(ary){ 
		return ary.filter(
			function(value){ return value !== undefined; }
		);
	})
	.then(function(ary){
		var merged = [];
		return merged.concat.apply(merged, ary);
	})
	.then(function(ary){ 
		return ary.map(
			function(item){
				item.endpoint = item.endpoint.substr(22);
				return item
			}
		);
	})
	.then(function(ary){
		for(var i = 0; i < ary.length; i++){
			console.log(ary[i].endpoint, ary[i].entity);
		}
	})
/*	.then(function(ary){
		var merged = [];
		return merged.concat.apply(merged, ary).filter(function(value){ return value !== undefined;});
	})
	.then(function(ary){
		return ary.map(function(obj){
			return obj.endpoint;
		});
	})
	.then(function(ary){ 
		return ary.filter(
			function(item, pos, self){ 
				return self.indexOf(item) == pos; 
			}
		);
	})
	.then(function(ary){
		return ary.map(function(item){
			return item.substr(22).replace('/', '');
		});
	})
*/	//.then(log)
;

