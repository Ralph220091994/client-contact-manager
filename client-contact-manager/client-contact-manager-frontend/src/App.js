import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ClientManagement from './components/ClientManagement';
import ClientForm from './components/ClientForm';
import ContactPage from './components/ContactPage';
import ContactForm from './components/ContactForm';
import General from './components/General';

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/General">General</Link></li>
                    <li><Link to="/clients">Clients</Link></li>
                    <li><Link to="/contacts">Contacts</Link></li>
                </ul>
            </nav>
            <Routes>
            <Route path="/General" element={<General />} />
                <Route path="/clients" element={<ClientManagement />} />
                <Route path="/contacts" element={<ContactPage />} />
                <Route path="/client/:clientId/contacts" element={<ClientForm />} /> 
                <Route path="/contacts/:contactId/clients" element={<ContactForm />} />
            </Routes>
        </Router>
    );
}

export default App;
