define(['angular'], function(angular) {
    'use strict';

    angular.module('editCtrl', ['flow'])
    .config('editConfig')
    .controller('editCtrl', editCtrl);

    //="{singleFile:true}"

    editConfig.$inject = ['flowFactoryProvider'];
    function editConfig(flowFactoryProvider) {
      flowFactoryProvider.defaults = {
        target: 'upload.php',
        permanentErrors: [404, 500, 501],
        maxChunkRetries: 1,
        chunkRetryInterval: 5000,
        simultaneousUploads: 4,
        singleFile: true
    };
}

editCtrl.$inject = ['$flow'];
function editCtrl($flow) {


}
})