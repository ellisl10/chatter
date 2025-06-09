import React from 'react';
import { NavigationBar } from "../../../components/NavigationBar";
import './Settings.css';

export function AboutUs() {
    const sections = [
        {
            id: 1,
            image: 'https://via.placeholder.com/400x250?text=Image+1',
            title: 'Ellis Liang',
            description: 'Status...',
            linkText: 'Learn More',
            linkHref: '#!'
        },
        {
            id: 2,
            image: '/images/edward-henriquez.jpg',
            title: 'Edward Henriquez',
            description: 'Status...',
            linkText: 'Learn More',
            linkHref: '#!'
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/400x250?text=Image+3',
            title: 'Drake Smith',
            description: 'Status...',
            linkText: 'Learn More',
            linkHref: '#!'
        },
        {
            id: 4,
            image: 'https://via.placeholder.com/400x250?text=Image+4',
            title: 'Daniel Nguyen Vo',
            description: 'Status...',
            linkText: 'Learn More',
            linkHref: '#!'
        },
    ];

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
                            <a href="/about-us" className="menu-item active">About Us</a>
                            <a href="/support" className="menu-item">Support</a>
                        </nav>

                        <a href="/logout" className="logout-link">
                            Log Out ↗
                        </a>
                    </aside>

                    <main className="settings-main about-us-main">
                        <h1 className="about-us-title">THERE'S MORE TO OUR STORY</h1>
                        <div className="about-us-grid">
                            {sections.map(section => (
                                <div key={section.id} className="about-us-card">
                                    <img src={section.image} alt={section.title} className="about-us-card-image" />
                                    <div className="about-us-card-content">
                                        <h2 className="about-us-card-title">{section.title}</h2>
                                        <p className="about-us-card-description">{section.description}</p>
                                        <a href={section.linkHref} className="about-us-card-link">
                                            {section.linkText}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}