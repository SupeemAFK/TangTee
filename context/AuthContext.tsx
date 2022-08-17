import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, signOut, FacebookAuthProvider, onAuthStateChanged } from "firebase/auth";
import { setDoc, getDoc, doc, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage, StorageReference, UploadResult } from "firebase/storage";
import IUser from '../interface/user';

export interface IAuthContextProps {
    children: React.ReactNode
}

interface IContext {
    signinFacebook: () => void
    signout: () => void
    currentUser: IUser | null
    loading: boolean
    authLoading: boolean
}

const authContext = React.createContext({} as IContext);

export default function AuthContext ({ children }: IAuthContextProps) {
    const [authLoading, setAuthLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, async (result) => {
            setLoading(true);
            if (result) {
                const docSnap: DocumentSnapshot = await getDoc(doc(db, "users", result.uid));
                const user: DocumentData | undefined = docSnap.data();
                setCurrentUser({
                    id: docSnap.id,
                    name: user?.name,
                    avatar: user?.avatar,
                    bio: user?.bio,
                    stars: user?.stars,
                    banner_hex: user?.banner_hex
                });
                setLoading(false);
            }
            else {
                setCurrentUser(null)
                setLoading(false);
            }
        })
    }, [])

    function signinFacebook(): void {
        setAuthLoading(true);
        signInWithPopup(auth, new FacebookAuthProvider())
            .then(async (result) => {
                const user = result.user;

                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential?.accessToken;

                const res = await fetch(user.photoURL + `?access_token=${accessToken}&width=500`)
                const blob = await res.blob();

                const storage: FirebaseStorage = getStorage();
                const storageRef: StorageReference = ref(storage, user?.displayName + user?.uid);
                const snapshot: UploadResult = await uploadBytes(storageRef, blob);
                const imgUrl = await getDownloadURL(snapshot.ref);
                const userSnap = await getDoc(doc(db, "users", user.uid))
                
                if (!userSnap.exists()) {
                    setDoc(doc(db, "users", user.uid), {
                        name: user?.displayName ? user.displayName : "",
                        avatar: imgUrl ? imgUrl : "",
                        bio: "Write something here",
                        stars: [],
                        banner_hex: "#0d9488"
                    });
                }
                setAuthLoading(false)
                router.push('/')
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            })
    }

    function signout(): void {
        signOut(auth)
        .then(() => {
            console.log("sign out success!")
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        })
    }

    return (
        <authContext.Provider
            value={{ 
                signinFacebook, 
                signout,
                currentUser,
                loading,
                authLoading
            } as IContext}
        >
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}