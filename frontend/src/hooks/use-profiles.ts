import { useAuth, type UserProfile } from "@/contexts/AuthContext";
import { isAxiosError } from "axios";
import { useState, useEffect } from "react";


export const useProfiles = () => {
    const { currentUser, getProfile } = useAuth();

    const [profile, setProfile] = useState<UserProfile>(null);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            const profiles = await getProfile();
            setProfile(profiles);
        } catch (error) {
            if (import.meta.env.DEV) {
                if (isAxiosError(error)) {
                    console.log(error.response);
                }
            }
            setError(error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchProfile(); }, [currentUser]);

    return { profile, fetching, error, fetchProfile };
};
