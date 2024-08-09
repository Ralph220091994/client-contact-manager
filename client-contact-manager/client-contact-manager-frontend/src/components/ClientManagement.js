import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// CreateClient Component
const CreateClient = ({ onClientCreated }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/clients', { name });
            setMessage(`Client created`);
            setName(''); // Reset the input field
            onClientCreated(); // Notify parent component of the new client
        } catch (error) {
            setMessage('Error creating client');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Create Client</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name: </label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Create</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

// ClientList Component
const ClientList = ({ onClientCreated }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:5000/clients');
            setClients(response.data);
            setLoading(false);
        } catch (error) {
            console.error("There was an error fetching the clients!", error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        fetchClients(); // Re-fetch the client list when a new client is created
    }, [onClientCreated]);

    const handleSave = async (clientId) => {
        try {
            await axios.put(`http://localhost:5000/clients/${clientId}/save`);
            setClients(clients.map(client => 
                client._id === clientId ? { ...client, isSaved: true } : client
            ));
        } catch (error) {
            console.error('Error saving client', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (clients.length === 0) {
        return <div>No client(s) found.</div>;
    }

    return (
        <div>
            <h2>Clients</h2>
            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Client Code</th>
                        <th style={{ textAlign: 'center', padding: '10px' }}>No. of Linked Contacts</th>
                        <th style={{ textAlign: 'center', padding: '10px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client._id}>
                            <td style={{ padding: '10px' }}>{client.name}</td>
                            <td style={{ padding: '10px' }}>{client.isSaved ? client.clientCode : ''}</td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                <Link to={`/client/${client._id}/contacts`}>
                                    {client.contacts.length}
                                </Link>
                            </td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                {!client.isSaved && (
                                    <button onClick={() => handleSave(client._id)}>Save</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main Component
const ClientManagement = () => {
    const [clientCreated, setClientCreated] = useState(false);

    const handleClientCreated = () => {
        setClientCreated(prev => !prev); // Trigger re-render
    };

    return (
        <div>
            <CreateClient onClientCreated={handleClientCreated} />
            <ClientList onClientCreated={clientCreated} />
        </div>
    );
};

export default ClientManagement;
