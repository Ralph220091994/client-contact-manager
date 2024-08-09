import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Component for creating a new contact
const CreateContact = ({ onContactCreated }) => {
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // JavaScript email validation
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/contacts', { surname, name, email });
            setMessage(`Contact created: ${response.data.surname} ${response.data.name}`);
            setSurname(''); // Reset the input fields
            setName('');
            setEmail('');
            onContactCreated(); // Notify parent component
        } catch (error) {
            setMessage('Error creating contact');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Create Contact</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Surname: </label>
                    <input 
                        type="text" 
                        value={surname} 
                        onChange={(e) => setSurname(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Name: </label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="example@domain.com"
                    />
                </div>
                <button type="submit">Create</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

// Component for displaying the list of contacts
const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/contacts');
            setContacts(response.data || []); // Ensure contacts is an empty array if no data
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error("There was an error fetching the contacts!", error);
            setLoading(false); // Also set loading to false if there's an error
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (contacts.length === 0) {
        return <div>No contact(s) found.</div>;
    }

    return (
        <div>
            <h2>Contacts</h2>
            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Surname</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Email Address</th>
                        <th style={{ textAlign: 'center', padding: '10px' }}>No. of Linked Clients</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact._id}>
                            <td style={{ padding: '10px' }}>{contact.surname}</td>
                            <td style={{ padding: '10px' }}>{contact.name}</td>
                            <td style={{ padding: '10px' }}>{contact.email}</td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>
                                <Link to={`/contacts/${contact._id}/clients`}>
                                    {contact.clients.length}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Combined component for creating and listing contacts
const ContactPage = () => {
    const [refresh, setRefresh] = useState(false);

    const handleContactCreated = () => {
        setRefresh(prev => !prev); // Toggle refresh to trigger re-fetch
    };

    return (
        <div>
            <CreateContact onContactCreated={handleContactCreated} />
            <ContactList key={refresh} /> {/* Key change forces re-render */}
        </div>
    );
};

export default ContactPage;
