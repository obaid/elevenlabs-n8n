import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ResembleApi implements ICredentialType {
	name = 'resembleApi';
	displayName = 'Resemble AI API';
	documentationUrl = 'https://docs.app.resemble.ai/docs/1.0.0/authentication/';
	properties: INodeProperties[] = [
		{
			displayName: 'Resemble API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Token token={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest | undefined = {
		request: {
			baseURL: 'https://app.resemble.ai/api/v2',
			url: '/voices',
		},
	};
}
