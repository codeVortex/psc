angular.module('PSC', []).
controller('CalculatorCtrl', ['$scope', '$log', function ($scope, $log) {
	$scope.costKwh = .1;
	$scope.dailyUsageHours = 5;
	$scope.annualUsageDays = 260;
	$scope.bulbs = [];
	$scope.$watchGroup(['brightness', 'dailyUsageHours', 'annualUsageDays'], changeUpdater);

	$scope.costValidator = function () {
		$scope.costKwh.replace(',', '.')
	};

	function updateResults() {
		var wattages = PSC.getWattages($scope.brightness);
		var bulbs = $scope.bulbs;
		['inc', 'hal', 'cfl', 'led'].forEach(function (type) {
			var
				power = wattages[type],
				consumption = $scope.annualUsageHours * power / 1000,
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
		scope.annualUsageHours = newValues[1] * newValues[2];
		if (isFinite(newValues[0]) && isFinite(scope.annualUsageHours))
			updateResults();
	}

}]);
