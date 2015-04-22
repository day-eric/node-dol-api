var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var traverse = require('traverse');

function HttpError(message, response){
	return {
		message:message,
		response:response
	};
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
	
	/****
	* This Block was auto generated based on output from the metadata endpoint.
	****/
	DataSet(api, 'APIMetadata', 'APIMetadata/', api);
	DataSet(api.APIMetadata, 'APIMetadatas', 'APIMetadata/APIMetadatas', api);
	api.APIMetrics = {};
	DataSet(api.APIMetrics, 'AllDOL', 'APIMetrics/AllDOL', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDataTables', 'APIMetrics/AllDOL/TopDataTables', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDataTablesPerDays', 'APIMetrics/AllDOL/TopDataTablesPerDays', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDataTablesPerMonths', 'APIMetrics/AllDOL/TopDataTablesPerMonths', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDataTablesPerWeeks', 'APIMetrics/AllDOL/TopDataTablesPerWeeks', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDataTablesPerYears', 'APIMetrics/AllDOL/TopDataTablesPerYears', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDatasets', 'APIMetrics/AllDOL/TopDatasets', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDatasetsPerDays', 'APIMetrics/AllDOL/TopDatasetsPerDays', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDatasetsPerMonths', 'APIMetrics/AllDOL/TopDatasetsPerMonths', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDatasetsPerWeeks', 'APIMetrics/AllDOL/TopDatasetsPerWeeks', api);
	DataSet(api.APIMetrics.AllDOL, 'TopDatasetsPerYears', 'APIMetrics/AllDOL/TopDatasetsPerYears', api);
	DataSet(api, 'AutoWorkers', 'AutoWorkers/', api);
	DataSet(api.AutoWorkers, 'CAR_ClosedRepurposed', 'AutoWorkers/CAR_ClosedRepurposed', api);
	api.Compliance = {};
	DataSet(api.Compliance, 'MineInspection', 'Compliance/MineInspection', api);
	DataSet(api.Compliance.MineInspection, 'mineInspections', 'Compliance/MineInspection/mineInspections', api);
	DataSet(api.Compliance, 'OSHA', 'Compliance/OSHA', api);
	DataSet(api.Compliance.OSHA, 'foodService', 'Compliance/OSHA/foodService', api);
	DataSet(api.Compliance.OSHA, 'full', 'Compliance/OSHA/full', api);
	DataSet(api.Compliance.OSHA, 'hospitality', 'Compliance/OSHA/hospitality', api);
	DataSet(api.Compliance.OSHA, 'occupationCode', 'Compliance/OSHA/occupationCode', api);
	DataSet(api.Compliance.OSHA, 'retail', 'Compliance/OSHA/retail', api);
	DataSet(api.Compliance.OSHA, 'substanceCode', 'Compliance/OSHA/substanceCode', api);
	DataSet(api.Compliance, 'WHD', 'Compliance/WHD', api);
	DataSet(api.Compliance.WHD, 'foodService', 'Compliance/WHD/foodService', api);
	DataSet(api.Compliance.WHD, 'full', 'Compliance/WHD/full', api);
	DataSet(api.Compliance.WHD, 'hospitality', 'Compliance/WHD/hospitality', api);
	DataSet(api.Compliance.WHD, 'retail', 'Compliance/WHD/retail', api);
	DataSet(api, 'DOLAgency', 'DOLAgency/', api);
	DataSet(api.DOLAgency, 'Agencies', 'DOLAgency/Agencies', api);
	DataSet(api, 'Employment', 'Employment/', api);
	DataSet(api.Employment, 'MSHA_employmentProduction', 'Employment/MSHA_employmentProduction', api);
	api.EnforcementData = {};
	DataSet(api.EnforcementData, 'EBSA', 'EnforcementData/EBSA', api);
	DataSet(api.EnforcementData.EBSA, 'ebsa_data_dictionary', 'EnforcementData/EBSA/ebsa_data_dictionary', api);
	DataSet(api.EnforcementData.EBSA, 'ebsa_ocats', 'EnforcementData/EBSA/ebsa_ocats', api);
	DataSet(api, 'Events', 'Events/', api);
	DataSet(api.Events, 'Addresses', 'Events/Addresses', api);
	DataSet(api.Events, 'Agencies', 'Events/Agencies', api);
	DataSet(api.Events, 'EventTypes', 'Events/EventTypes', api);
	DataSet(api.Events, 'Events', 'Events/Events', api);
	DataSet(api.Events, 'States', 'Events/States', api);
	DataSet(api, 'FAQ', 'FAQ/', api);
	DataSet(api.FAQ, 'SubTopics', 'FAQ/SubTopics', api);
	DataSet(api.FAQ, 'TopicQuestions', 'FAQ/TopicQuestions', api);
	DataSet(api.FAQ, 'Topics', 'FAQ/Topics', api);
	DataSet(api, 'FORMS', 'FORMS/', api);
	DataSet(api.FORMS, 'Agencies', 'FORMS/Agencies', api);
	DataSet(api.FORMS, 'AgencyForms', 'FORMS/AgencyForms', api);
	DataSet(api, 'Geography', 'Geography/', api);
	DataSet(api.Geography, 'City', 'Geography/City', api);
	DataSet(api.Geography, 'CongressDistrict', 'Geography/CongressDistrict', api);
	DataSet(api.Geography, 'County', 'Geography/County', api);
	DataSet(api.Geography, 'State', 'Geography/State', api);
	DataSet(api, 'IPIA', 'IPIA/', api);
	DataSet(api.IPIA, 'IPIA_1Year', 'IPIA/IPIA_1Year', api);
	DataSet(api.IPIA, 'IPIA_3Year', 'IPIA/IPIA_3Year', api);
	DataSet(api.IPIA, 'IPIA_CalendarYear', 'IPIA/IPIA_CalendarYear', api);
	DataSet(api.IPIA, 'IPIA_Fiscal_Year', 'IPIA/IPIA_Fiscal_Year', api);
	DataSet(api.IPIA, 'causeByState', 'IPIA/causeByState', api);
	DataSet(api.IPIA, 'causeByStateSummary', 'IPIA/causeByStateSummary', api);
	DataSet(api.IPIA, 'rate', 'IPIA/rate', api);
	DataSet(api.IPIA, 'rateSummary', 'IPIA/rateSummary', api);
	DataSet(api, 'MSPA', 'MSPA/', api);
	DataSet(api.MSPA, 'FarmLaborContractors', 'MSPA/FarmLaborContractors', api);
	api.Mining = {};
	DataSet(api.Mining, 'BasicMineInfo', 'Mining/BasicMineInfo', api);
	DataSet(api.Mining.BasicMineInfo, 'MSHA_addressOfRecord', 'Mining/BasicMineInfo/MSHA_addressOfRecord', api);
	DataSet(api.Mining, 'FullMineInfo', 'Mining/FullMineInfo', api);
	DataSet(api.Mining.FullMineInfo, 'MSHA_mines', 'Mining/FullMineInfo/MSHA_mines', api);
	DataSet(api.Mining, 'Violation', 'Mining/Violation', api);
	DataSet(api.Mining.Violation, 'MSHA_violations', 'Mining/Violation/MSHA_violations', api);
	api.Safety = {};
	DataSet(api.Safety, 'Accidents', 'Safety/Accidents', api);
	DataSet(api.Safety.Accidents, 'mineAccidents', 'Safety/Accidents/mineAccidents', api);
	DataSet(api.Safety, 'FatalOccupationalInjuries', 'Safety/FatalOccupationalInjuries', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_AREA', 'Safety/FatalOccupationalInjuries/FI_AREA', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_CASE', 'Safety/FatalOccupationalInjuries/FI_CASE', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_CATEGORY', 'Safety/FatalOccupationalInjuries/FI_CATEGORY', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_CATEGORY2', 'Safety/FatalOccupationalInjuries/FI_CATEGORY2', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_DATATYPE', 'Safety/FatalOccupationalInjuries/FI_DATATYPE', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_DATA_PUB', 'Safety/FatalOccupationalInjuries/FI_DATA_PUB', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_EVENT', 'Safety/FatalOccupationalInjuries/FI_EVENT', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_FOOTNOTE', 'Safety/FatalOccupationalInjuries/FI_FOOTNOTE', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_GQT_CASE', 'Safety/FatalOccupationalInjuries/FI_GQT_CASE', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_GQT_CHAR', 'Safety/FatalOccupationalInjuries/FI_GQT_CHAR', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_GQT_CHAR_OWNERSHIP', 'Safety/FatalOccupationalInjuries/FI_GQT_CHAR_OWNERSHIP', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_GQT_OWNERSHIP', 'Safety/FatalOccupationalInjuries/FI_GQT_OWNERSHIP', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_GQT_STATE', 'Safety/FatalOccupationalInjuries/FI_GQT_STATE', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_GQT_STATE_OWNERSHIP', 'Safety/FatalOccupationalInjuries/FI_GQT_STATE_OWNERSHIP', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_INDUSTRY', 'Safety/FatalOccupationalInjuries/FI_INDUSTRY', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_OCCUPATION', 'Safety/FatalOccupationalInjuries/FI_OCCUPATION', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_SERIES', 'Safety/FatalOccupationalInjuries/FI_SERIES', api);
	DataSet(api.Safety.FatalOccupationalInjuries, 'FI_SOURCE', 'Safety/FatalOccupationalInjuries/FI_SOURCE', api);
	DataSet(api.Safety, 'Fatalities', 'Safety/Fatalities', api);
	DataSet(api.Safety.Fatalities, 'OSHA_Fatalities', 'Safety/Fatalities/OSHA_Fatalities', api);
	DataSet(api.Safety, 'GulfOilSpill', 'Safety/GulfOilSpill', api);
	DataSet(api.Safety.GulfOilSpill, 'OSHA_Direct_Read_Sampling', 'Safety/GulfOilSpill/OSHA_Direct_Read_Sampling', api);
	DataSet(api.Safety.GulfOilSpill, 'OSHA_Laboratory_Sampling', 'Safety/GulfOilSpill/OSHA_Laboratory_Sampling', api);
	DataSet(api.Safety.GulfOilSpill, 'OSHA_NOISE_REPORT', 'Safety/GulfOilSpill/OSHA_NOISE_REPORT', api);
	DataSet(api.Safety, 'InjuriesAndIllness', 'Safety/InjuriesAndIllness', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_AREA', 'Safety/InjuriesAndIllness/II_AREA', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_CASE_TYPE', 'Safety/InjuriesAndIllness/II_CASE_TYPE', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_DATA_PUB', 'Safety/InjuriesAndIllness/II_DATA_PUB', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_DATA_TYPE', 'Safety/InjuriesAndIllness/II_DATA_TYPE', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_FOOTNOTE', 'Safety/InjuriesAndIllness/II_FOOTNOTE', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_GQT_CASE', 'Safety/InjuriesAndIllness/II_GQT_CASE', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_GQT_CHAR', 'Safety/InjuriesAndIllness/II_GQT_CHAR', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_GQT_OWNERSHIP', 'Safety/InjuriesAndIllness/II_GQT_OWNERSHIP', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_GQT_STATE', 'Safety/InjuriesAndIllness/II_GQT_STATE', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_GQT_STATE_OWNERSHIP', 'Safety/InjuriesAndIllness/II_GQT_STATE_OWNERSHIP', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_INDUSTRY', 'Safety/InjuriesAndIllness/II_INDUSTRY', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_SERIES', 'Safety/InjuriesAndIllness/II_SERIES', api);
	DataSet(api.Safety.InjuriesAndIllness, 'II_SUPERSECTOR', 'Safety/InjuriesAndIllness/II_SUPERSECTOR', api);
	DataSet(api, 'SafetyHealth', 'SafetyHealth/', api);
	DataSet(api.SafetyHealth, 'ChemicalExposureInspections', 'SafetyHealth/ChemicalExposureInspections', api);
	DataSet(api.SafetyHealth, 'EstablishmentSpecificInjuryIllnessRates', 'SafetyHealth/EstablishmentSpecificInjuryIllnessRates', api);
	api.Statistics = {};
	DataSet(api.Statistics, 'BLS_Numbers', 'Statistics/BLS_Numbers', api);
	DataSet(api.Statistics.BLS_Numbers, 'averageHourlyEarnings', 'Statistics/BLS_Numbers/averageHourlyEarnings', api);
	DataSet(api.Statistics.BLS_Numbers, 'averageHourlyEarnings12MonthChange', 'Statistics/BLS_Numbers/averageHourlyEarnings12MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'averageHourlyEarnings1MonthChange', 'Statistics/BLS_Numbers/averageHourlyEarnings1MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'averageHourlyEarnings1MonthNetChange', 'Statistics/BLS_Numbers/averageHourlyEarnings1MonthNetChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'consumerPriceIndex', 'Statistics/BLS_Numbers/consumerPriceIndex', api);
	DataSet(api.Statistics.BLS_Numbers, 'consumerPriceIndex12MonthChange', 'Statistics/BLS_Numbers/consumerPriceIndex12MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'consumerPriceIndex1MonthChange', 'Statistics/BLS_Numbers/consumerPriceIndex1MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'employmentCostIndex', 'Statistics/BLS_Numbers/employmentCostIndex', api);
	DataSet(api.Statistics.BLS_Numbers, 'exportPriceIndex', 'Statistics/BLS_Numbers/exportPriceIndex', api);
	DataSet(api.Statistics.BLS_Numbers, 'exportPriceIndex12MonthChange', 'Statistics/BLS_Numbers/exportPriceIndex12MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'exportPriceIndex1MonthChange', 'Statistics/BLS_Numbers/exportPriceIndex1MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'importPriceIndex', 'Statistics/BLS_Numbers/importPriceIndex', api);
	DataSet(api.Statistics.BLS_Numbers, 'importPriceIndex12MonthChange', 'Statistics/BLS_Numbers/importPriceIndex12MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'importPriceIndex1MonthChange', 'Statistics/BLS_Numbers/importPriceIndex1MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'payrollEmployment', 'Statistics/BLS_Numbers/payrollEmployment', api);
	DataSet(api.Statistics.BLS_Numbers, 'payrollEmployment12MonthChange', 'Statistics/BLS_Numbers/payrollEmployment12MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'payrollEmployment12MonthNetChange', 'Statistics/BLS_Numbers/payrollEmployment12MonthNetChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'payrollEmployment1MonthChange', 'Statistics/BLS_Numbers/payrollEmployment1MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'payrollEmployment1MonthNetChange', 'Statistics/BLS_Numbers/payrollEmployment1MonthNetChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'producerPriceIndex', 'Statistics/BLS_Numbers/producerPriceIndex', api);
	DataSet(api.Statistics.BLS_Numbers, 'producerPriceIndex12MonthChange', 'Statistics/BLS_Numbers/producerPriceIndex12MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'producerPriceIndex1MonthChange', 'Statistics/BLS_Numbers/producerPriceIndex1MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'productivity', 'Statistics/BLS_Numbers/productivity', api);
	DataSet(api.Statistics.BLS_Numbers, 'unemploymentRate', 'Statistics/BLS_Numbers/unemploymentRate', api);
	DataSet(api.Statistics.BLS_Numbers, 'unemploymentRate12MonthChange', 'Statistics/BLS_Numbers/unemploymentRate12MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'unemploymentRate12MonthNetChange', 'Statistics/BLS_Numbers/unemploymentRate12MonthNetChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'unemploymentRate1MonthChange', 'Statistics/BLS_Numbers/unemploymentRate1MonthChange', api);
	DataSet(api.Statistics.BLS_Numbers, 'unemploymentRate1MonthNetChange', 'Statistics/BLS_Numbers/unemploymentRate1MonthNetChange', api);
	DataSet(api.Statistics, 'CES', 'Statistics/CES', api);
	DataSet(api.Statistics.CES, 'CE_DATATYPE', 'Statistics/CES/CE_DATATYPE', api);
	DataSet(api.Statistics.CES, 'CE_DATA_PUB', 'Statistics/CES/CE_DATA_PUB', api);
	DataSet(api.Statistics.CES, 'CE_FOOTNOTE', 'Statistics/CES/CE_FOOTNOTE', api);
	DataSet(api.Statistics.CES, 'CE_INDUSTRY', 'Statistics/CES/CE_INDUSTRY', api);
	DataSet(api.Statistics.CES, 'CE_SEASONAL', 'Statistics/CES/CE_SEASONAL', api);
	DataSet(api.Statistics.CES, 'CE_SERIES', 'Statistics/CES/CE_SERIES', api);
	DataSet(api.Statistics.CES, 'CE_SUPERSECTOR', 'Statistics/CES/CE_SUPERSECTOR', api);
	DataSet(api.Statistics, 'CEW', 'Statistics/CEW', api);
	DataSet(api.Statistics.CEW, 'EN_AREA', 'Statistics/CEW/EN_AREA', api);
	DataSet(api.Statistics.CEW, 'EN_DATA_PUB', 'Statistics/CEW/EN_DATA_PUB', api);
	DataSet(api.Statistics.CEW, 'EN_FOOTNOTE', 'Statistics/CEW/EN_FOOTNOTE', api);
	DataSet(api.Statistics.CEW, 'EN_INDUSTRY', 'Statistics/CEW/EN_INDUSTRY', api);
	DataSet(api.Statistics.CEW, 'EN_LQAREA', 'Statistics/CEW/EN_LQAREA', api);
	DataSet(api.Statistics.CEW, 'EN_OWNER', 'Statistics/CEW/EN_OWNER', api);
	DataSet(api.Statistics.CEW, 'EN_SERIES', 'Statistics/CEW/EN_SERIES', api);
	DataSet(api.Statistics.CEW, 'EN_SIZE', 'Statistics/CEW/EN_SIZE', api);
	DataSet(api.Statistics.CEW, 'EN_STATE', 'Statistics/CEW/EN_STATE', api);
	DataSet(api.Statistics.CEW, 'EN_TYPE', 'Statistics/CEW/EN_TYPE', api);
	DataSet(api.Statistics, 'CPI', 'Statistics/CPI', api);
	DataSet(api.Statistics.CPI, 'CU_AREA', 'Statistics/CPI/CU_AREA', api);
	DataSet(api.Statistics.CPI, 'CU_BASE', 'Statistics/CPI/CU_BASE', api);
	DataSet(api.Statistics.CPI, 'CU_DATA_PUB', 'Statistics/CPI/CU_DATA_PUB', api);
	DataSet(api.Statistics.CPI, 'CU_FOOTNOTE', 'Statistics/CPI/CU_FOOTNOTE', api);
	DataSet(api.Statistics.CPI, 'CU_ITEM', 'Statistics/CPI/CU_ITEM', api);
	DataSet(api.Statistics.CPI, 'CU_PERIODICITY', 'Statistics/CPI/CU_PERIODICITY', api);
	DataSet(api.Statistics.CPI, 'CU_SEASONAL', 'Statistics/CPI/CU_SEASONAL', api);
	DataSet(api.Statistics.CPI, 'CU_SERIES', 'Statistics/CPI/CU_SERIES', api);
	DataSet(api.Statistics, 'CPS', 'Statistics/CPS', api);
	DataSet(api.Statistics.CPS, 'LE_AGES', 'Statistics/CPS/LE_AGES', api);
	DataSet(api.Statistics.CPS, 'LE_BORN', 'Statistics/CPS/LE_BORN', api);
	DataSet(api.Statistics.CPS, 'LE_CLASS', 'Statistics/CPS/LE_CLASS', api);
	DataSet(api.Statistics.CPS, 'LE_DATA_PUB', 'Statistics/CPS/LE_DATA_PUB', api);
	DataSet(api.Statistics.CPS, 'LE_EARN', 'Statistics/CPS/LE_EARN', api);
	DataSet(api.Statistics.CPS, 'LE_EDUCATION', 'Statistics/CPS/LE_EDUCATION', api);
	DataSet(api.Statistics.CPS, 'LE_FIPS', 'Statistics/CPS/LE_FIPS', api);
	DataSet(api.Statistics.CPS, 'LE_FOOTNOTE', 'Statistics/CPS/LE_FOOTNOTE', api);
	DataSet(api.Statistics.CPS, 'LE_INDY', 'Statistics/CPS/LE_INDY', api);
	DataSet(api.Statistics.CPS, 'LE_LFST', 'Statistics/CPS/LE_LFST', api);
	DataSet(api.Statistics.CPS, 'LE_OCCUPATION', 'Statistics/CPS/LE_OCCUPATION', api);
	DataSet(api.Statistics.CPS, 'LE_ORIG', 'Statistics/CPS/LE_ORIG', api);
	DataSet(api.Statistics.CPS, 'LE_PCTS', 'Statistics/CPS/LE_PCTS', api);
	DataSet(api.Statistics.CPS, 'LE_RACE', 'Statistics/CPS/LE_RACE', api);
	DataSet(api.Statistics.CPS, 'LE_SEASONAL', 'Statistics/CPS/LE_SEASONAL', api);
	DataSet(api.Statistics.CPS, 'LE_SERIES', 'Statistics/CPS/LE_SERIES', api);
	DataSet(api.Statistics.CPS, 'LE_SEXS', 'Statistics/CPS/LE_SEXS', api);
	DataSet(api.Statistics.CPS, 'LE_TDATA', 'Statistics/CPS/LE_TDATA', api);
	DataSet(api.Statistics.CPS, 'LE_UNIN', 'Statistics/CPS/LE_UNIN', api);
	DataSet(api.Statistics, 'OES', 'Statistics/OES', api);
	DataSet(api.Statistics.OES, 'OE_AREA', 'Statistics/OES/OE_AREA', api);
	DataSet(api.Statistics.OES, 'OE_AREATYPE', 'Statistics/OES/OE_AREATYPE', api);
	DataSet(api.Statistics.OES, 'OE_DATATYPE', 'Statistics/OES/OE_DATATYPE', api);
	DataSet(api.Statistics.OES, 'OE_DATA_PUB', 'Statistics/OES/OE_DATA_PUB', api);
	DataSet(api.Statistics.OES, 'OE_FOOTNOTE', 'Statistics/OES/OE_FOOTNOTE', api);
	DataSet(api.Statistics.OES, 'OE_INDUSTRY', 'Statistics/OES/OE_INDUSTRY', api);
	DataSet(api.Statistics.OES, 'OE_OCCUGROUP', 'Statistics/OES/OE_OCCUGROUP', api);
	DataSet(api.Statistics.OES, 'OE_OCCUPATION', 'Statistics/OES/OE_OCCUPATION', api);
	DataSet(api.Statistics.OES, 'OE_RELEASE', 'Statistics/OES/OE_RELEASE', api);
	DataSet(api.Statistics.OES, 'OE_SEASONAL', 'Statistics/OES/OE_SEASONAL', api);
	DataSet(api.Statistics.OES, 'OE_SECTOR', 'Statistics/OES/OE_SECTOR', api);
	DataSet(api.Statistics.OES, 'OE_SERIES', 'Statistics/OES/OE_SERIES', api);
	DataSet(api.Statistics.OES, 'OE_STATEMSA', 'Statistics/OES/OE_STATEMSA', api);
	DataSet(api.Statistics, 'OES2010', 'Statistics/OES2010', api);
	DataSet(api.Statistics.OES2010, 'Seasonal', 'Statistics/OES2010/Seasonal', api);
	DataSet(api.Statistics.OES2010, 'area', 'Statistics/OES2010/area', api);
	DataSet(api.Statistics.OES2010, 'area_definitions', 'Statistics/OES2010/area_definitions', api);
	DataSet(api.Statistics.OES2010, 'areatype', 'Statistics/OES2010/areatype', api);
	DataSet(api.Statistics.OES2010, 'data', 'Statistics/OES2010/data', api);
	DataSet(api.Statistics.OES2010, 'datatype', 'Statistics/OES2010/datatype', api);
	DataSet(api.Statistics.OES2010, 'footnote', 'Statistics/OES2010/footnote', api);
	DataSet(api.Statistics.OES2010, 'industry', 'Statistics/OES2010/industry', api);
	DataSet(api.Statistics.OES2010, 'industry_titles', 'Statistics/OES2010/industry_titles', api);
	DataSet(api.Statistics.OES2010, 'occugroup', 'Statistics/OES2010/occugroup', api);
	DataSet(api.Statistics.OES2010, 'occupation', 'Statistics/OES2010/occupation', api);
	DataSet(api.Statistics.OES2010, 'occupation_definitions', 'Statistics/OES2010/occupation_definitions', api);
	DataSet(api.Statistics.OES2010, 'release', 'Statistics/OES2010/release', api);
	DataSet(api.Statistics.OES2010, 'sector', 'Statistics/OES2010/sector', api);
	DataSet(api.Statistics.OES2010, 'series', 'Statistics/OES2010/series', api);
	DataSet(api.Statistics.OES2010, 'statemsa', 'Statistics/OES2010/statemsa', api);
	DataSet(api.Statistics, 'OUI_InitialClaims', 'Statistics/OUI_InitialClaims', api);
	DataSet(api.Statistics.OUI_InitialClaims, 'unemploymentInsuranceInitialClaims', 'Statistics/OUI_InitialClaims/unemploymentInsuranceInitialClaims', api);
	DataSet(api.Statistics, 'PWSD', 'Statistics/PWSD', api);
	DataSet(api.Statistics.PWSD, 'esFinal', 'Statistics/PWSD/esFinal', api);
	DataSet(api.Statistics.PWSD, 'model', 'Statistics/PWSD/model', api);
	DataSet(api.Statistics.PWSD, 'recessionPeriods', 'Statistics/PWSD/recessionPeriods', api);
	DataSet(api.Statistics, 'REI', 'Statistics/REI', api);
	DataSet(api.Statistics.REI, 'researchEvaluationInventory', 'Statistics/REI/researchEvaluationInventory', api);
	DataSet(api.Statistics, 'WIA', 'Statistics/WIA', api);
	DataSet(api.Statistics.WIA, 'workforceInvestmentAct', 'Statistics/WIA/workforceInvestmentAct', api);
	DataSet(api.Statistics.WIA, 'workforceInvestmentActUi', 'Statistics/WIA/workforceInvestmentActUi', api);
	DataSet(api.Statistics.WIA, 'workforceInvestmentActWages', 'Statistics/WIA/workforceInvestmentActWages', api);
	DataSet(api, 'VETS100', 'VETS100/', api);
	DataSet(api.VETS100, 'V100ADataDotGov', 'VETS100/V100ADataDotGov', api);
	DataSet(api.VETS100, 'V100DataDotGov', 'VETS100/V100DataDotGov', api);

	
	return api;
}

exports.API = API;
exports.HttpError = HttpError;