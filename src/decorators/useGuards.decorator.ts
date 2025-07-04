/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/** biome-ignore-all lint/suspicious/noExplicitAny: handle decorator */
import "reflect-metadata";
import type { Guard } from "@/structures/Guard";

const GUARD_KEY = Symbol("GUARDS");

export function UseGuards(...guards: Guard[]) {
	return (target: any) => {
		Reflect.defineMetadata(GUARD_KEY, guards, target);
	};
}

export function getGuards(target: any): Guard[] {
	return Reflect.getMetadata(GUARD_KEY, target) || [];
}
