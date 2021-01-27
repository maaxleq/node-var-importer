const path = require("path")
const fs = require("fs")
const YAML = require("yaml")

function Importer(dir, options={
    format: "json"
}){
    this.supportedFormats = ["json", "yml"]

    if (! this.supportedFormats.includes(options.format)){
        throw new Error("Not a supported file format : " + options.format)
    }

    this.directory = dir
    this.options = options

    this.import = function(filename){
        let resultObj;

        switch(this.options.format){

            case "json":
                resultObj = JSON.parse(fs.readFileSync(path.join(this.directory, filename + ".json"), "utf-8"))
                break

            case "yml":
                resultObj = YAML.parse(fs.readFileSync(path.join(this.directory, filename + ".yml"), "utf-8"))
                break
        }

        return resultObj
    }

    this.merge = function(obj1, obj2){
        return {...obj1, ...obj2}
    }

    this.append = function(obj1, obj2, property){
        let resultObj = {...obj1}
        resultObj[property] = {...obj2}

        return resultObj
    }

    this.importAndMerge = function(filename, obj){
        return this.merge(obj, this.import(filename))
    }

    this.importAndAppend = function(filename, obj, property){
        return this.append(obj, this.import(filename), property)
    }
}

function importer(dir, options={
    format: "json"
}){
    return new Importer(dir, options)
}

module.exports = importer