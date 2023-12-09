
const isEmptyObject = (objectName) => {
    // https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/
    return Object.keys(objectName).length === 0
}

export class DocRefMock {
    
    _underlyingData;

    converter;

    constructor (data) {
        this._underlyingData = data;
        this.converter = null;
    }

    withConverter(cvtr) {
        this.converter = cvtr;
        return this;
    }
}

export class DocSnapMock {
    
    size;

    _docRef;

    constructor(docRef, {size = 0}) {
        
        this._docRef = docRef;

        this.size = size;
    }

    exists() {
        return !isEmptyObject(this._docRef._underlyingData);
    }

    data() {

        let room;

        if ( this._docRef.converter != null ) {

            const converter = this._docRef.converter;

            const snapshot = {
                data: (args) => this._docRef._underlyingData
            }

            room = converter.fromFirestore(snapshot, {});

        } else {
            room = null;
        }

        return room;
    }
}