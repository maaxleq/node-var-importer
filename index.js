const path = require("path")
const fs = require("fs")
const YAML = require("yaml")

function Loader(dir, options={
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

    this.importAndMerge = function(filename, obj){
        return {...obj, ...this.import(filename)}
    }

    this.importAndAppend = function(filename, obj, property){
        let resultObj = {...obj}
        resultObj[property] = this.import(filename)

        return resultObj
    }
}

module.exports = Loader