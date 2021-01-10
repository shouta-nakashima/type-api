import { Model, Document } from "mongoose";
import { getClassForDocument } from "@typegoose/typegoose";
import { MiddlewareFn } from "type-graphql";

export const typegooseMiddleware: MiddlewareFn = async (_, next) => {
	const result = await next();

	if (Array.isArray(result)) {
		return result.map((item) =>
			item instanceof Model ? convertDocument(item) : item
		);
	}
	if (convertDocument instanceof Model) {
		return convertDocument(result);
	}
	return result;
};

function convertDocument(doc: Document) {
	const convertedDocument = doc.toObject();
	const DocumentClass = getClassForDocument(doc)!;
	Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
	return convertedDocument;
}