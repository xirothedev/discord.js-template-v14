import { getEnvOrThrow } from "@/utils/getEnvOrThrow";
import { ColorResolvable } from "discord.js";

export const config = {
	developers: getEnvOrThrow("DEVELOPERS").split(","),
	color: {
		main: "#9BECFA",
	} satisfies { [x: string]: ColorResolvable },
	timezone: "Asia/Ho_Chi_Minh",
};
