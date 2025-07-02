/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { config } from "@/config";
import dayjs from "dayjs";
import dayjsTimeZone from "dayjs/plugin/timezone";
import dayjsUTC from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(dayjsUTC);
dayjs.extend(dayjsTimeZone);
dayjs.extend(relativeTime);

dayjs.tz.setDefault(config.timezone);

export const datejs = dayjs.tz;

const dateMasks = {
	default: "DD/MM/YYYY - HH:mm:ss",
	onlyDate: "DD/MM/YYYY",
	onlyDateFileName: "YYYY-MM-DD",
};

/**
 * Checks if a given timezone string is valid.
 *
 * This function uses dayjs with the timezone plugin to attempt creating a date object with the provided timezone.
 * If no error occurs, the timezone is considered valid.
 *
 * @param tz - The timezone string (e.g., "Asia/Ho_Chi_Minh", "UTC", ...)
 * @returns true if the timezone is valid, false if it is invalid or an error occurs.
 *
 * Example:
 *   isValidTimezone("Asia/Ho_Chi_Minh") // true
 *   isValidTimezone("Invalid/Timezone") // false
 */
export const isValidTimezone = (tz: string) => {
	try {
		const day = dayjs().tz(tz);
		return !!day;
	} catch {
		return false;
	}
};

/**
 * Format a date object to a templated string using the [date-and-time](https://www.npmjs.com/package/date-and-time) library.
 * @param date
 * @param mask - template for the date format
 * @returns formatted date
 */
export function formatDate(date: Date, mask: keyof typeof dateMasks = "default") {
	return datejs(date).format(dateMasks[mask]);
}

/**
 * Returns a human-readable relative time string (e.g., "3 hours ago") for the given date.
 * @param date - The date to compare with the current time.
 * @returns A string representing the relative time from now.
 */
export function timeAgo(date: Date) {
	return dayjs(date).fromNow();
}
