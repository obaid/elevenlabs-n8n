import { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from "n8n-workflow";

interface IResembleVoiceResponse {
  items: {
    name: string;
    uuid: string;
  }[];
}

interface IResembleProject {
  uuid: string;
  name: string;
  description?: string;
}

export const listSearch = {
	async listVoices(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
		const voicesResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'resembleApi', {
			method: 'GET',
			url: 'https://app.resemble.ai/api/v2/voices?page_size=100',
		}) as IResembleVoiceResponse;

		const returnData: INodeListSearchItems[] = voicesResponse.items.map(
			(voice) => ({
				name: voice.name,
				value: voice.uuid,
			})
		);

		return {
			results: returnData,
		};
	},

	async listProjects(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
		const projectsResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'resembleApi', {
			method: 'GET',
			url: 'https://app.resemble.ai/api/v1/projects',
		}) as IResembleProject[];

		const returnData: INodeListSearchItems[] = projectsResponse.map((project) => ({
			name: project.name,
			value: project.uuid,
		}));

		return {
			results: returnData,
		}
	},
};
