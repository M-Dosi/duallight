const { createUnlighthouse } = require('@unlighthouse/core');

function generateConfig(customConfig){
    const config =  {
        ...customConfig,
        outputPath: './public/reports',
    };

    return config;
};

function createConfigFile(urls, device){
 const content = generateConfig(urls, device);
return content;
}

module.exports = {
    createConfigFile,
    createUnlighthouse
};