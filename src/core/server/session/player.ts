import * as alt from 'alt-server';

const sessionStorage: { [id: string]: { [key: string]: any } } = {};

declare global {
    namespace AthenaSession {
        export interface Player {
            example: boolean;
        }
    }
}

/**
 * Set data for a player's session
 *
 * This data is not persistent, and automatically clears on disconnect / player destroy
 *
 * #### Example
 * ```ts
 * declare global {
 *     namespace AthenaSession {
 *         export interface Player {
 *             myCustomValue: boolean;
 *         }
 *     }
 * }
 *
 * Athena.session.player.set(somePlayer, 'myCustomValue', true);
 * ```
 *
 * @param {alt.Player} player
 * @param {keyof AthenaSession.Player} key The key you want to put the value under
 * @param {AthenaSession.Player[K]} value The value you want to set
 */
export function set<K extends keyof AthenaSession.Player>(
    player: alt.Player,
    key: keyof AthenaSession.Player,
    value: AthenaSession.Player[K],
) {
    if (!player || !player.valid) {
        return;
    }

    if (!sessionStorage[player.id]) {
        sessionStorage[player.id] = {};
    }

    sessionStorage[player.id][key] = value;
}

/**
 * Retrieve data from a player's session storage.
 *
 * @param {alt.Player} player
 * @param {keyof AthenaSession.Player} key The value you want to get from the player.
 * @returns {AthenaSession.Player[K]}
 */
export function get<K extends keyof AthenaSession.Player>(
    player: alt.Player,
    key: K,
): AthenaSession.Player[K] | undefined {
    if (!player || !player.valid) {
        return undefined;
    }

    if (!sessionStorage[player.id]) {
        return undefined;
    }

    return sessionStorage[player.id][key];
}

/**
 * Returns true, if it has any value set for a given key.
 *
 * @export
 * @param {alt.Player} player
 * @param {keyof AthenaSession.Player} key
 */
export function has(player: alt.Player, key: keyof AthenaSession.Player) {
    if (!player || !player.valid) {
        return false;
    }

    if (!sessionStorage[player.id]) {
        return false;
    }

    return typeof sessionStorage[player.id][key] ? true : false;
}

/**
 * Clear a key from the player.
 *
 * @export
 * @param {alt.Player} player
 * @param {string} key
 */
export function clearKey(player: alt.Player, key: keyof AthenaSession.Player) {
    if (!player || !player.valid) {
        return;
    }

    if (!sessionStorage[player.id]) {
        return;
    }

    delete sessionStorage[player.id][key];
}

/**
 * Clear all keys, and remove all data for a session.
 *
 * @export
 * @param {alt.Player} player
 */
export function clearAll(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    if (!sessionStorage[player.id]) {
        return;
    }

    delete sessionStorage[player.id];
}

alt.on('playerDisconnect', clearAll);
