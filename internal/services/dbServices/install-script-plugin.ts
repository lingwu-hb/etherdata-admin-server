import { DatabasePlugin } from "../../../server/plugin/basePlugin";
import { PluginName } from "../../../server/plugin/pluginName";
import { Model } from "mongoose";
import {
  InstallationTemplateModel,
  IInstallationTemplate,
} from "../dbSchema/install-script/install-script";
import YAML from "yaml";

/**
 * Installation template plugin
 */
export class InstallScriptPlugin extends DatabasePlugin<IInstallationTemplate> {
  pluginName: PluginName = "installScript";
  protected model: Model<IInstallationTemplate> = InstallationTemplateModel;

  /**
   * Generate a docker-compose file based on the installation template
   * @param{IInstallationTemplate} installationTemplate
   * @return {string} generated docker compose file in yaml format
   */
  generateDockerComposeFile(
    installationTemplate: IInstallationTemplate
  ): string {
    const deepCopiedTemplate = JSON.parse(JSON.stringify(installationTemplate));
    delete deepCopiedTemplate.created_by;
    delete deepCopiedTemplate.template_tag;

    return YAML.stringify(deepCopiedTemplate);
  }
}
