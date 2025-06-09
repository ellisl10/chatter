import React from 'react';
import { NavigationBar } from "../../../components/NavigationBar";
import './Settings.css';

export function AboutUs() {
    const sections = [
        {
            id: 3,
            image: '/images/drake-inf124.jpg',
            title: 'Drake Smith',
            objectPosition: '50% 20%' 
        },
        {
            id: 1,
            image: '/images/ellis-inf124.jpg',
            title: 'Ellis Liang',
            objectPosition: '50% 50%' 
        },
        {
            id: 4,
            image: '/images/daniel-inf124.jpg',
            title: 'Daniel Nguyen Vo',
            objectPosition: '50% 40%' 
        },
        {
            id: 2,
            image: '/images/edward-henriquez.jpg',
            title: 'Edward Henriquez',
            objectPosition: '50% 20%' 
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
                        <h1 className="about-us-title">Meet the Team</h1>
                        <div className="about-us-grid">
                            {sections.map(section => (
                                <div key={section.id} className="about-us-card">
                                    <img 
                                        src={section.image} 
                                        alt={section.title} 
                                        className="about-us-card-image" 
                                        style={{ objectPosition: section.objectPosition }}
                                    />
                                    <div className="about-us-card-content">
                                        <div className="about-us-card-link no-click">
                                            {section.title}
                                        </div>
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