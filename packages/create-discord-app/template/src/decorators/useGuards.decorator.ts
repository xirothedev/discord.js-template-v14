/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'reflect-metadata';
import type { Guard } from '@/structures/Guard';

const GUARD_KEY = Symbol('GUARDS');

export function UseGuards(...guards: Guard[]) {
	return (target: Object) => {
		Reflect.defineMetadata(GUARD_KEY, guards, target);
	};
}

export function getGuards(target: Object): Guard[] {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Reflect.getMetadata(GUARD_KEY, target) || [];
}
