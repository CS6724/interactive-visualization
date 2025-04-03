import 'reflect-metadata';
import Container, { Service } from 'typedi';
import { IVLaPEvents } from '../types';

/**
 * The `ConfigManager` class is responsible for managing configuration data within an application.
 * It allows you to store, retrieve, update, and delete key-value pairs, as well as subscribe to
 * configuration change events. Internally, it holds an array of objects representing the
 * configuration, and a map of event listeners.
 *
 * @example
 * ```ts
 * // Obtain an instance via the TypeDI Container
 * const configManager = Container.get(ConfigManager);
 * 
 * // Set a configuration item
 * configManager.set('apiUrl', 'https://example.com/api');
 *
 * // Get a configuration item
 * console.log(configManager.get('apiUrl'));
 *
 * // Update a configuration item
 * configManager.update('apiUrl', 'https://new-example.com/api');
 *
 * // Delete a configuration item
 * configManager.delete('apiUrl');
 *
 * // Subscribe to configuration change events
 * configManager.on(IVLaPEvents.CONFIG_CHANGE, (key) => {
 *   console.log(`Configuration changed for key: ${key}`);
 * });
 * ```
 */
@Service()
export class ConfigManager {
    /**
     * Holds the list of configuration items as objects with a `key` and a `value`.
     */
    private configuration: { key: string; value: any }[] = [];

    /**
     * Maintains a registry of events, mapping each event to an array of listener functions.
     */
    private events: { [key: string]: Function[] } = {};

    /**
     * Inserts or updates a key-value pair in the configuration. If the key already exists,
     * the corresponding value is updated; otherwise, a new key-value pair is inserted.
     * After setting the value, it emits a `CONFIG_CHANGE` event for the provided key.
     *
     * @param key - The configuration key to set.
     * @param value - The value to associate with the provided key.
     */
    set(key: string, value: any): void {
        const index = this.configuration.findIndex(item => item.key === key);
        if (index !== -1) {
            // Update if key exists
            this.configuration[index].value = value;
        } else {
            // Insert if key does not exist
            this.configuration.push({ key, value });
        }
        this.emit(IVLaPEvents.CONFIG_CHANGE, key);
    }

    /**
     * Retrieves the value associated with the provided key.
     *
     * @param key - The configuration key to retrieve.
     * @returns The associated value, or `undefined` if the key does not exist.
     */
    get(key: string): any | undefined {
        const item = this.configuration.find(item => item.key === key);
        return item ? item.value : undefined;
    }

    /**
     * Updates an existing key-value pair in the configuration. If the key does not exist,
     * the method returns `false` and also emits a `CONFIG_CHANGE` event for the non-existent key.
     *
     * @param key - The configuration key to update.
     * @param value - The new value to associate with the provided key.
     * @returns A boolean indicating whether the update succeeded (`true`) or failed (`false`).
     */
    update(key: string, value: any): boolean {
        const index = this.configuration.findIndex(item => item.key === key);
        if (index !== -1) {
            this.configuration[index].value = value;
            return true;
        }
        // Emit event even if the key wasn't found
        this.emit(IVLaPEvents.CONFIG_CHANGE, key);
        return false;
    }

    /**
     * Retrieves a sub-value from a stored object. For example, if a configuration value
     * is itself an object, you can fetch a specific property within that object.
     *
     * @param key - The configuration key whose value is an object.
     * @param subkey - The property to retrieve within that object's value.
     * @returns The sub-value if found, or `undefined` otherwise.
     *
     * @example
     * ```ts
     * configManager.set('database', { host: 'localhost', port: 5432 });
     * const port = configManager.getValue('database', 'port');
     * // port will be 5432
     * ```
     */
    getValue(key: string, subkey: string): any {
        const item = this.configuration.find(item => item.key === key);
        return item ? item.value[subkey] : undefined;
    }

    /**
     * Updates a sub-value within a stored object in the configuration. If the key exists,
     * it updates the specified property with the new value. If the key does not exist, it emits
     * a `CONFIG_CHANGE` event for the non-existent key.
     *
     * @param key - The configuration key whose value is an object.
     * @param subkey - The property within the object to update.
     * @param value - The new value to assign to the specified property.
     * @returns A boolean indicating whether the update succeeded (`true`) or failed (`false`).
     *
     * @example
     * ```ts
     * configManager.set('database', { host: 'localhost', port: 5432 });
     * configManager.updateValue('database', 'host', '127.0.0.1');
     * ```
     */
    updateValue(key: string, subkey: string, value: any): boolean {
        const index = this.configuration.findIndex(item => item.key === key);
        if (index !== -1) {
            // Safely update the subkey on the value object
            const configItem = this.configuration[index];
            if (typeof configItem.value === 'object' && configItem.value !== null) {
                configItem.value[subkey] = value;
            }
            return true;
        }
        // Emit event even if the key wasn't found
        this.emit(IVLaPEvents.CONFIG_CHANGE, key);
        return false;
    }

    /**
     * Deletes a key-value pair from the configuration. If the key is found and deleted,
     * it returns `true`; otherwise, it returns `false` and emits a `CONFIG_CHANGE` event for the key.
     *
     * @param key - The configuration key to delete.
     * @returns A boolean indicating whether the deletion succeeded (`true`) or the key was not found (`false`).
     */
    delete(key: string): boolean {
        const index = this.configuration.findIndex(item => item.key === key);
        if (index !== -1) {
            this.configuration.splice(index, 1);
            return true;
        }
        // Emit event even if the key wasn't found
        this.emit(IVLaPEvents.CONFIG_CHANGE, key);
        return false;
    }

    /**
     * Retrieves all configuration entries as an array of `{ key, value }` objects.
     *
     * @returns An array of objects representing all stored configuration items.
     */
    getAll(): { key: string; value: any }[] {
        return this.configuration;
    }

    /**
     * Subscribes a listener to a specific event. When that event is emitted,
     * the subscribed listener is called.
     *
     * @param event - The name of the event to subscribe to.
     * @param listener - The function to call when the event is emitted.
     *
     * @example
     * ```ts
     * configManager.on(IVLaPEvents.CONFIG_CHANGE, (key) => {
     *   console.log(`Config changed for key: ${key}`);
     * });
     * ```
     */
    on(event: string, listener: Function): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    /**
     * Unsubscribes a listener from a specific event. The listener will no longer be called
     * when the corresponding event is emitted.
     *
     * @param event - The name of the event to unsubscribe from.
     * @param listener - The function to remove from the event listeners.
     */
    off(event: string, listener: Function): void {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listener);
    }

    /**
     * Emits (triggers) an event with optional arguments to pass to each listener.
     * All listeners subscribed to the event are called in the order they were registered.
     *
     * @param event - The event name to emit.
     * @param args - Any additional arguments to pass to the listener functions.
     *
     * @example
     * ```ts
     * configManager.emit(IVLaPEvents.CONFIG_CHANGE, 'apiUrl');
     * ```
     */
    emit(event: string, ...args: any[]): void {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(...args));
    }
}