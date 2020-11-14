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
        this.message = '';
        this.starClass = this.options.starClass ? this.options.starClass : 'star';

        if(this.options.messageHelperSelector){
            this.messageHelper = this.element.querySelector<HTMLElement>(this.options.messageHelperSelector);
        }

        this.init();
    }

    init():void{
        this.updateRating();
        this.saveRating();
        this.setUpListeners();
        this.setRating(this.rating);
    }

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

    setActive(element:HTMLElement):void {
        if (this.active) {
            this.active.classList.remove('active');
        }
        element.classList.add('active');
        this.active = element;
        this.setMessage(this.getData(this.active as HTMLElement, 'text'));
        this.updateRating();
        this.saveRating();
    }

    updateRating():void {
        if (this.active) {
            this.rating = Number(this.getData(this.active, 'value'))
        }
    }

    setRating(value:number):void {
        if (value > 0) {
            this.element.querySelectorAll(`.${this.starClass}`).forEach((element:Element) => {
                if (parseInt(this.getData(element as HTMLElement, 'value')!) === value) {
                    this.setActive(element as HTMLElement)
                }
            });
            this.rating = value;
            this.setMessage(this.getData(this.active as HTMLElement, "text"));
            this.saveRating()
        }
    }

    saveRating():void {
        const input = this.element.querySelector<HTMLInputElement>('input');
        if(input){
            input.value = this.rating.toString()
        }
    }

    setMessage(message?:string):void {
        this.message = message;
        this.updateMessage(this.message);
    }

    updateMessage(message?:string):void {
        const helper = this.messageHelper;
        if(helper){
            helper.innerHTML = message!
        }
    }

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

    getData(element:HTMLElement, name:string): string {
        return element.dataset ? element.dataset[name] as string : element.getAttribute('data-' + name) as string
    }

    setData(element:HTMLElement, name:string, value:any):void {
        element.dataset ? element.dataset[name] = value : element.setAttribute('data-' + name, value)
    }
};
