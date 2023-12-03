import { 
    collection,
    deleteDoc,
    documentId,
    getDocs,
    query,
    where } from "firebase/firestore";
import { db } from "../firebase";

export const cleanupDbCollectionDocs = async (collectionName, IDsToOmit) => {

    try {
        const qsnap = await getDocs(query(collection(db, collectionName), where(documentId(), "not-in", IDsToOmit)));
        
        qsnap.docs.forEach((doc) => {
            console.log("deleting doc: " + doc.id );
            deleteDoc(doc.ref);
        });
    } catch (e) {
        console.log("cleanupDbCollectionDocs Error: " + e);
    }
}

export function shuffler(array){
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    console.log(array);
    return array;
}