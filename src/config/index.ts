/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getEnvOrThrow } from "@/utils/getEnvOrThrow";
import type { ColorResolvable } from "discord.js";

export const config = {
	developers: getEnvOrThrow("DEVELOPERS").split(","),
	color: {
		main: "#9BECFA",
	} satisfies { [x: string]: ColorResolvable },
	timezone: "Asia/Ho_Chi_Minh",
};
