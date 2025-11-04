import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { VoiceOperations, VoiceFields } from './Descriptions/voice';
import { listSearch } from './Descriptions/utils';
import { SpeechFields, SpeechOperations } from './Descriptions/speech';

export class ResembleAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Resemble AI',
		name: 'resembleAi',
		icon: 'file:elevenlabs.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Resemble AI API',
		defaults: {
			name: 'Resemble AI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'resembleApi',
				required: true,
			},
		],
		requestDefaults: {
			method: 'POST',
			baseURL: 'https://app.resemble.ai/api/v2',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Voice',
						value: 'voice',
					},
					{
						name: 'Speech',
						value: 'speech',
					},
				],
				default: 'voice',
			},
			...VoiceOperations,
			...VoiceFields,
			...SpeechOperations,
			...SpeechFields,
		]
	};

	methods = {
		listSearch,
	};
}
