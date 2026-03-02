/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BaseEvent } from '@/structures/BaseEvent';
import { ChannelType, type GuildMember } from 'discord.js';

export class GuildMemberAddEvent extends BaseEvent<'guildMemberAdd'> {
	constructor(client: CustomClient) {
		super(client, 'guildMemberAdd');
	}

	async execute(member: GuildMember) {
		const setting = await this.client.prisma.welcomeSetting.findUnique({
			where: { guildId: member.guild.id },
		});
		if (!setting || !setting.enabled) return;

		const roleIds = setting.autoRoleIds
			.split(',')
			.map((roleId) => roleId.trim())
			.filter(Boolean);

		for (const roleId of roleIds) {
			await member.roles.add(roleId).catch((error: unknown) => {
				this.client.logger.warn(`Failed to auto-assign role ${roleId} for ${member.id}`, error);
			});
		}

		if (!setting.channelId) return;
		const channel = member.guild.channels.cache.get(setting.channelId);
		if (!channel || channel.type !== ChannelType.GuildText) return;

		const template = setting.template ?? 'Welcome {user} to **{guild}**!';
		const content = template.replaceAll('{user}', `<@${member.id}>`).replaceAll('{guild}', member.guild.name);
		await channel.send({ content }).catch((error: unknown) => {
			this.client.logger.warn(`Failed to send welcome message in ${setting.channelId}`, error);
		});
	}
}
