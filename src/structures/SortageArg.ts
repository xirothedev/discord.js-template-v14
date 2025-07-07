/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { config } from "@/config";
import { T } from "@/handlers/i18n.handler";
import { type Message, EmbedBuilder } from "discord.js";
import type { Language } from "prisma/generated";

export class MissingArgError {
	constructor(
		private message: Message<true>,
		private language: Language,
	) {}

	public async returnError(argName: string, argPosition: number, argValue: string, customMessage?: string) {
		await this.message.reply({ embeds: [this.getEmbedMessage(argName, argPosition, argValue, customMessage)] });
	}

	public getEmbedMessage(argName: string, argPosition: number, argValue: string, customMessage?: string) {
		const embed = new EmbedBuilder()
			.setColor(config.color.main)
			.setDescription(this.getContentMessage(argName, argPosition, argValue, customMessage));
		return embed;
	}

	public getContentMessage(argName: string, argPosition: number, argValue: string, customMessage?: string) {
		if (customMessage) return customMessage;
		return T(this.language, "argument_type_error", { argName, argPosition: argPosition.toString(), argValue });
	}
}
