const { getConfig } = require('@expo/config');
const path = require('path');

try {
    const config = getConfig(path.resolve('.'), {
        skipSDKVersionRequirement: false,
        isModdedConfig: true,
    });
    console.log('Config loaded successfully');
    console.log(JSON.stringify(config.exp, null, 2));
} catch (e) {
    console.error('Failed to load config:');
    console.error(e);
    process.exit(1);
}
