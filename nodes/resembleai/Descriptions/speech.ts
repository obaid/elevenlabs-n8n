import { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions, IN8nHttpFullResponse, INodeExecutionData, INodeProperties } from "n8n-workflow";

export const SpeechOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Text to Speech',
				value: 'textToSpeech',
				description: 'Converts text into speech and returns audio (creates a clip)',
				action: 'Convert text to speech',
				routing: {
					send: {
						preSend: [ preSendTextToSpeech ],
					},
					request: {
						url: '={{"/projects/" + $parameter["project"] + "/clips"}}',
						method: 'POST',
						returnFullResponse: true,
					},
					output: {
						postReceive: [ returnClipData ],
					}
				},
			},
		],
		default: 'textToSpeech',
		displayOptions: {
			show: {
				resource: ['speech'],
			},
		},
	}
];

export const SpeechFields: INodeProperties[] = [
	// Text to Speech (Create Clip)
	{
		displayName: 'Project',
		description: 'Select the project to create the clip in',
		name: 'project',
		type: 'resourceLocator',
		default: { mode: 'list', value: null },
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
			},
		},
		modes: [
			{
				displayName: 'From list',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'listProjects',
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
		displayName: 'Voice',
		description: 'Select the voice to use for the conversion',
		name: 'voice',
		type: 'resourceLocator',
		default: { mode: 'list', value: null },
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
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
		displayName: 'Text',
		description: 'The text that will get converted into speech',
		placeholder: 'e.g. The first move is what sets everything in motion.',
		name: 'text',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
			},
		},
		required: true,
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['speech'],
				operation: ['textToSpeech'],
			},
		},
		options: [
			{
				displayName: 'Include Timestamps',
				name: 'includeTimestamps',
				description: 'Whether to include timestamp information in the response',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				description: 'Output format of the generated audio',
				type: 'options',
				options: [
					{
						name: 'MP3',
						value: 'mp3',
						description: 'MP3 audio format',
					},
					{
						name: 'WAV',
						value: 'wav',
						description: 'WAV audio format',
					},
				],
				default: 'mp3',
			},
			{
				displayName: 'Precision',
				name: 'precision',
				description: 'Audio precision/encoding',
				type: 'options',
				options: [
					{
						name: 'PCM 16',
						value: 'PCM_16',
						description: '16-bit PCM encoding',
					},
					{
						name: 'PCM 24',
						value: 'PCM_24',
						description: '24-bit PCM encoding',
					},
					{
						name: 'PCM 32',
						value: 'PCM_32',
						description: '32-bit PCM encoding',
					},
					{
						name: 'MULAW',
						value: 'MULAW',
						description: 'μ-law encoding',
					},
				],
				default: 'PCM_16',
			},
			{
				displayName: 'Return Binary',
				name: 'returnBinary',
				description: 'Whether to download and return the audio as binary data',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Sample Rate',
				name: 'sampleRate',
				description: 'Sample rate for the audio (e.g. 22050, 44100)',
				type: 'number',
				default: 44100,
				typeOptions: {
					minValue: 8000,
					maxValue: 48000,
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				description: 'Title for the clip',
				type: 'string',
				default: '',
				placeholder: 'e.g. My Audio Clip',
			},
		],
	},
];

async function preSendTextToSpeech(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions> {
	const voice = this.getNodeParameter('voice') as string;
	const text = this.getNodeParameter('text') as string;
	const additionalOptions = this.getNodeParameter('additionalOptions', {}) as IDataObject;

	const body: any = {
		voice_uuid: voice,
		body: text,
		is_archived: false,
	};

	if (additionalOptions.title) {
		body.title = additionalOptions.title;
	}

	if (additionalOptions.sampleRate) {
		body.sample_rate = additionalOptions.sampleRate;
	}

	if (additionalOptions.outputFormat) {
		body.output_format = additionalOptions.outputFormat;
	}

	if (additionalOptions.precision) {
		body.precision = additionalOptions.precision;
	}

	if (additionalOptions.includeTimestamps !== undefined) {
		body.include_timestamps = additionalOptions.includeTimestamps;
	}

	requestOptions.body = body;

	return requestOptions;
}

async function returnClipData(this: IExecuteSingleFunctions, items: INodeExecutionData[], responseData: IN8nHttpFullResponse): Promise<INodeExecutionData[]> {
	const additionalOptions = this.getNodeParameter('additionalOptions', {}) as IDataObject;
	const returnBinary = additionalOptions.returnBinary !== false; // default true

	const clipData = responseData.body as any;
	const item = clipData.item || clipData;

	if (returnBinary && item.audio_src) {
		// Download the audio file
		try {
			const audioResponse = await this.helpers.httpRequest({
				method: 'GET',
				url: item.audio_src,
				encoding: 'arraybuffer',
				returnFullResponse: true,
			});

			const outputFormat = (additionalOptions.outputFormat as string) || 'mp3';
			const binaryData = await this.helpers.prepareBinaryData(
				audioResponse.body as Buffer,
				`clip.${outputFormat}`,
				`audio/${outputFormat}`,
			);

			return [{
				json: {
					uuid: item.uuid,
					title: item.title,
					audio_src: item.audio_src,
					created_at: item.created_at,
				},
				binary: { data: binaryData },
			}];
		} catch (error) {
			// If download fails, return the clip data with the audio URL
			return [{ json: item }];
		}
	}

	return [{ json: item }];
}
