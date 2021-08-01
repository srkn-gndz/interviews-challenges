"use strict";
import {Context, Service, ServiceBroker, ServiceSchema} from "moleculer";
import ESService from "moleculer-elasticsearch";
import elasticsearch from "@elastic/elasticsearch";


export default class ProductsService extends Service{
	public client = new elasticsearch.Client({ node: 'http://elastic:changeme@elasticsearch:9200' })

	// @ts-ignore
	public async constructor(public broker: ServiceBroker, schema: ServiceSchema<{}> = {name: 'products'}) {
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
			index: 'products'
		})

		this.client.index({
			index: 'products',
			type: 'products',
			body: {name: 'Iphone 7', quantity: 100, price: 200}
		});

		this.client.index({
			index: 'products',
			type: 'products',
			body: { name: 'Iphone 8', quantity: 100, price: 300}
		});

		this.client.index({
			index: 'products',
			type: 'products',
			body: { name: 'Iphone X', quantity: 100, price: 400}
		});

		this.client.index({
			index: 'products',
			type: 'products',
			body: { name: 'Iphone 11', quantity: 100, price: 500}
		});

		this.client.index({
			index: 'products',
			type: 'products',
			body: { name: 'Iphone 12', quantity: 100, price: 600}
		});

		this.client.indices.refresh({
			index: 'products',
			ignore_unavailable: true,
			allow_no_indices: false,
			expand_wildcards: 'all'
		})


		this.parseServiceSchema(Service.mergeSchemas({
			name: "products",
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
					"quantity",
					"price",
				],

				// Validator for the `create` & `insert` actions.
				entityValidator: {
					name: "string|min:3",
					price: "number|positive",
				},
			},
			hooks: {
				before: {
					/**
					 * Register a before hook for the `create` action.
					 * It sets a default value for the quantity field.
					 *
					 * @param {Context} ctx
					 */
					create: (ctx: Context<{ quantity: number }>) => {
						ctx.params.quantity = 0;
					},
				},
			},
			actions: {
				get: {
					rest: "GET /:id",
					params: {
						id: "string",
					},
					async handler(ctx: Context<{ id: string; }>) {
						const result = await this.client.search({
							index: 'products',
							body: {
								"query": {
									"match" : {
										"_id" : ctx.params.id
									}
								},
							}
						})
						
						if(result) {
							return {
								rows: result.hits.hits,
								total: result.hits.total
							}
						} else {
								return {
									rows: [],
									total: 0
								}
						}
					}
				},

				list: {
					rest: "GET /",
					params: {},
					async handler() {
						this.client.indices.refresh({
							index: 'products'
						})
						
						const result = await this.client.search({
							index: 'products',
							q: '*:*',
							size: 1000,
						})

						if(result?.hits.hits.length > 0) {
							return {
								rows: result.hits.hits,
								total: result.hits.total
							}
						} else {
							this.client.indices.create({
								index: 'products'
							})
					
					
							this.client.index({
								index: 'products',
								type: 'products',
								body: { name: 'Iphone 7', quantity: 100, price: 200}
							});
					
							this.client.index({
								index: 'products',
								type: 'products',
								body: { name: 'Iphone 8', quantity: 100, price: 300}
							});
					
							this.client.index({
								index: 'products',
								type: 'products',
								body: {name: 'Iphone X', quantity: 100, price: 400}
							});
					
							this.client.index({
								index: 'products',
								type: 'products',
								body: { name: 'Iphone 11', quantity: 100, price: 500}
							});
					
							this.client.index({
								index: 'products',
								type: 'products',
								body: { name: 'Iphone 12', quantity: 100, price: 600}
							});

							this.client.indices.refresh({
								index: 'products'
							})
							
							const result = await this.client.search({
								index: 'products',
								q: '*:*',
								size: 1000,
							})

							return {
								rows: result.hits.hits,
								total: result.hits.total
							}
						}
					},
				},

				 create: {
					rest: "POST /",
					params: {
						name: "string",
						// @ts-ignore
						price: "number|integer|positive",
					},
					async handler(ctx: Context<{index: string, type: string, id: string, name: string; price: number, body: { name: string; price: number }}>) {

						this.client.index({
							index: 'products',
							type: 'products',
							body: {name: ctx.params.name, price: ctx.params.price, quantity: 666 }
						}, async (err: any, resp: any, status: any) => {
							// console.log(resp);
							const json = await this.transformDocuments(ctx, ctx.params, resp);
							return json;
						});

						this.client.indices.refresh({
							index: 'products',
							ignore_unavailable: true,
							allow_no_indices: false,
							expand_wildcards: 'all'
						})

						return {name: ctx.params.name, price: ctx.params.price, quantity: 555 };
					},
				},
			},
			methods: {
			},
		}, schema));
	}
}


