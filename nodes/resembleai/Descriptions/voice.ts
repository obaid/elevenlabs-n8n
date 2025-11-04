import {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export const VoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a voice',
				description: 'Returns metadata about a specific voice',
				routing: {
					request: {
						method: 'GET',
						url: '={{"/voices/"  + $parameter["voice"] }}',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'item',
								},
							},
							{
								type: 'setKeyValue',
								enabled: '={{$parameter["simplify"]}}',
								properties: {
									uuid: '={{$responseItem.uuid}}',
									name: '={{$responseItem.name}}',
									status: '={{$responseItem.status}}',
									voice_type: '={{$responseItem.voice_type}}',
									default_language: '={{$responseItem.default_language}}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many voices',
				// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-description-wrong-for-get-many
				description: 'Returns metadata about all voices',
				routing: {
					request: {
						method: 'GET',
						url: '/voices',
						qs: {
							page_size: '={{$parameter["limit"]}}',
							page: '={{$parameter["page"] || 1}}',
						},
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'items',
								},
							},
							{
								type: 'setKeyValue',
								enabled: '={{$parameter["simplify"]}}',
								properties: {
									uuid: '={{$responseItem.uuid}}',
									name: '={{$responseItem.name}}',
									status: '={{$responseItem.status}}',
									voice_type: '={{$responseItem.voice_type}}',
									default_language: '={{$responseItem.default_language}}',
								},
							},
						],
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a voice',
				description: 'Create a new voice (rapid or professional clone)',
				routing: {
					send: {
						preSend: [ preSendCreateVoice ],
					},
					request: {
						url: '/voices',
						method: 'POST',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'item',
								},
							},
						],
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a voice',
				description: 'Delete a specific voice',
				routing: {
					request: {
						url: '={{"/voices/" + $parameter["voice"]}}',
						method: 'DELETE',
					},
				},
			},
		],
		default: 'get',
		displayOptions: {
			show: {
				resource: ['voice'],
			},
		},
	}
]

export const VoiceFields: INodeProperties[] = [
	{
		displayName: 'Voice',
		description: 'The voice you want to use',
		name: 'voice',
		type: 'resourceLocator',
		default: { mode: 'list', value: null },
		displayOptions: {
			show: {
				resource: ['voice'],
				operation: ['delete', 'get'],
			},
		},
		modes: [
			{
				displayName: 'From list',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'listVoices',
					searchable: true,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: '1ab233c4-5d67-8ef9-0g1h-234567890abc',
			},
		],
		required: true,
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['voice'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['voice'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return (10-1000)',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['voice'],
			},
		},
		description: 'Page number to retrieve',
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: false,
		description: 'Whether to simplify the response',
		displayOptions: {
			show: {
				resource: ['voice'],
				operation: ['get', 'getAll'],
			},
		},
	},
	// Create Voice
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		placeholder: 'e.g. Rachel',
		description: 'The name of the voice',
		displayOptions: {
			show: {
				resource: ['voice'],
				operation: ['create'],
			},
		},
		required: true,
	},
	{
		displayName: 'Voice Type',
		name: 'voiceType',
		type: 'options',
		options: [
			{
				name: 'Rapid',
				value: 'rapid',
				description: 'Fast voice clone (requires 10+ seconds of audio, created in under 1 minute)',
			},
			{
				name: 'Professional',
				value: 'professional',
				description: 'High-quality voice clone (requires 10+ minutes of audio, takes ~40 minutes)',
			},
		],
		default: 'rapid',
		description: 'The type of voice clone to create',
		displayOptions: {
			show: {
				resource: ['voice'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Fields',
		displayOptions: {
			show: {
				resource: ['voice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Dataset URL',
				description: 'URL to the training dataset (audio files)',
				name: 'datasetUrl',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/audio-dataset.zip',
			},
			{
				displayName: 'Language',
				description: 'Language code for the voice (default: en-US)',
				name: 'language',
				type: 'string',
				default: 'en-US',
				placeholder: 'e.g. en-US, es-ES, fr-FR',
			},
			{
				displayName: 'Callback URI',
				description: 'Webhook URL to receive training completion notifications',
				name: 'callbackUri',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/webhook',
			},
		],
	},

];

async function preSendCreateVoice(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions> {
	const name = this.getNodeParameter('name') as string;
	const voiceType = this.getNodeParameter('voiceType', 'rapid') as string;
	const additionalFields = this.getNodeParameter('additionalFields', {}) as {
		datasetUrl?: string;
		language?: string;
		callbackUri?: string;
	};

	const body: any = {
		name,
		voice_type: voiceType,
	};

	if (additionalFields.datasetUrl) {
		body.dataset_url = additionalFields.datasetUrl;
	}

	if (additionalFields.language) {
		body.language = additionalFields.language;
	}

	if (additionalFields.callbackUri) {
		body.callback_uri = additionalFields.callbackUri;
	}

	requestOptions.body = body;

	return requestOptions;
}
