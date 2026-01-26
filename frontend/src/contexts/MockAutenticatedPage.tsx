import { useAuth } from "./AuthContext";

export function MockAutenticatedPage() {
    const { handleLogout } = useAuth()

    return (
        <div>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
