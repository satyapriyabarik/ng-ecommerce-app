// src/pages/Profile.tsx
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../../graphql/mutations";

export default function Profile() {

    const { data, loading, error } = useQuery(ME_QUERY);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const user = data?.me;



    return (
        <div className="container py-5">
            <h2 className="mb-4">My Profile</h2>

            <div className="card shadow-sm p-4">
                <div className="mb-3">
                    <strong>Name: </strong> {user?.fullName}
                </div>
                <div className="mb-3">
                    <strong>Email: </strong> {user?.email}
                </div>
                <div className="mb-3">
                    <strong>Phone No: </strong> {user?.phone}
                </div>
                <div className="mb-3">
                    <strong>Address: </strong> {user?.address}
                </div>
                <div className="mb-3">
                    <strong>Role: </strong> {user?.role}
                </div>
                <div className="mb-3">
                    <strong>Joined On: </strong>{" "}
                    {new Date(user?.createdAt).toLocaleDateString()}
                </div>
            </div>

        </div>
    );
}
