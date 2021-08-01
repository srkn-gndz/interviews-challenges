"use strict";
import { ServiceBroker } from "moleculer";
import ESService from "moleculer-elasticsearch";
import Elasticsearch from "elasticsearch";

jest.mock("elasticsearch");

// @ts-ignore
Elasticsearch.Client = jest.fn(() => {
	return {
		ping: jest.fn(() => Promise.resolve()),
		bulk: jest.fn(() => Promise.resolve()),
		create: jest.fn(() => Promise.resolve()),
		get: jest.fn(() => Promise.resolve()),
		update: jest.fn(() => Promise.resolve()),
		delete: jest.fn(() => Promise.resolve()),
		search: jest.fn(() => Promise.resolve()),
		count: jest.fn(() => Promise.resolve()),
		xyz: jest.fn(() => Promise.resolve()),
	};
});

function protectReject(err: any) {
	console.error(err.stack);
	expect(err).toBe(true);
}

describe("Test Elasticsearch service", () => { 
    const broker = new ServiceBroker({ logger: false});
	const service = broker.createService(ESService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

    it("should be created", () => {
		expect(service).toBeDefined();

		expect(Elasticsearch.Client).toHaveBeenCalledTimes(1);
		expect(Elasticsearch.Client).toHaveBeenCalledWith(service.settings.elasticsearch);

		expect(service.client.ping).toHaveBeenCalledTimes(1);
		expect(service.client.ping).toHaveBeenCalledWith({ requestTimeout: 5000 });
	});

    it("should call client.create", () => {
		let p = {
			index: "products",
			type: "products",
			id: "5",
            name: 'hello',
            price: 200,
            body: {name: 'hello', price: 200},
		};

		return broker.call("elasticsearch.create", p).catch(protectReject).then(res => {
			expect(service.client.create).toHaveBeenCalledTimes(1);
			expect(service.client.create).toHaveBeenCalledWith(p);
		});
	});

    it("should call client.get", () => {
		let p = {
			index: "products",
			type: "products",
			id: "5",
            name: 'hello',
            price: 200,
            body: {name: 'hello', price: 200},
		};

		return broker.call("elasticsearch.get", p).catch(protectReject).then(res => {
			expect(service.client.get).toHaveBeenCalledTimes(1);
			expect(service.client.get).toHaveBeenCalledWith(p);
		});
	});

    it("should call client.update", () => {
		let p = {
			index: "products",
			type: "products",
			id: "5",
            name: 'hello',
            price: 200,
            body: {name: 'hello', price: 200},
		};

		return broker.call("elasticsearch.update", p).catch(protectReject).then(res => {
			expect(service.client.update).toHaveBeenCalledTimes(1);
			expect(service.client.update).toHaveBeenCalledWith(p);
		});
	});

    it("should call client.delete", () => {
		let p = {
			index: "products",
			type: "products",
			id: "5",
            name: 'hello',
            price: 200,
            body: {name: 'hello', price: 200},
		};

		return broker.call("elasticsearch.delete", p).catch(protectReject).then(res => {
			expect(service.client.delete).toHaveBeenCalledTimes(1);
			expect(service.client.delete).toHaveBeenCalledWith(p);
		});
	});

	it("should call client.search with q", () => {
		let p = {
			q: ""
		};

		return broker.call("elasticsearch.search", p).catch(protectReject).then(res => {
			expect(service.client.search).toHaveBeenCalledTimes(1);
			expect(service.client.search).toHaveBeenCalledWith(p);
		});
	});

	it("should call client.search with body", () => {
		service.client.search.mockClear();

		let p = {
			body: {}
		};

		return broker.call("elasticsearch.search", p).catch(protectReject).then(res => {
			expect(service.client.search).toHaveBeenCalledTimes(1);
			expect(service.client.search).toHaveBeenCalledWith(p);
		});
	});

    it("should call client.count with q", () => {
		let p = {
			q: ""
		};

		return broker.call("elasticsearch.count", p).catch(protectReject).then(res => {
			expect(service.client.count).toHaveBeenCalledTimes(1);
			expect(service.client.count).toHaveBeenCalledWith(p);
		});
	});

    it("should call client.count with body", () => {
		service.client.count.mockClear();

		let p = {
			body: {}
		};

		return broker.call("elasticsearch.count", p).catch(protectReject).then(res => {
			expect(service.client.count).toHaveBeenCalledTimes(1);
			expect(service.client.count).toHaveBeenCalledWith(p);
		});
	});

    it("should call client.xyz", () => {
		let p = {
			api: "xyz",
			params: {
				index: "products",
				type: "products"
			}
		};

		return broker.call("elasticsearch.call", p).catch(protectReject).then(res => {
			expect(service.client.xyz).toHaveBeenCalledTimes(1);
			expect(service.client.xyz).toHaveBeenCalledWith(p.params);
		});
	});

});