/*!
 * ASP.NET SignalR JavaScript Library v2.3.0-rtm
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        // Use the actual user-provided callback as the "identity" value for the registration.
                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue), memberValue);
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['ProbeConfigWSSHub'] = this.createHubProxy('ProbeConfigWSSHub'); 
        proxies['ProbeConfigWSSHub'].client = { };
        proxies['ProbeConfigWSSHub'].server = {
            deregisterEquipment: function (EquipmentCode) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["DeregisterEquipment"], $.makeArray(arguments)));
             },

            deregisterUser: function (name) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["DeregisterUser"], $.makeArray(arguments)));
             },

            elevatorAlarmData: function (EquipmentCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ElevatorAlarmData"], $.makeArray(arguments)));
             },

            elevatorData: function (EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ElevatorData"], $.makeArray(arguments)));
             },

            elevatorFault: function (EquipmentCode) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ElevatorFault"], $.makeArray(arguments)));
             },

            elevatorLocation: function (EquipmentCode, Floor) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ElevatorLocation"], $.makeArray(arguments)));
             },

            elevatorMaintenance: function (EquipmentCode) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ElevatorMaintenance"], $.makeArray(arguments)));
             },

            elevatorStatusConfirm: function (EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ElevatorStatusConfirm"], $.makeArray(arguments)));
             },

            iOT01BAlarmData: function (EquipmentCode, SerialAndID, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BAlarmData"], $.makeArray(arguments)));
             },

            iOT01BDamageResult: function (DamageResult, EquipmentCode, Serial) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BDamageResult"], $.makeArray(arguments)));
             },

            iOT01BEncodeDirection: function (EquipmentCode, Serial, UserCode, Direction, isMoving) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BEncodeDirection"], $.makeArray(arguments)));
             },

            iOT01BFault: function (EquipmentCode, UserCode, Serial, Type, damage, Time) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BFault"], $.makeArray(arguments)));
             },

            iOT01BMovingSpeed: function (EquipmentCode, UserCode, Speed) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BMovingSpeed"], $.makeArray(arguments)));
             },

            iOT01BNotifySample: function (Serial) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BNotifySample"], $.makeArray(arguments)));
             },

            ioT01BReleaseAlarm: function (EquipmentCode) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IoT01BReleaseAlarm"], $.makeArray(arguments)));
             },

            ioT01BResetResult: function (Serial) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IoT01BResetResult"], $.makeArray(arguments)));
             },

            iOT01BResultData: function (EquipmentCode, SerialAndID, Data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BResultData"], $.makeArray(arguments)));
             },

            iOT01BResultEachData: function (EquipmentCode, SerialAndID, Data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BResultEachData"], $.makeArray(arguments)));
             },

            iOT01BSampleData: function (EquipmentCode, SerialAndID, Data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BSampleData"], $.makeArray(arguments)));
             },

            iOT01BSecFault: function (EquipmentCode, UserCode, Serial, Value, Degree, Time) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BSecFault"], $.makeArray(arguments)));
             },

            iOT01BSendLog: function (EquipmentCode, Probelog) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BSendLog"], $.makeArray(arguments)));
             },

            iOT01BUpdateAlarmTh: function (ProbeInf) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOT01BUpdateAlarmTh"], $.makeArray(arguments)));
             },

            iOTKeepAlive: function (UserCode, EquipmentCode, SerialAndID, result) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOTKeepAlive"], $.makeArray(arguments)));
             },

            iOTTestEquipment: function (SerialAndNumber) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["IOTTestEquipment"], $.makeArray(arguments)));
             },

            probeAlarmData: function (IPAddress, SerialAndNum, EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeAlarmData"], $.makeArray(arguments)));
             },

            probeBaseValue: function (IPAddress, SerialAndNum, EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeBaseValue"], $.makeArray(arguments)));
             },

            probeConfirm: function (IPAddress, SerialAndNum, EquipmentCode, UserCode, result) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeConfirm"], $.makeArray(arguments)));
             },

            probeKeepalive: function (IPAddress, SerialAndNum, EquipmentCode, UserCode) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeKeepalive"], $.makeArray(arguments)));
             },

            probeOnline: function (id) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeOnline"], $.makeArray(arguments)));
             },

            probeSampleFre: function (IPAddress, SerialAndNum, EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeSampleFre"], $.makeArray(arguments)));
             },

            probeSensorData: function (IPAddress, SerialAndNum, EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeSensorData"], $.makeArray(arguments)));
             },

            probeStatus: function (IPAddress, SerialAndNum, EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeStatus"], $.makeArray(arguments)));
             },

            probeSystemPara: function (IPAddress, SerialAndNum, EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeSystemPara"], $.makeArray(arguments)));
             },

            probeWorkingPara: function (IPAddress, SerialAndNum, EquipmentCode, UserCode, data) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["ProbeWorkingPara"], $.makeArray(arguments)));
             },

            registerEquipment: function (EquipmentCode) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["RegisterEquipment"], $.makeArray(arguments)));
             },

            registerServer: function () {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["RegisterServer"], $.makeArray(arguments)));
             },

            registerUser: function (name) {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["RegisterUser"], $.makeArray(arguments)));
             },

            setFlag: function () {
                return proxies['ProbeConfigWSSHub'].invoke.apply(proxies['ProbeConfigWSSHub'], $.merge(["SetFlag"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));