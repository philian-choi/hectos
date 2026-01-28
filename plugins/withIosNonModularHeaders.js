const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withIosNonModularHeaders = (config) => {
    return withDangerousMod(config, [
        'ios',
        async (config) => {
            const podfilePath = path.join(config.modRequest.projectRoot, 'ios', 'Podfile');
            let podfileContent = fs.readFileSync(podfilePath, 'utf8');

            // post_install 블록에 설정 추가
            const buildSettingsFix = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end`;

            if (podfileContent.includes('post_install do |installer|')) {
                if (!podfileContent.includes('CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
                    podfileContent = podfileContent.replace(
                        /post_install do \|installer\|/,
                        `post_install do |installer|${buildSettingsFix}`
                    );
                }
            }

            fs.writeFileSync(podfilePath, podfileContent);
            return config;
        },
    ]);
};

module.exports = withIosNonModularHeaders;
