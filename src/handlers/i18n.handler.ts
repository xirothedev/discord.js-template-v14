/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Locale } from "discord.js";
import i18next from "i18next";
import Backend, { type FsBackendOptions } from "i18next-fs-backend";
import { join } from "node:path";

export const ns = ["common", "commands", "guards"];

export async function initI18n(client: CustomClient) {
	try {
		await i18next.use(Backend).init<FsBackendOptions>({
			fallbackLng: "EnglishUS",
			supportedLngs: ["EnglishUS", "Vietnamese"],
			backend: {
				loadPath: (language: string, namespace: string) =>
					join(process.cwd(), "src", "locales", language, `${namespace}.json`),
			},
			ns,
			defaultNS: ns[0],
			fallbackNS: false,
			preload: ["EnglishUS", "Vietnamese"],
			interpolation: {
				escapeValue: false,
				prefix: "{",
				suffix: "}",
			},
			returnNull: false,
			returnEmptyString: false,
			returnObjects: true,
			debug: process.env.NODE_ENV === "development",
		});

		client.logger.info("I18n has been initialized");
	} catch (error) {
		console.error("I18n initialization error:", error);
		throw error;
	}
}

// Helper function to get translation
export function T(locale: string, key: string, params?: { [x: string]: string }): string {
	const localeMap: { [key: string]: string } = {
		"en-US": "EnglishUS",
		en: "EnglishUS",
		"vi-VN": "Vietnamese",
		vi: "Vietnamese",
	};

	const mappedLocale = localeMap[locale] || "EnglishUS";

	try {
		return i18next.t(key, { ...params, lng: mappedLocale }).toString();
	} catch (error) {
		console.error("Translation error:", error);
		return i18next.t(key, { ...params, lng: "EnglishUS" }).toString();
	}
}

// Helper function for localization
export function localization(lan: keyof typeof Locale, name: string, desc: string) {
	return {
		name: [Locale[lan], name],
		description: [Locale[lan], T(lan, desc)],
	};
}

export function descriptionLocalization(name: string, text: string) {
	return Object.keys(Locale).map((locale: string) => {
		if (locale in Locale) {
			return localization(locale as keyof typeof Locale, name, text);
		}
		return localization("EnglishUS", name, text);
	});
}

export { i18next };
