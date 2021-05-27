import { firebase } from "../Config/firebase";

export const GOU = (uid) => {
    return new Promise((resolve, reject) => {
        firebase?.database() && firebase.database().ref(`/status`).once('value').then((snapshot) => {
            const statusData = snapshot.val();
        const allUsers =  Object.keys(statusData).map(e => {
            return {...statusData[e],
                    uid: e
                    }
            });
            resolve(allUsers?.filter(user => (user?.uid !== uid) && (user?.state === "online")));
        }).catch(() => {
            reject([]);
        });
    });
}