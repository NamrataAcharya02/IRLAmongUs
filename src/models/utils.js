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