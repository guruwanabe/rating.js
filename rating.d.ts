declare type Options = {
    initialRating?: number;
    starClass?: string;
    messageHelperSelector?: string;
};
declare class StarRating {
    element: HTMLElement;
    options?: Options;
    active: HTMLElement | null;
    messageHelper?: HTMLElement | null;
    rating: number;
    message?: string;
    starClass: string;
    constructor(element: HTMLElement, options?: Options);
    /**
     * Initial setup
     */
    init(): void;
    /**
     * Set event listeners
     */
    setUpListeners(): void;
    /**
     * Set the current active element, update the UI
     */
    setActive(element: HTMLElement): void;
    /**
     * Update the rating with the given value.
     */
    updateRating(value: number): void;
    /**
     * Set the new rating, the corresponding message, save and update the UI
     */
    setRating(value: number): void;
    /**
     * Saves the rating to the given target <HTMLInputElement>
     * or the first <HTMLInputElement> child of the Element
     */
    saveRating(target?: string): void;
    /**
     * Set the new message and updates the UI
     */
    setMessage(message?: string): void;
    /**
     * Updates the UI with the given message
     */
    updateMessage(message?: string): void;
    /**
     * Reset the rating to the given value, updates the message and the UI
     */
    reset(resetTo?: number): void;
    /**
     * Returns the value of the given element data attribute.
     */
    getData(element: HTMLElement, name: string): string;
    /**
     * Set new value of the given element data attribute.
     */
    setData(element: HTMLElement, name: string, value: any): void;
