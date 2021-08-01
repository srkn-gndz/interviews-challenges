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
			index: 'cart'
		})


		this.parseServiceSchema(Service.mergeSchemas({
			name: "cart",
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
					"product_id",
                    "piece"
				],

				// Validator for the `create` & `insert` actions.
				entityValidator: {
                    piece: "number|positive",
				},
			},
			hooks: {
				before: {
				},
			},
			actions: {
				list: {
					rest: "GET /",
					params: {},
					async handler() {
						this.client.indices.refresh({
							index: 'cart'
						})
						
						const result = await this.client.search({
							index: 'cart',
							q: '*:*',
							size: 1000,
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
					},
				},

				 add: {
					rest: "POST /add/",
					params: {
						product_id: "string",
						// @ts-ignore
						piece: "number|integer|positive",
					},
					async handler(ctx: Context<{index: string, type: string, piece: number, product_id: string, body: { piece: number, product_id: string }}>) {

						this.client.index({
							index: 'cart',
							type: 'cart',
							body: { piece: ctx.params.piece, product_id: ctx.params.product_id }
						}, async (err: any, resp: any, status: any) => {
							const json = await this.transformDocuments(ctx, ctx.params, resp);
							return json;
						});

						this.client.indices.refresh({
							index: 'products',
							ignore_unavailable: true,
							allow_no_indices: false,
							expand_wildcards: 'all'
						})

						return {piece: ctx.params.piece, product_id: ctx.params.product_id };
					},
				},

                delete: {
					rest: "DELETE /delete/:id",
					params: {
						id: "string",
					},
					async handler(ctx: Context<{index: string, type: string, id: string, body: { id: string }}>) {

						this.client.delete({
							index: 'cart',
							type: 'cart',
							id: ctx.params.body.id
						});

                        return {result: 'cart updated successfully' };
					},
				},
			},
			methods: {
			},
		}, schema));
	}

	// list(): Promise<any> {

    // }
}
