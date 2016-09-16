'use strict';
const config = require('config');
const Msgs = config.get('Msgs');
const express = require('express');
const bp = require('body-parser');
const routes = require('./routes');

function createApp() {
    const app = express();
    app.use(bp.raw());
    app.use(bp.json());
    app.use(config.OMA_DM.baseRoute, routes);
    app.Msgs = Msgs;
    app.config = config;
    return app;
}

module.exports = { createApp : createApp };
