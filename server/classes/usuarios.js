



class Usuarios {

    constructor() {
        this.personas = [];
    }


    agregarPersona(id, nombre, sala) {
        const persona = {id, nombre, sala};
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id) {
        const persona = this.personas.filter(per => per.id===id)[0];
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        return this.getPersonas().filter(per => per.sala === sala);
    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(per => per.id != id);
        return personaBorrada;
    }

}







module.exports = {
    Usuarios
}


