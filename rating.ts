type Options = {
    initialRating?: number,
    starClass?: string,
    messageHelperSelector?: string
}

class StarRating {
    element: HTMLElement;
    options?: Options;
    active: HTMLElement | null;
    messageHelper?: HTMLElement | null;
    rating: number;
    message?: string;
    starClass: string

    constructor(element: HTMLElement, options: Options = {}) {
        this.element = element;
        this.options = options;
        this.active = this.element.querySelector<HTMLElement>('.active') ;
        this.rating = this.options.initialRating ? this.options.initialRating : 0;
        this.starClass = this.options.starClass ? this.options.starClass : 'star';
        this.message = '';
        
        if(this.options.messageHelperSelector){
            this.messageHelper = this.element.querySelector<HTMLElement>(this.options.messageHelperSelector);
        }

        if(this.messageHelper){
            this.message = this.getData(this.messageHelper, 'text');
        }

        this.init();
    }
    /**
     * Initial setup
     */
    init():void{
        this.setRating(this.rating);
        this.setUpListeners();
    }
    /**
     * Set event listeners
     */
    setUpListeners():void {
        
        const remove = (e:Event) => {
            if (this.active) {
                this.active.classList.remove('active');
            }
            this.updateMessage(this.getData(e.target as HTMLElement, 'text'));
        }

        const add = () => {
            if (this.active) {
                this.active.classList.add('active');
            }
            this.updateMessage(this.message);
        }

        this.element.querySelectorAll(`.${this.starClass}`).forEach((element:Element) => {
            element.addEventListener('mouseenter', remove);
            element.addEventListener('mouseleave', add);
        });

        this.element.addEventListener('click', (e:Event) => {
            e.preventDefault();
            if ( (e.target as HTMLElement).classList.contains(this.starClass) ) {
                this.setActive(e.target as HTMLElement)
            }
        })
    }
    /**
     * Set the current active element, update the UI
     */
    setActive(element:HTMLElement):void {
        if (this.active) {
            this.active.classList.remove('active');
        }
        element.classList.add('active');
        this.active = element;
        this.setMessage(this.getData(this.active as HTMLElement, 'text'));
        this.updateRating(Number(this.getData(this.active, 'value')));
        this.saveRating();
    }
    /**
     * Update the rating with the given value.
     */
    updateRating(value: number):void {
        this.rating = value;
    }
    /**
     * Set the new rating, the corresponding message, save and update the UI
     */
    setRating(value:number):void {
        if (value > 0) {
            this.element.querySelectorAll(`.${this.starClass}`).forEach((element:Element) => {
                if (parseInt(this.getData(element as HTMLElement, 'value')) === value) {
                    this.setActive(element as HTMLElement)
                }
            });
        }else{
            this.updateRating(value);
            this.saveRating();
        }
    }
    /**
     * Saves the rating to the given target <HTMLInputElement>
     * or the first <HTMLInputElement> child of the Element
     */
    saveRating(target?: string):void {
        let input;
        if(target){
            input = document.querySelector<HTMLInputElement>(target);
        }else{
            input = this.element.querySelector<HTMLInputElement>('input');
        }
        if(input){
            input.value = this.rating.toString()
        }
    }
    /**
     * Set the new message and updates the UI
     */
    setMessage(message?:string):void {
        this.message = message;
        this.updateMessage(this.message);
    }
    /**
     * Updates the UI with the given message
     */
    updateMessage(message:string):void {
        if(this.messageHelper){
            this.messageHelper.innerHTML = message!
        }
    }
    /**
     * Reset the rating to the given value, updates the message and the UI
     */
    reset(resetTo:number = 0):void {
        if(this.active){
            this.active.classList.remove("active");
        }

        if(this.messageHelper){
            this.setMessage(this.getData(this.messageHelper, "text"))
        }

        this.active = null;
        this.setRating(resetTo);
    }
    /**
     * Returns the value of the given element data attribute.
     */
    getData(element:HTMLElement, name:string): string {
        return element.dataset ? element.dataset[name] as string : element.getAttribute('data-' + name) as string
    }
    /**
     * Set new value of the given element data attribute.
     */
    setData(element:HTMLElement, name:string, value:any):void {
        element.dataset ? element.dataset[name] = value : element.setAttribute('data-' + name, value)
    }
};
