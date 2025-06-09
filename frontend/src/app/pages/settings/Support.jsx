import React, { useState } from 'react';
import { NavigationBar } from "../../../components/NavigationBar";
import './Settings.css';
import { IoSend } from "react-icons/io5";

export function Support() {
    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        {
            id: 1,
            question: 'What is Chatter?',
            answer: 'This is just a dummy text that has been inserted as a placeholder for future content. While it may seem insignificant at first glance, the use of dummy text is a common practice in the design and publishing industry, as it allows designers and developers to visualize the layout and overall aesthetic of a project without being distracted by the actual content.',
        },
        {
            id: 2,
            question: 'How do I use Chatter?',
            answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
            id: 3,
            question: 'Question 3?',
            answer: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
            id: 4,
            question: 'Question 4?',
            answer: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
        },
    ];

    const toggleFaq = (id) => {
        setActiveFaq(activeFaq === id ? null : id);
    };

    return (
        <>
            <NavigationBar />

            <div className="settings-wrapper">
                <div className="settings-container">
                    <aside className="settings-sidebar">
                        <input
                            type="text"
                            className="settings-search"
                            placeholder="Search Settings"
                        />

                        <nav className="settings-menu">
                            <a href="/settings" className="menu-item">My Account</a>
                            
                            <a href="/about-us" className="menu-item">About Us</a>
                            <a href="/support" className="menu-item active">Support</a>
                        </nav>

                        <a href="/logout" className="logout-link">
                            Log Out ↗
                        </a>
                    </aside>

                    <main className="settings-main support-main">
                        <div className="support-search-container">
                            <input
                                type="text"
                                className="support-search-input"
                                placeholder="What can we help you with?"
                            />
                            
                            <button className="support-search-submit-btn">
                                <IoSend />
                            </button>
                        </div>

                        <div className="faq-section">
                            {faqs.map(faq => (
                                <div key={faq.id} className="faq-item">
                                    <button
                                        className="faq-question"
                                        onClick={() => toggleFaq(faq.id)}
                                    >
                                        {faq.question}
                                        <span className="faq-toggle-icon">
                                            {activeFaq === faq.id ? '︿' : '﹀'}
                                        </span>
                                    </button>
                                    {activeFaq === faq.id && (
                                        <div className="faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
