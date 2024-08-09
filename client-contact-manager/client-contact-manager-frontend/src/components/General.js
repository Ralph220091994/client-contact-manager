import React, { useEffect, useState } from 'react';
import axios from 'axios';

const General = () => {
    const [clients, setClients] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientsResponse = await axios.get('http://localhost:5000/clients');
                const contactsResponse = await axios.get('http://localhost:5000/contacts');

                setClients(clientsResponse.data || []); // Ensure clients is an empty array if no data
                setContacts(contactsResponse.data || []); // Ensure contacts is an empty array if no data
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("There was an error fetching the data!", error);
                setLoading(false); // Also set loading to false if there's an error
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>General</h1>

            {/* Clients Section */}
            <h2>Clients</h2>
            {clients.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Client Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client._id}>
                                <td>{client.name}</td>
                                <td>{client.isSaved ? client.clientCode : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No clients found.</p>
            )}

            {/* Contacts Section */}
            <h2>Contacts</h2>
            {contacts.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Surname</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact._id}>
                                <td>{contact.surname}</td>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No contacts found.</p>
            )}
        </div>
    );
};

export default General;
