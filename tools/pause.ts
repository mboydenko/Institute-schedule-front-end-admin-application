export default class Pause {
    private ms: number
    
    constructor(ms: number) {
        this.ms = ms
    }

    run() : Promise<void> {
        return new Promise<void>((resolve, r)=>{
            setTimeout(resolve, this.ms)
        })
    }
}