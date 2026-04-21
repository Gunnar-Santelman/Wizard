import { useAuth } from "../context/authContext";
export default function UserPage(){
    const {user,userData,loading}=useAuth();
    if(loading) return <p>Loading...</p>;
    if(!user) return<p>You must be logged in.</p>
    return(
        <div>
            <h1>{userData.username}'s Profile</h1>
            <img
                src={userData.profilePicture || "/default.png"}
                alt="Profile"
                width={120}
                />
        
        <section style={{ marginTop: "20px" }}>
            <h2>Friends</h2>
            {userData.friends.length === 0 ? (
            <p>No friends yet.</p>
            ) : (
            <ul>
                {userData.friends.map((friend, i) => (
                <li key={i}>{friend}</li>
                ))}
            </ul>
             )}
        </section>
        <section style={{ marginTop: "20px" }}>
            <h2>Achievements</h2>
            {userData.achievements.length === 0 ? (
            <p>No achievements yet.</p>
            ) : (
            <ul>
                {userData.achievements.map((ach, i) => (
                < li key={i}>{ach}</li>
                ))}
            </ul>
            )}
        </section>
        
    

        </div>
    )
}