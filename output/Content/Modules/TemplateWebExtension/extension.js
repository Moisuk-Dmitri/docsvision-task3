define(['tslib', '@docsvision/webclient/System/$MessageBox', '@docsvision/webclient/System/ExtensionManager'], (function (tslib, $MessageBox, ExtensionManager) { 'use strict';

    var ApplicationBusinessTripLogic = /** @class */ (function () {
        function ApplicationBusinessTripLogic() {
        }
        ApplicationBusinessTripLogic.prototype.supervisorCheckConfirmed = function (layout) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var staffCtrl;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            staffCtrl = layout.controls.tryGet("coordinatingPerson");
                            if (!(staffCtrl.params.value == null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showError('Поле Согласующий пустое!')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, false];
                        case 2: return [2 /*return*/, true];
                    }
                });
            });
        };
        ApplicationBusinessTripLogic.prototype.updateStartDateByEndDate = function (startDateCtrl) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var layout, endDateCtrl;
                return tslib.__generator(this, function (_a) {
                    layout = startDateCtrl.layout;
                    endDateCtrl = layout.controls.tryGet("endDate");
                    if (startDateCtrl.params.value >= endDateCtrl.params.value && endDateCtrl.params.value != null) {
                        startDateCtrl.params.value = null;
                    }
                    return [2 /*return*/];
                });
            });
        };
        ApplicationBusinessTripLogic.prototype.updateEndDateByStartDate = function (endDateCtrl) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var layout, startDateCtrl;
                return tslib.__generator(this, function (_a) {
                    layout = endDateCtrl.layout;
                    startDateCtrl = layout.controls.tryGet("startDate");
                    if (endDateCtrl.params.value <= startDateCtrl.params.value && startDateCtrl.params.value != null) {
                        endDateCtrl.params.value = null;
                    }
                    return [2 /*return*/];
                });
            });
        };
        ApplicationBusinessTripLogic.prototype.printMainInfo = function (buttonCtrl) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var layout, cityId, cityName, url, name, dateOfCreation, startDate, endDate, tripReason;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            layout = buttonCtrl.layout;
                            cityId = layout.controls.tryGet("cityRow").params.value.id;
                            url = "http://dvappserver.engineer.school:5004/api/v1/cards/4538149D-1FC7-4D41-A104-890342C6B4F8/1b1a44fb-1fb1-4876-83aa-95ad38907e24/" + cityId;
                            return [4 /*yield*/, fetch(url, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                })
                                    .then(function (response) { return response.json(); })
                                    .then(function (data) {
                                    var nameField = data.data.fields.find(function (field) { return field.alias === "Name"; });
                                    cityName = nameField ? nameField.value : null;
                                })
                                    .catch(function (error) { return console.error('Error: fetch cityName was not completed', error); })];
                        case 1:
                            _a.sent();
                            name = layout.controls.tryGet("titleTextBox");
                            dateOfCreation = layout.controls.tryGet("date");
                            startDate = layout.controls.tryGet("startDate");
                            endDate = layout.controls.tryGet("endDate");
                            tripReason = layout.controls.tryGet("reason");
                            if (!(!name.params.value ||
                                dateOfCreation.params.value == null ||
                                startDate.params.value == null ||
                                endDate.params.value == null ||
                                !tripReason.params.value ||
                                !cityName)) return [3 /*break*/, 3];
                            return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showError('Информация не заполнена!')];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                        case 3: return [4 /*yield*/, layout.getService($MessageBox.$MessageBox).showInfo('Имя: ' + name.params.value + '\n' +
                                'Дата создания: ' + dateOfCreation.params.value.toLocaleDateString('ru-RU') + '\n' +
                                'Дата с: ' + startDate.params.value.toLocaleDateString('ru-RU') + '\n' +
                                'Дата по: ' + endDate.params.value.toLocaleDateString('ru-RU') + '\n' +
                                'Основание для поездки: ' + tripReason.params.value + '\n' +
                                'Название города: ' + cityName)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ApplicationBusinessTripLogic;
    }());

    /**
     * Событие во время сохранения карточки
     * @param layout разметка
     * @param args аргументы
     */
    function ddApplicationBusinessTrip_cardSaving(layout, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!layout) {
                            return [2 /*return*/];
                        }
                        logic = new ApplicationBusinessTripLogic();
                        args.wait();
                        return [4 /*yield*/, logic.supervisorCheckConfirmed(layout)];
                    case 1:
                        if (!(_a.sent())) {
                            args.cancel();
                            return [2 /*return*/];
                        }
                        args.accept();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Событие во время сохранения карточки
     * @param sender контрол
     * @param args аргументы
     */
    function ddApplicationBusinessTrip_onDataChanged(sender, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sender) {
                            return [2 /*return*/];
                        }
                        logic = new ApplicationBusinessTripLogic();
                        if (!(sender.params.name == "startDate")) return [3 /*break*/, 2];
                        return [4 /*yield*/, logic.updateStartDateByEndDate(sender)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(sender.params.name == "endDate")) return [3 /*break*/, 4];
                        return [4 /*yield*/, logic.updateEndDateByStartDate(sender)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    /**
    * Событие во время сохранения карточки
    * @param sender разметка
    */
    function ddApplicationBusinessTrip_OnClick(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sender) {
                            return [2 /*return*/];
                        }
                        logic = new ApplicationBusinessTripLogic();
                        return [4 /*yield*/, logic.printMainInfo(sender)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }

    var ApplicationBusinessTripHandlers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ddApplicationBusinessTrip_cardSaving: ddApplicationBusinessTrip_cardSaving,
        ddApplicationBusinessTrip_onDataChanged: ddApplicationBusinessTrip_onDataChanged,
        ddApplicationBusinessTrip_OnClick: ddApplicationBusinessTrip_OnClick
    });

    //import * as Feature1Handlers from "./Feature1/Action1EventHandler";
    //import { Service } from "@docsvision/web/core/services";
    //import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
    //import { $Feature1 } from "./Feature1/$Feature1";
    //import { Feature1Service } from "./Feature1/$Feature1Service";
    //import { Control1 } from "./Feature1/Control1";
    // Главная входная точка всего расширения
    // Данный файл должен импортировать прямо или косвенно все остальные файлы, 
    // чтобы rollup смог собрать их все в один бандл.
    // Регистрация расширения позволяет корректно установить все
    // обработчики событий, сервисы и прочие сущности web-приложения.
    ExtensionManager.extensionManager.registerExtension({
        name: "TemplateWebExtension",
        version: "1.0",
        globalEventHandlers: [ApplicationBusinessTripHandlers],
        layoutServices: [
        //    Service.fromFactory($Feature1, (services: $RequestManager) => new Feature1Service(services))
        ],
        controls: [
        //    { controlTypeName: "Control1", constructor: Control1 }
        ]
    });

}));
//# sourceMappingURL=extension.js.map
