import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ClientContacts = () => {
    const { clientId } = useParams(); // Get the client ID from the URL
    const [clientName, setClientName] = useState('');
    const [linkedContacts, setLinkedContacts] = useState([]);
    const [unlinkedContacts, setUnlinkedContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClientAndContacts = async () => {
            try {
                // Fetch the client data
                const clientResponse = await axios.get(`http://localhost:5000/clients/${clientId}`);
                setClientName(clientResponse.data.name);

                // Fetch all contacts linked to this client
                const linkedResponse = await axios.get(`http://localhost:5000/clients/${clientId}/contacts`);
                setLinkedContacts(linkedResponse.data);

                // Fetch all contacts (not just linked)
                const allContactsResponse = await axios.get('http://localhost:5000/contacts');
                const unlinked = allContactsResponse.data.filter(contact => 
                    !linkedResponse.data.some(linkedContact => linkedContact._id === contact._id)
                );
                setUnlinkedContacts(unlinked);

                setLoading(false);
            } catch (error) {
                console.error("There was an error fetching the client or contacts!", error);
            }
        };

        fetchClientAndContacts();
    }, [clientId]);

    //function to unlink and link contacts
    const handleLink = async (contactId, link) => {
        try {
            const url = `http://localhost:5000/clients/${clientId}/${link ? 'linkContact' : 'unlinkContact'}/${contactId}`;
            await axios.put(url);

            setLinkedContacts(prev => 
                link 
                ? [...prev, unlinkedContacts.find(contact => contact._id === contactId)]
                : prev.filter(contact => contact._id !== contactId)
            );
            
            setUnlinkedContacts(prev => 
                link 
                ? prev.filter(contact => contact._id !== contactId)
                : [...prev, linkedContacts.find(contact => contact._id === contactId)]
            );
        } catch (error) {
            console.error('Error linking/unlinking contact', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{clientName}</h1> {/* Display client name in large letters */}
            
            <h2>Linked Contacts</h2>
            {linkedContacts.length === 0 ? (
                <p>No Contact(s) found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Surname</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Email Address</th>
                            <th style={{ textAlign: 'center', padding: '10px' }}>Unlink</th>
                        </tr>
                    </thead>
                    <tbody>
                        {linkedContacts.map(contact => (
                            <tr key={contact._id}>
                                <td style={{ padding: '10px' }}>{contact.name}</td>
                                <td style={{ padding: '10px' }}>{contact.surname}</td>
                                <td style={{ padding: '10px' }}>{contact.email}</td>
                                <td style={{ textAlign: 'center', padding: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        onChange={() => handleLink(contact._id, false)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h2>Contacts</h2>
            {unlinkedContacts.length === 0 ? (
                <p>No Contact(s) found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Surname</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Email Address</th>
                            <th style={{ textAlign: 'center', padding: '10px' }}>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unlinkedContacts.map(contact => (
                            <tr key={contact._id}>
                                <td style={{ padding: '10px' }}>{contact.name}</td>
                                <td style={{ padding: '10px' }}>{contact.surname}</td>
                                <td style={{ padding: '10px' }}>{contact.email}</td>
                                <td style={{ textAlign: 'center', padding: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        onChange={() => handleLink(contact._id, true)}
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

export default ClientContacts;
