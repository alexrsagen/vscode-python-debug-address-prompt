'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// Register configuration provider for all debug types
	const provider = new AddressPromptProvider();
	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('python', provider));
}

class AddressPromptProvider implements vscode.DebugConfigurationProvider {

	/**
	 * Prompt user for host/port if they are not specified in the
	 * debug configuration
	 */
	resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {
		if (!config.host || !config.port) {
			return vscode.window.showInputBox({
				placeHolder: 'localhost:1337',
				prompt: 'Enter debugging host:port',
				value: (config.host || '') + ':' + (config.port || '')
			}).then((input: string | undefined) => {
				if (input === undefined) {
					return config;
				}

				config.host = input.substr(0, input.indexOf(':'));
				config.port = parseInt(input.substr(config.host.length + 1), 10);

				return config;
			});
		}

		return config;
	}

}
