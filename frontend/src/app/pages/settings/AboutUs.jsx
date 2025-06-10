import React from 'react';
import { NavigationBar } from "../../../components/NavigationBar";
import './Settings.css';

export function AboutUs() {
    const sections = [
        {
            id: 3,
            image: '/drake-inf124.jpg',
            title: 'Drake Smith',
            role: 'Frontend Developer',
            description: 'Specialized in React and modern web technologies',
            objectPosition: '50% 20%' 
        },
        {
            id: 1,
            image: '/Chatter-ellis.jpg',
            title: 'Ellis Liang',
            role: 'Backend Developer',
            description: 'Expert in Firebase and cloud architecture',
            objectPosition: '50% 50%' 
        },
        {
            id: 4,
            image: '/Chatter-Daniel.jpg',
            title: 'Daniel Nguyen Vo',
            role: 'Full Stack Developer',
            description: 'Passionate about creating seamless user experiences',
            objectPosition: '50% 40%' 
        },
        {
            id: 2,
            image: '/edward.jpg',
            title: 'Edward Henriquez',
            role: 'UI/UX Designer',
            description: 'Focused on creating beautiful and intuitive interfaces',
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
                                        <h3 className="about-us-card-title">{section.title}</h3>
                                        <p className="about-us-card-role">{section.role}</p>
                                        <p className="about-us-card-description">{section.description}</p>
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