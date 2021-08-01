"use strict";
import {Context, Service, ServiceBroker, ServiceSchema} from "moleculer";
import ESService from "moleculer-elasticsearch";
import elasticsearch from "@elastic/elasticsearch";

export default class CartService extends Service{

	private client = new elasticsearch.Client({ node: 'http://elastic:changeme@elasticsearch:9200' })

	// @ts-ignore
	public async constructor(public broker: ServiceBroker, schema: ServiceSchema<{}> = {}) {
		super(broker);

		this.client.ping({
		}, (error: any) =>  {
			if (error) {
				console.error('elasticsearch cluster is down!');
			} else {
				console.log('Everything is ok');
			}
		});

		this.client.indices.create({
			index: 'users'
		})


		this.parseServiceSchema(Service.mergeSchemas({
			name: "users",
			mixins: [ESService],
			settings: {
				elasticsearch: {
					host: "http://elastic:changeme@elasticsearch:9200",
					apiVersion: "5.6",
					httpAuth: 'elastic:changeme'
				},
				// Available fields in the responses
				fields: [
					"_id",
					"name",
					"password",
				],

				// Validator for the `create` & `insert` actions.
				entityValidator: {
					name: "string|min:2",
					password: "string|min:2",
				},
			},
			hooks: {
				before: {
				},
			},
			actions: {

				 register: {
					rest: "POST /register",
					params: {
						name: "string",
						password: "string",
					},
					async handler(ctx: Context<{index: string, type: string, id: string, name: string; password: string, body: { name: string; password: string }}>) {
						this.client.index({
							index: 'users',
							type: 'users',
							body: {name: ctx.params.name, password: ctx.params.password }
						}, async (err: any, resp: any, status: any) => {

						});

						this.client.indices.refresh({
							index: 'users',
							ignore_unavailable: true,
							allow_no_indices: false,
							expand_wildcards: 'all'
						})
						return {result: 'user successfully logged in' };
					},
				},

				login: {
					rest: "POST /login/",
					params: {
						name: "string",
						password: "string"
					},
					async handler(ctx: Context<{index: string, type: string, id: string, name: string; password: string, body: { name: string; password: string }}>) {
						const result = await this.client.search({
							index: 'users',
							body: {
								"query": {
									"bool": {
									  "must": [
										{
										  "match": {
											"name": ctx.params.name
										  }
										},
										{
										  "match": {
											"password": ctx.params.password
										  }
										}
									  ]
									}
								}
							}
						})
						
						if(result?.hits.hits.length > 0) {
							return {result: 'user successfully logged in' }
						} else {
							return {result: 'user not found' }
						}
					},
				},
			},
			methods: {
			},
		}, schema));
	}
}
