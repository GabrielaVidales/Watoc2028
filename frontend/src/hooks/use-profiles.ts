import { useAuth, type UserProfile } from "@/contexts/AuthContext";
import { getParticipantData } from "@/services/auth/auth-services";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";


export const useProfiles = () => {
    const { user: user, getProfile } = useAuth();

    const participantQuery = useQuery({
        queryKey: ['user', 'profiles'],
        queryFn: () => getParticipantData(user.id),
        enabled: !!user,
    })



    const [profile, setProfile] = useState<UserProfile>(null);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            await new Promise(r => setTimeout(r, 2000))
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

    useEffect(() => { fetchProfile(); }, [user]);

    return { profile, fetching, error, fetchProfile };
};
