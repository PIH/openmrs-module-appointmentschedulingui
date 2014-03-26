var emr =  jasmine.createSpyObj('emr', ['errorMessage', 'navigateTo', 'message']);
describe('ScheduleAppointment tests', function() {
    var scope,
        mockAppointmentService,
        mockFilterFilter,
        mockDateRangePickerEventListener,
        mockNgGridPaginationFactory,
        deferred,
        promise;


    beforeEach(module('appointmentscheduling.scheduleAppointment'));
    beforeEach(inject(function($rootScope, $controller, $q) {
        deferred = $q.defer();
        promise = deferred.promise;
        mockAppointmentService = jasmine.createSpyObj('AppointmentService', ['getAppointmentTypes', 'getTimeSlots']);
        mockAppointmentService.getAppointmentTypes.andCallFake(function () { return promise; });
        mockAppointmentService.getTimeSlots.andCallFake(function () {return promise});

        mockFilterFilter = jasmine.createSpy('filterFilter');

        mockDateRangePickerEventListener = jasmine.createSpyObj('dateRangePickerEventListener', ['subscribe']);

        mockNgGridPaginationFactory = jasmine.createSpyObj('ngGridPaginationFactory', ['includePagination']);

        scope = $rootScope.$new();

        scope.pagingOptions = {
            pageSizes: [5,10,20],
            pageSize: 10,
            currentPage: 1
        };

        $controller('ScheduleAppointmentCtrl', {$scope: scope, AppointmentService: mockAppointmentService,
            filterFilter: mockFilterFilter, dateRangePickerEventListener: mockDateRangePickerEventListener,
            ngGridPaginationFactory: mockNgGridPaginationFactory});
    }));

    describe('it must get all appointment types', function () {
       it('should call getAppointmentTypes method from appointment server and update allAppointmentTypes with the result', function () {
           var appointmentTypes = ['type1', 'type2', 'type3'];

           deferred.resolve(appointmentTypes);
           scope.$apply();

           expect(mockAppointmentService.getAppointmentTypes).toHaveBeenCalled();
           expect(scope.allAppointmentTypes).toBe(appointmentTypes);
       });
    });

    it('must call the subscribe method from the dateRangePickerEventListener service when the controller is created', function () {
        expect(mockDateRangePickerEventListener.subscribe).toHaveBeenCalledWith(scope);
    });

    it('must set the current page to 1 when the filter text changes', function () {
        scope.pagingOptions.currentPage = 2;
        scope.filterText = "Test";
        scope.$apply();

        expect(scope.pagingOptions.currentPage).toBe(1);
    });

    describe('it must get all the appointments and apply filters', function () {
        it('should call getTimeSlots method from the appointment service and update the timeSlots field', function () {
            var appointment1 = {
                appointmentBlock: {
                    location: {display: "Achiv Santral"},
                    provider: {
                        person: {
                            display: "Unknown Provider"
                        }
                    }
                },
                dateFormatted: '2014-03-27T01:00:00.000-0300',
                startTimeFormatted: '2014-03-27T00:00:00.000-0300',
                endTimeFormatted: '2014-03-27T01:00:00.000-0300'
            };
            var appointment2  = {
                appointmentBlock: {
                    location: {display: "Bank Pou San"},
                    provider: {
                        person: {
                            display: "Unknown Provider"
                        }
                    }
                },
                dateFormatted: '2014-03-28T01:00:00.000-0300',
                startTimeFormatted: '2014-03-31T02:00:00.000-0300',
                endTimeFormatted: '2014-03-31T00:00:00.000-0300'};
            var appointments = [appointment1, appointment2];
            scope.appointmentType = {uuid: 1};
                scope.setPagingData = function(){};

            scope.findAvailableTimeSlots();
            deferred.resolve(appointments);
            scope.$apply();

            expect(mockAppointmentService.getTimeSlots).toHaveBeenCalled();
            expect(mockFilterFilter).toHaveBeenCalled();
            expect(scope.timeSlots).toBe(appointments);
        });
    });

});
