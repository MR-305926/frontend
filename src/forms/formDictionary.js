//@ts-check

import Joi from "joi";
import FormParam, { FieldType } from "../utils/FormParam";
import { doNothing } from "../utils/constFunction.js";
import asISBN13 from "../utils/asISBN13.js";

/** @typedef {(session:import("../utils/SessionManager").default, paginationState:import("../utils/PaginationState").default, consumer:import("react").Dispatch<import("react").SetStateAction<Record<string,string>[]>>,navigate:import("react-router").NavigateFunction,data:import("react-hook-form").FieldValues) => Promise<any>} FormDictionaryHandler */

/**
 * @param {FormDictionaryHandler} handler 
 * @returns {import("../utils/FormParam").FormParamHandler}
 */
function wrapHandler(handler) {
	/**
	 * @type {import("../utils/FormParam").FormParamHandler}
	 */
	return function (session, paginationState, consumer, navigate, setFormDisabled) {
		/**
		 * @param {import("react-hook-form").FieldValues} data
		 */
		return function (data) {
			setFormDisabled(true);
			handler(session, paginationState, consumer, navigate, data).finally(
				() => setFormDisabled(false)
			);
		}
	}
}

/**
 * @type {{[k:string]:import("../utils/FormParam").default}}
 */
const formDictionary = {
	"bookGet": new FormParam(
		{
			"_isbn": {
				alias: "Mostrar ISBN",
				type: FieldType.CHECKBOX,
			},
			"isbn": {
				alias: "ISBN",
				type: FieldType.TEXT,
				rules: Joi.string().allow("")
			},
			"_title": {
				alias: "Mostrar Titulo",
				type: FieldType.CHECKBOX
			},
			"title": {
				alias: "Titulo",
				type: FieldType.TEXT,
				rules: Joi.string().allow("")
			},
			"pageCountMin": {
				alias: "Cantidad de paginas minimo",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(Joi.number(), Joi.string().valid(""))
			},
			"pageCountMax": {
				alias: "Cantidad de paginas maximo",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(
					Joi.when("pageCountMin", {
						is: Joi.exist(),
						then: Joi.number().min(Joi.ref("pageCountMin")),
						otherwise: Joi.number()
					}),
					Joi.string().valid("")
				)
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let selector = [];
			/** @type {({name:string,floor?:number,roof?:number,value?:string})[]} */
			let where = [];
			for (let [k, v] of Object.entries(data)) {
				switch (k) {
					case "_isbn": if (v) selector.push("isbn"); break;
					case "isbn": if (v) where.push({ name: "isbn", value: v }); break;
					case "_title": if (v) selector.push("title"); break;
					case "title": if (v) where.push({ name: "title", value: v }); break;
					case "pageCountMin": if (v) {
						let value;
						value = where.find((a) => a.name == "pageCount")
						if (!value) {
							value = { name: "pageCount" };
							where.push(value);
						}
						value["floor"] = Number(v);
					} break;
					case "pageCountMax": if (v) {
						let value;
						value = where.find((a) => a.name == "pageCount")
						if (!value) {
							value = { name: "pageCount" };
							where.push(value);
						}
						value["roof"] = Number(v);
					} break;
					default: continue;
				}
			}
			let skip = paginationState.pageSize * (paginationState.pageIndex - 1);
			let amount = paginationState.pageSize;

			let body = Object();
			if (selector.length > 0) body["selector"] = selector;
			if (where.length > 0) body["where"] = where;
			if (skip > 0) body["skip"] = skip;
			body["amount"] = amount;

			return session.postResource(session.apiOrigin() + "/bookGet", body).then(
				(value) => consumer(value.value),
				doNothing
			);
		})
	),
	"changeMyPassword": new FormParam(
		{
			"password": {
				alias: "Nueva Contraseña",
				type: FieldType.PASSWORD,
				rules: Joi.string().min(1).required()
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let newPassword = data["password"];
			return session.postResource(session.apiOrigin() + "/changeMyPassword", { password: newPassword }).then(
				() => { session.clearSession(); navigate("/"); },
				() => { consumer([{ "No se pudo cambiar la contraseña": "" }]) }
			)
		})
	),
	"deleteMyAccount": new FormParam(
		{
			"confirmation": {
				alias: "Estoy seguro de que quiero eliminar mi cuenta de manera permanente e irreversible",
				type: FieldType.CHECKBOX,
				rules: Joi.boolean().invalid(false).messages({
					"any.invalid": "Falta confirmar la acción"
				})
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			return session.postResource(session.apiOrigin() + "/deleteMyAccount").then(
				() => { session.clearSession(); consumer([{ "Cuenta eliminada": "" }]); },
				doNothing
			)
		})
	),
	"upgradeMyAccount": new FormParam(
		{
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			return session.postResource(session.apiOrigin() + "/upgradeMyAccount").then(
				() => { session.clearSession(); },
				doNothing
			)
		})
	),
	"pagemarkerGet": new FormParam(
		{
			"_book": {
				alias: "Mostrar el ID del libro",
				type: FieldType.CHECKBOX
			},
			"book": {
				alias: "ID del libro",
				type: FieldType.TEXT,
				rules: Joi.string().allow("")
			},
			"_marker": {
				alias: "Mostrar la posicion del marcador de página",
				type: FieldType.CHECKBOX
			},
			"markerMin": {
				alias: "Marcadores de página desde",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(
					Joi.number().min(0),
					Joi.string().valid("")
				)
			},
			"markerMax": {
				alias: "Marcadores de página hasta",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(
					Joi.when("markerMin", {
						is: Joi.exist(),
						then: Joi.number().min(Joi.ref("markerMin")),
						otherwise: Joi.number().min(0)
					}),
					Joi.string().valid("")
				)
			},
			"pageCountMin": {
				alias: "Número de páginas desde",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(
					Joi.number().min(1),
					Joi.string().valid("")
				)
			},
			"pageCountMax": {
				alias: "Número de páginas hasta",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(
					Joi.when("pageCountMin", {
						is: Joi.exist(),
						then: Joi.number().min(Joi.ref("pageCountMin")),
						otherwise: Joi.number().min(1)
					}),
					Joi.string().valid("")
				)
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let selector = [];
			/** @type {({name:string,floor?:number,roof?:number,value?:string})[]} */
			let where = [];
			for (let [k, v] of Object.entries(data)) {
				switch (k) {
					case "_book": if (v) selector.push("book"); break;
					case "book": if (v) where.push({ name: "book", value: v }); break;
					case "_marker": if (v) selector.push("marker"); break;
					case "markerMin": if (v) {
						let value;
						value = where.find((a) => a.name == "marker")
						if (!value) {
							value = { name: "marker" };
							where.push(value);
						}
						value["floor"] = Number(v);
					} break;
					case "markerMax": if (v) {
						let value;
						value = where.find((a) => a.name == "marker")
						if (!value) {
							value = { name: "marker" };
							where.push(value);
						}
						value["roof"] = Number(v);
					} break;
					case "pageCountMin": if (v) {
						let value;
						value = where.find((a) => a.name == "pageCount")
						if (!value) {
							value = { name: "pageCount" };
							where.push(value);
						}
						value["floor"] = Number(v);
					} break;
					case "pageCountMax": if (v) {
						let value;
						value = where.find((a) => a.name == "pageCount")
						if (!value) {
							value = { name: "pageCount" };
							where.push(value);
						}
						value["roof"] = Number(v);
					} break;
					default: continue;
				}
			}
			let skip = paginationState.pageSize * (paginationState.pageIndex - 1);
			let amount = paginationState.pageSize;

			let body = Object();
			if (selector.length > 0) body["selector"] = selector;
			if (where.length > 0) body["where"] = where;
			if (skip > 0) body["skip"] = skip;
			body["amount"] = amount;

			return session.postResource(session.apiOrigin() + "/pagemarkerGet", body).then(
				(value) => consumer(value.value),
				doNothing
			);
		})
	),
	"pagemarkerUpdate": new FormParam(
		{
			"id": {
				alias: "ID del marcapáginas",
				type: FieldType.TEXT,
				rules: Joi.string().required()
			},
			"marker": {
				alias: "Nueva posicion del marcador",
				type: FieldType.NUMBER,
				rules: Joi.number().min(1).required()
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let id = data["id"];
			let marker = data["marker"];

			let body = { id, marker };

			return session.postResource(session.apiOrigin() + "/pagemarkerGet", body).then(
				(value) => consumer(value.value),
				doNothing
			);
		})
	),
	"pagemarkerRemove": new FormParam(
		{
			"book": {
				alias: "ID del libro",
				type: FieldType.TEXT,
				rules: Joi.string().required()
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let book = data["book"];

			let body = { where: [{ name: "book", value: book }] };

			return session.postResource(session.apiOrigin() + "/pagemarkerRemove", body).then(
				(value) => consumer([{ ELIMINADO_EL_MARCAPAGINAS: book }]),
				doNothing
			);
		})
	),
	"pagemarkerAdd": new FormParam(
		{
			"book": {
				alias: "ID del libro",
				type: FieldType.TEXT,
				rules: Joi.string().required()
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let book = data["book"];

			let body = { book: book };

			return session.postResource(session.apiOrigin() + "/pagemarkerRemove", body).then(
				(value) => consumer([{ NUEVO_MARCAPAGINAS: book }]),
				doNothing
			);
		})
	),
	"bookAdd": new FormParam(
		{
			"isbn": {
				alias: "ISBN",
				type: FieldType.TEXT,
				rules: Joi.string().required().custom(asISBN13)
			},
			"title": {
				alias: "Titulo",
				type: FieldType.TEXT,
				rules: Joi.string().required()
			},
			"pageCount": {
				alias: "Número de páginas",
				type: FieldType.NUMBER,
				rules: Joi.number().min(1).required()
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let isbn = data["isbn"];
			let title = data["title"];
			let pageCount = data["pageCount"];

			let body = { isbn, title, pageCount };

			return session.postResource(session.apiOrigin() + "/bookAdd", body).then(
				(value) => consumer([body]),
				doNothing
			)
		})
	),
	"bookRemove": new FormParam(
		{
			"isbn": {
				alias: "ISBN",
				type: FieldType.TEXT,
				rules: Joi.string().allow("").custom(asISBN13)
			},
			"title": {
				alias: "Titulo",
				type: FieldType.TEXT,
				rules: Joi.string().allow("")
			},
			"pageCountMin": {
				alias: "Número mínimo de páginas",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(
					Joi.number().min(1),
					Joi.string().valid("")
				)
			},
			"pageCountMax": {
				alias: "Número máximo de páginas",
				type: FieldType.NUMBER,
				rules: Joi.alternatives(
					Joi.when("pageCountMin", {
						is: Joi.exist(),
						then: Joi.number().min(Joi.ref("pageCountMin")),
						otherwise: Joi.number().min(1)
					}),
					Joi.string().valid("")
				)
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let isbn = data["isbn"];
			let title = data["title"];
			let pageCountMin = data["pageCountMin"];
			let pageCountMax

			/** @type {({name:string,floor?:number,roof?:number,value?:string})[]} */
			let where = [];
			if (isbn) where.push({ name: "isbn", value: isbn });
			if (title) where.push({ name: "title", value: title });
			if (pageCountMin) {
				let value;
				value = where.find((a) => a.name == "pageCount");
				if (!value) {
					value = { name: "pageCount" };
					where.push(value);
				}
				value["floor"] = Number(pageCountMin);
			}
			if (pageCountMax) {
				let value;
				value = where.find((a) => a.name == "pageCount");
				if (!value) {
					value = { name: "pageCount" };
					where.push(value);
				}
				value["roof"] = Number(pageCountMax);
			}

			let body = { where: where };

			return session.postResource(session.apiOrigin() + "/bookRemove", body).then(
				consumer,
				doNothing
			)
		})
	),
	"bookgenreAdd": new FormParam(
		{
			"book": {
				alias: "ID del libro",
				type: FieldType.TEXT,
				rules: Joi.string().required()
			},
			"bookgenre": {
				alias: "género",
				type: FieldType.TEXT,
				rules: Joi.string().valid(
					"NON-FICTION",
					"HISTORICAL",
					"BIOGRAPHY",
					"ROMANCE",
					"THRILLER",
					"HORROR",
					"MYSTERY",
					"FANTASY",
					"FICTION",
					"SCIENCE_FICTION"
				).required()
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let book = data["book"];
			let bookgenre = data["bookgenre"];

			let body = { book, bookgenre };

			return session.postResource(session.apiOrigin() + "/bookgenreAdd").then(
				() => consumer([body]),
				doNothing
			);
		})
	),
	"bookgenreRemove": new FormParam(
		{
			"book": {
				alias: "Nombre del libro",
				type: FieldType.TEXT,
				rules: Joi.string().allow("")
			},
			"genre": {
				alias: "Género",
				type: FieldType.TEXT,
				rules: Joi.string().valid(
					"NON-FICTION",
					"HISTORICAL",
					"BIOGRAPHY",
					"ROMANCE",
					"THRILLER",
					"HORROR",
					"MYSTERY",
					"FANTASY",
					"FICTION",
					"SCIENCE_FICTION",
					""
				)
			}
		},
		wrapHandler((session, paginationState, consumer, navigate, data) => {
			let book = data["book"];
			let genre = data["genre"];

			let where = [];
			if (book) where.push({ name: "book", value: book });
			if (genre) where.push({ name: "genre", value: genre });

			let body = { where };

			return session.postResource(session.apiOrigin() + "/bookgenreRemove", body).then(
				consumer,
				doNothing
			);
		})
	)
};

export default formDictionary;