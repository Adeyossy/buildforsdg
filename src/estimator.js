function calcIBRT(currentlyInfected, timeToElapse) {
  return currentlyInfected * 2 ** Math.floor(timeToElapse / 3);
}

const calcHBBRT = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const availableHospitalBeds = totalHospitalBeds * 0.35;
  const futureBeds = availableHospitalBeds - severeCasesByRequestedTime;
  return Math.floor(futureBeds);
};

const calcDIF = (infectnsByRqstdTm, percent, avgDailyIncome, timeToElapse) => {
  const dollarsInFlight = (infectnsByRqstdTm * percent * avgDailyIncome) / timeToElapse;
  return Math.floor(dollarsInFlight);
};

const covid19ImpactEstimator = (data) => {
  const output = {};

  output.data = data;

  if (data.periodType === 'weeks') data.timeToElapse *= 7;
  if (data.periodType === 'months') data.timeToElapse *= 30;

  const impact = {
    currentlyInfected: data.reportedCases * 10
  };

  impact.infectionsByRequestedTime = calcIBRT(impact.currentlyInfected, data.timeToElapse);
  impact.severeCasesByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.15);
  impact.hospitalBedsByRequestedTime = calcHBBRT(data.totalHospitalBeds,
    impact.severeCasesByRequestedTime);
  impact.casesForICUByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.05);
  impact.casesForVentilatorsByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.02);
  const avgDly = data.region.avgDailyIncomePopulation;
  const money = data.region.avgDailyIncomeInUSD;
  impact.dollarsInFlight = calcDIF(impact.infectionsByRequestedTime,
    avgDly, money, data.timeToElapse);

  const severeImpact = {
    currentlyInfected: data.reportedCases * 50
  };

  severeImpact.infectionsByRequestedTime = calcIBRT(severeImpact.currentlyInfected,
    data.timeToElapse);
  const value0 = severeImpact.infectionsByRequestedTime;
  severeImpact.severeCasesByRequestedTime = Math.floor(value0 * 0.15);
  severeImpact.hospitalBedsByRequestedTime = calcHBBRT(data.totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime);
  const valueVal = severeImpact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForICUByRequestedTime = Math.floor(valueVal);
  const value1 = severeImpact.infectionsByRequestedTime * 0.02;
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(value1);
  severeImpact.dollarsInFlight = calcDIF(severeImpact.infectionsByRequestedTime,
    data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, data.timeToElapse);

  output.impact = impact;

  output.severeImpact = severeImpact;

  return output;
};

export default covid19ImpactEstimator;
