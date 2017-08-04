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
                    height: '475px',
                    plotShadow: false,
                    type: 'pie'
                },
                colors: ['#4392F1', '#34495E', '#1ABC9C', '#434348'],
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
                }],
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '<b>{point.formatted}</b>'
                }
            }
        }
    }

});
