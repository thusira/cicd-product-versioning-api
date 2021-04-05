var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var ProductVersion = require('../models/product-version');

router.post('/make', function (req, res, next) {
    try {
        var release_data = req.body;
        if (!release_data.release_version || !release_data.from_env || !release_data.to_env || !release_data.source_version) {
            res.status(400);
            res.json({ "error": "Bad request data" });
        } else {
            ProductVersion.findOne({ productVersion: release_data.source_version, environment: release_data.from_env }, function (err, baseVersion) {
                if (err) {
                    console.error("Error occurred while retrieving the product version", err);
                    res.sendStatus(500);
                } else {
                    if (baseVersion) {
                        console.log("version found");
                        //QA version to isCurrent = false;
                        ProductVersion.update({environment: release_data.to_env}, { $set: { isCurrent: false  }}, {multi: true}, function(err, response){
                            console.log(response);
                            //insert the released version.
                            var newReleaseVersion = new ProductVersion({
                                productVersion: release_data.release_version,
                                isCurrent: true,
                                environment: release_data.to_env,
                                servicesJson: baseVersion.servicesJson,
                                basedOn: release_data.source_version,
                                createdDate: Date.now()
                            });
                            newReleaseVersion.save(function (err, newReleaseVersion) {
                                if (err) {
                                    console.error("Error occured saving the new version", err);
                                    res.status(500);
                                    res.send(err);
                                } else {
                                    console.log("New version saved ", newReleaseVersion);
                                    res.json(newReleaseVersion);
                                }
                            });
                        });
                    } else {
                        res.status(404);
                        res.json({ "error": "Given product version not available" });
                    }
                }
            });
        }
    } catch (error) {
        throw error;
    }
});

module.exports = router;