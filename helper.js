
//This function strips out the first level of crud that is in the way of the results
function Results(d){ 
	return d.hasOwnProperty("results") ? d.results : d; 
}

//This gets all results when the results are paginated.
//That is to say it automatically walks all the pages and return the full result set.
function All(data, results){
	var results = results || [];
	
	results = results.concat(data.results);
	
	if(data.__next){
		return data.__next().then(function(r){
			return getAll(r, results);
		});
	}
	return results;
}

//Returns the count of items in the results.
//Note: unless the All function (or some other method) was used this will have an upper bound of the API pangination size.
function Count(){
	if(ary.results){
		return ary.results.length;
	}else if(ary.EntitySets){
		return ary.EntitySets.length;
	}
}

exports.Results = Results;
exports.All = All;
exports.Count = Count;

