#!/usr/bin/env node
const fs = require('fs')
const program = require('commander')
const filesizeParser = require('filesize-parser')
const httpfs = require('./lib.js')

program
    .version('0.0.1')
    .option('-q, --quiet')
    .option('-t, --timeout <seconds>')
    .option('--attrcache')
    .option('--cache')
    .option('--blocksize <bytes>')
    .option('--nocache <pattern>')
    .option('--certraw <certificate>')
    .option('--certfile <certificate-filename>')
    .option('--debuglog <debug-log-filename>')
    .arguments('<endpoint> <mountpoint>')
    .action((endpoint, mountpoint, options) => {
        if (options.certraw) {
            options.certificate = options.certraw
        } else if (options.certfile) {
            options.certificate = fs.readFileSync(options.certfile)
        }
        if (options.blocksize) {
            options.blocksize = filesizeParser(options.blocksize)
        }
        if (options.nocache) {
            options.nocache = options.nocache.split(',')
        }
        httpfs.mount(endpoint, mountpoint, options, (err, mount) => {
            if (err) {
                if (err) throw err
            }
            process.on('SIGINT', () => mount.unmount())
            process.on('SIGTERM', () => mount.unmount())
        })
    })
    .parse(process.argv)