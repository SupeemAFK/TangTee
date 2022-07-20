import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, FacebookAuthProvider, onAuthStateChanged } from "firebase/auth";
import { setDoc, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import IUser from '../interface/user';

export interface IAuthContextProps {
    children: React.ReactNode
}

interface IContext {
    signinFacebook: () => void
    currentUser: IUser
}

const authContext = React.createContext({} as IContext);

export default function AuthContext ({ children }: IAuthContextProps) {
    const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);
    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, async (result) => {
            if (result) {
                const docSnap = await getDoc(doc(db, "users", result.uid));
                const user = docSnap.data();
                setCurrentUser({
                    name: user?.name ? user.name : "",
                    avatar: user?.avatar ? user.avatar : "",
                    bio: "Write something here",
                    stars: 5,
                    status: "Chilling",
                });
            }
            else {
                setCurrentUser({} as IUser)
            }
        })
    }, [])

    function signinFacebook(): void {
        signInWithPopup(auth, new FacebookAuthProvider())
            .then((result) => {
                const user = result.user;
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential?.accessToken;
                setDoc(doc(db, "users", user.uid), {
                    name: user?.displayName ? user.displayName : "",
                    avatar: user?.photoURL ? user.photoURL + `?access_token=${accessToken}`: "",
                    bio: "Write something here",
                    stars: 5,
                    status: "Chilling",
                });
                router.push("/")
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
                currentUser 
            }}
        >
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}