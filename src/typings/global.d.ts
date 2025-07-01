import type { CustomClient as _CustomClient } from "@/client/CustomClient";

declare global {
	// Allows usage of CustomClient as a global type
	// Use _CustomClient to avoid redeclaration error
	type CustomClient = _CustomClient;
}
