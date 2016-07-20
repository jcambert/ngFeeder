
angular.module('compareTo',[])
.directive('compareTo',function(){
    return{
        restrict:'A',
        require: 'ngModel',
        scope:
            {
                otherModelValue:'=compareTo'
            },
        link:function(scope,element,attrs,ngModel){
            ngModel.$validators.compareTo = function(modelValue){
                return modelValue == scope.otherModelValue;
            }
            scope.$watch("otherModelValue",function(){ngModel.$validate();});
        }
    }
})