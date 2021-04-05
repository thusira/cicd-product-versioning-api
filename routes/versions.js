var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var ProductVersion = require('../models/product-version');


router.get('/:env/current', function (req, res, next) {
    ProductVersion.findOne({ isCurrent: true , environment: req.params.env }, function (err, version) {
        if (err)
            res.status(500).send(err);
        res.json(version);
    });
});

router.get('/:env/:versionNumber', function (req, res, next) {
    ProductVersion.findOne({ productVersion: req.params.versionNumber , environment: req.params.env}, function (err, version) {
        if (err)
            res.status(500).send(err);
            if(version){
                res.json(version);
            } else {
                res.status(404);
                res.json({ "error": "version not available" });
            }
    });
});

router.get('/services/:env/:versionNumber', function (req, res, next) {
    ProductVersion.findOne({ productVersion: req.params.versionNumber , environment: req.params.env}, function (err, version) {
        if (err)
            res.status(500).send(err);
            if(version){
                res.json(JSON.parse(version.servicesJson));
            } else {
                res.status(404);
                res.json({ "error": "version not available" });
            }
    });
});

router.post('/increment', function (req, res, next) {
    try {
        var pipeline_data = req.body;
        if (!pipeline_data.module || !pipeline_data.incremented_version) {
            res.status(400);
            res.json({ "error": "Bad request data" });
        } else {
            //save in services log table

            //find latest increment product version
            ProductVersion.findOne({ isCurrent: true ,environment: 'DEV'}, function (err, version) {
                if (err) {
                    console.error("Error occurred while retrieving the current product version", err);
                    res.sendStatus(500);
                } else {
                    if (version) {
                        var parts = version.productVersion.split('-');
                        var nextBuildNumber = parseInt(parts[1]) + 1;
                        var newBuildNumber = parts[0] + "-" + nextBuildNumber;
                        //edit json
                        var servicesJson;
                        if (version.servicesJson) {
                            servicesJson = JSON.parse(version.servicesJson);
                            var select = servicesJson.services.find(v => v.serviceName == pipeline_data.module);
                            if (select) {
                                select.version = pipeline_data.incremented_version;
                                select.lastUpdatedDate = Date.now();
                            } else {
                                res.status(404);
                                res.json({ "error": "Module cannot be found in services json." });
                                return;
                            }
                        }

                        //save the new version as current.
                        var newProductVersion = new ProductVersion({
                            productVersion: newBuildNumber,
                            isCurrent: true,
                            environment: "DEV",
                            servicesJson: JSON.stringify(servicesJson),
                            triggeredModule: pipeline_data.module,
                            createdDate: Date.now()
                        });
                        newProductVersion.save(function (err, savedNewVersion) {
                            if (err) {
                                console.error("Error occured saving the new version", err);
                                res.send(err);
                            } else {
                                console.log("New version saved ", savedNewVersion);
                                ProductVersion.findOneAndUpdate({ _id: version._id }, {
                                    $set: {
                                        "isCurrent": false
                                    }
                                }, { upsert: false, new: true }, function (err, previousVersion) {
                                    if (err) throw error;
                                    console.log("Make previous version obsolete. ", previousVersion);
                                    console.log("increment product version completed");
                                    res.status(201).json(savedNewVersion);
                                });
                            }
                        });


                    } else {
                        res.status(404);
                        res.json({ "error": "Current product version not available" });
                    }
                }
            });
        }
    } catch (error) {
        throw error;
    }
});

router.post('/seed', function (req, res, next) {

    var newProductVersion = new ProductVersion({
        productVersion: "1.0.169-0",
        isCurrent: true,
        environment: "DEV",
        servicesJson: JSON.stringify(JSON.parse(fs.readFileSync('resources/services.json'))),
        createdDate: Date.now()
    });
    newProductVersion.save(function (err, savedNewVersion) {
        if (err) {
            console.error("Error occured creating seed", err);
            res.status(500).send(err);
        } else {
            console.log("seed version saved ", savedNewVersion);
            res.status(201).json(savedNewVersion);
        }
    });
});

router.post('/module/:env/add/:name/version/:version', function (req, res, next) {
    ProductVersion.findOne({ isCurrent: true, environment: req.params.env }, function (err, version) {
        if (err)
            res.status(500).send(err);
        if(version){
            var servicesJson = JSON.parse(version.servicesJson);
            var newModule = {
                serviceName: req.params.name,
                version: req.params.version,
                lastUpdatedDate: Date.now()
            };
            servicesJson.services.push(newModule);
            ProductVersion.findOneAndUpdate({ _id: version._id }, {
                $set: {
                    "servicesJson": JSON.stringify(servicesJson)
                }
            }, { upsert: false, new: true }, function (err, changed) {
                if (err) throw err;
                console.log("New module added.", changed);
                res.status(201).json(changed);
            });
        } else {
            res.status(404);
            res.json({ "error": "Current product version not available" });
        }
    });
});

module.exports = router;