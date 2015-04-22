var HttpError = require('./index.js').HttpError;
var API = require('./index.js').API;
var getResults = require('./index.js').Results;
var getAll = require('./index.js').All;
var Count = require('./index.js').Count;

var api = API(process.env.DOL_API_KEY);

var log = console.log;

function filter(ary){
	return ary.map(function(item){ return item.datasetPath; });
}

// Get a list of all the API endpoints that are listed in the API APIMetadata endpoint.
api.APIMetadata.APIMetadatas()
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
					console.log(e.message, e.response.statusCode, e.response.req.path);
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
;

