define([
    'angular'
], function (angular) {
    'use strict';

    angular.module('log.pieChartOptions', [])
    .factory('pieChartOptions', pieChartOptions);

    function pieChartOptions() {
        return function (options) {
            return {
                chart: {
                    height: 350,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: options.title
                },
                tooltip: {
                    pointFormat: '<b>{point.formatted}</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white',
                                width: '75px'
                            },
                            format: '<b>{point.percentage:.1f}%</b>' 
                        }
                    }
                },
                series: [{
                    name: options.name,
                    data: options.series
                }]
            }
        }
    }

});