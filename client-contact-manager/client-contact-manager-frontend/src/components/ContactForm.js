import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ContactClients = () => {
    const { contactId } = useParams(); // Get the contact ID from the URL
    const [contactName, setContactName] = useState('');
    const [linkedClients, setLinkedClients] = useState([]);
    const [unlinkedClients, setUnlinkedClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContactAndClients = async () => {
            try {
                // Fetch the contact data
                const contactResponse = await axios.get(`http://localhost:5000/contacts/${contactId}`);
                setContactName(`${contactResponse.data.name} ${contactResponse.data.surname}`);

                // Fetch all clients linked to this contact
                const linkedResponse = await axios.get(`http://localhost:5000/contacts/${contactId}/clients`);
                setLinkedClients(linkedResponse.data);

                // Fetch all clients (not just linked)
                const allClientsResponse = await axios.get('http://localhost:5000/clients');
                const unlinked = allClientsResponse.data.filter(client => 
                    !linkedResponse.data.some(linkedClient => linkedClient._id === client._id)
                );
                setUnlinkedClients(unlinked);

                setLoading(false);
            } catch (error) {
                console.error("There was an error fetching the contact or clients!", error);
            }
        };

        fetchContactAndClients();
    }, [contactId]);

    //function to link and unlink clients
    const handleLink = async (clientId, link) => {
        try {
            const url = `http://localhost:5000/contacts/${contactId}/${link ? 'linkClient' : 'unlinkClient'}/${clientId}`;
            await axios.put(url);

            setLinkedClients(prev => 
                link 
                ? [...prev, unlinkedClients.find(client => client._id === clientId)]
                : prev.filter(client => client._id !== clientId)
            );
            
            setUnlinkedClients(prev => 
                link 
                ? prev.filter(client => client._id !== clientId)
                : [...prev, linkedClients.find(client => client._id === clientId)]
            );
        } catch (error) {
            console.error('Error linking/unlinking client', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{contactName}</h1> {/* Display contact name in large letters */}
            
            <h2>Linked Clients</h2>
            {linkedClients.length === 0 ? (
                <p>No linked clients found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Client Name</th>
                            <th style={{ textAlign: 'center', padding: '10px' }}>Unlink</th>
                        </tr>
                    </thead>
                    <tbody>
                        {linkedClients.map(client => (
                            <tr key={client._id}>
                                <td style={{ padding: '10px' }}>{client.name}</td>
                                <td style={{ textAlign: 'center', padding: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        onChange={() => handleLink(client._id, false)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h2>Unlinked Clients</h2>
            {unlinkedClients.length === 0 ? (
                <p>No unlinked clients found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Client Name</th>
                            <th style={{ textAlign: 'center', padding: '10px' }}>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unlinkedClients.map(client => (
                            <tr key={client._id}>
                                <td style={{ padding: '10px' }}>{client.name}</td>
                                <td style={{ textAlign: 'center', padding: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        onChange={() => handleLink(client._id, true)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ContactClients;
