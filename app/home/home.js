app.controller('HomeController', ['$scope', 'castApi', function ($scope, castApi) {

    $scope.alerts = {};

    function onInitSuccess() {
        $scope.alerts.success = castApi.CASTAPI_CONNECTION_SUCCESS;
        $scope.$apply();
    }

    function onInitError(e) {
        $scope.alerts.error = castApi.CASTAPI_CONNECTION_ERROR;
        $scope.$apply();
    }

    function cast() {

        if ($scope.mediaUrl == undefined) {
            return;
        }
        
        castApi.loadMedia($scope.mediaUrl);
    }

    castApi.initializeApi(onInitSuccess, onInitError);
    $scope.cast = cast;
}]);