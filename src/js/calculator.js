angular.module('PSC', []).
controller('CalculatorCtrl', ['$scope', function ($scope) {
	$scope.costKwh = .1;
	$scope.dailyUsageHours = 5;
	$scope.annualUsageDays = 260;
	$scope.bulbs = [];
	$scope.$watchGroup(['brightness', 'dailyUsageHours', 'annualUsageDays', 'costKwh'], changeUpdater);

	$scope.costValidator = function () {
		$scope.costKwh = $scope.costKwh.replace(',', '.');
	};

	$scope.arePredicatesValid =  function() {
		return $scope.brightness && isFinite($scope.annualUsageHours);
	};

	function updateResults() {
		var wattages = PSC.getWattages($scope.brightness);
		var bulbs = $scope.bulbs;
		['inc', 'hal', 'cfl', 'led'].forEach(function (type) {
			var
				power = wattages[type],
				consumption = Math.round($scope.annualUsageHours * power / 1000 * 100) / 100,
				cost = Math.round(consumption * $scope.costKwh * 100)/100,
				savings = (type !== 'inc' ? Math.round((bulbs.inc.cost - cost) / bulbs.inc.cost * 100) : 0);
			bulbs[type] = {
				power: power,
				consumption: consumption,
				cost: cost,
				savings: savings
			};
		});
	}

	function changeUpdater(newValues, oldValues, scope) {
		if (isFinite(newValues[1]) && isFinite(newValues[2]))
			scope.annualUsageHours = newValues[1] * newValues[2];
		else
			scope.annualUsageHours = " \u2014 ";
		if (isFinite(newValues[0]) && isFinite(scope.annualUsageHours) && isFinite(newValues[3]))
			updateResults();
	}

}]);
