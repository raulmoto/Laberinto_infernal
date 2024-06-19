
class SoundManager{

    constructor(){
        this.sonidos = {};
    }
    //we update the list of sounds 
    setSonido(key, sound){
        this.sonidos[key] = sound;
    }
    // we get a sound according to its key
    getSound(key){
        if(!key){
            console.log(`NO CONSEGUIMOS TOMAR EL SONIDO ${key}`)
        }
        return this.sonidos[key];
    }
    //we stop playing a sound
    stopSound(key){
        if(this.sonidos[key]){
            console.log(`DETENEMOS EL SONIDO ${key}`)
            this.sonidos[key].stop();
        }else{
            console.log(`NO CONSEGUIMOS DETENER EL SONIDO ${key}`)
        }
    }
    //we stop playing all the sounds
    stopAllSonidos(){
        for(let key in this.sonidos){
            this.sonidos[key].stop();
        }
    }
}

const Soundmanager = new SoundManager();
export default Soundmanager;