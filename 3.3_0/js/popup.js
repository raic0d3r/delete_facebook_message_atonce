var url = "https://raw.githubusercontent.com/raic0d3r/delete_facebook_message_atonce/main/key.txt";
var currentTab;

$(document).ready(function() {
    var query = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(query, function(tabs) {
        currentTab = tabs[0];
        if (currentTab.url.match(/facebook.com\/messages|facebook.com\/latest\/inbox/i)) {
            $("#aa").show();
        } else {
            $("#bb").show();
        }
    });
});



var app = angular.module("myapp", []);
var headers = {
    "content-type": "application/x-www-form-urlencoded"
};

app.controller("ctrl", function($scope, $http, $q, $filter) {

    var s = $scope;

    if (!localStorage.trial) {
        s.license = true;
        s.trialStarted = true;
    }

    s.verify_license = function(key) {
        if (key) {
            $scope.error = false;
            // Check if the key is available in the fetched text
            $http.get(url).then(function(response) {
                var keys = response.data.split("\n"); // Assuming each key is on a new line
                if (keys.includes(key.trim())) {
                    $scope.license = true;
                    chrome.storage.local.set({
                        license_key: key
                    });
                    // License is found, perform additional actions if needed
                } else {
                    $scope.error = true;
                    // License key not found
                }
            }).catch(function(error) {
                console.error("Error fetching license keys:", error);
                $scope.error = true;
            });
        }
    }


    chrome.storage.local.get("license_key", function(l) {
        var k = l.license_key;
        if (k) {
            $scope.$apply(function() {
                $scope.license = true;
            })
        }
    });


    s.delete = function() {
        chrome.tabs.executeScript(null, {
                file: "js/jquery.min.js"
            },
            function(results) {
                var file = "js/fb.js";
                if (currentTab.url.match(/facebook\.com\/latest\/inbox/i)) {
                    file = "js/fbpage.js";
                }
                chrome.tabs.executeScript(null, {
                    file: file
                }, function() {
                    window.close();

                    localStorage.trial = "false";
                })


            });
    }


    s.archive = function() {

        chrome.tabs.executeScript(null, {
                file: "js/jquery.min.js"
            },
            function(results) {

                chrome.tabs.executeScript(null, {
                    file: "js/archive.js"
                }, function() {
                    window.close();
                    localStorage.trial = "false";
                })
            })
    }

    s.unArchive = function() {

        chrome.tabs.executeScript(null, {
                file: "js/jquery.min.js"
            },
            function(results) {

                chrome.tabs.executeScript(null, {
                    file: "js/unarchive.js"
                }, function() {
                    window.close();
                    localStorage.trial = "false";
                })
            })
    }

});
