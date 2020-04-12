function calculateInfectionsByRequestedTime(currentlyInfected, timeToElapse) {
  return currentlyInfected * 2 ** Math.floor(timeToElapse / 3);
}

const calculateHospitalBedsByRequestedTime = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const availableHospitalBeds = totalHospitalBeds * 0.35;
  const futureBeds = availableHospitalBeds -  - severeCasesByRequestedTime;
  return Math.floor(futureBeds);
}

const calculateDollarsInFlight = (infectionsByRequestedTime, percentage, avgDailyIncome, timeToElapse) => {
  const dollarsInFlight = infectionsByRequestedTime * percentage * avgDailyIncome / timeToElapse;
  return Math.floor(dollarsInFlight);
}

const covid19ImpactEstimator = (data) => {
    //don't forget to remove the nodejs test
    /* data = {
        region: {
            name: "Africa",
            avgAge: 19.7,
            avgDailyIncomeInUSD: 5,
            avgDailyIncomePopulation: 0.71
        },
        periodType: "days",
        timeToElapse: 58,
        reportedCases: 674,
        population: 66622705,
        totalHospitalBeds: 1380614
    } */

  const output = {};

  output.data = data;

  if (data.periodType === 'weeks') data.timeToElapse = data.timeToElapse * 7;
  if (data.periodType === 'months') data.timeToElapse = data.timeToElapse * 30;

  const impact = {
    currentlyInfected: data.reportedCases * 10
  };

  impact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(impact.currentlyInfected, data.timeToElapse);
  impact.severeCasesByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.15);
  impact.hospitalBedsByRequestedTime = calculateHospitalBedsByRequestedTime(data.totalHospitalBeds, impact.severeCasesByRequestedTime);
  impact.casesForICUByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.05);
  impact.casesForVentilatorsByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.02);
  impact.dollarsInFlight = calculateDollarsInFlight(impact.infectionsByRequestedTime, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, data.timeToElapse);

  const severeImpact = {
    currentlyInfected: data.reportedCases * 50
  }

  severeImpact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(severeImpact.currentlyInfected, data.timeToElapse);
  severeImpact.severeCasesByRequestedTime = Math.floor(severeImpact.infectionsByRequestedTime * 0.15);
  severeImpact.hospitalBedsByRequestedTime = calculateHospitalBedsByRequestedTime(data.totalHospitalBeds, severeImpact.severeCasesByRequestedTime);
  severeImpact.casesForICUByRequestedTime = Math.floor(severeImpact.infectionsByRequestedTime * 0.05);
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(severeImpact.infectionsByRequestedTime * 0.02);
  severeImpact.dollarsInFlight = calculateDollarsInFlight(severeImpact.infectionsByRequestedTime, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, data.timeToElapse);
  
  output.impact = impact;

  output.severeImpact = severeImpact;

  return output;
};

export default covid19ImpactEstimator;
