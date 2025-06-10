import React from 'react';

export function Privacy() {
    return (
        <>
            <div className="settings-header">
                <h1 className="settings-username">Privacy Policy</h1>
            </div>

            <div className="settings-details">
                <div className="detail-row">
                    <p>This is the privacy policy page. Your privacy is important to us.</p>
                </div>
                <div className="detail-row">
                    <p>We collect minimal data necessary for the functionality of this application.</p>
                </div>
                <div className="detail-row">
                    <p>Any data collected is securely stored and used only for its intended purpose.</p>
                </div>
                <div className="detail-row">
                    <p>For more details, please contact us.</p>
                </div>
            </div>
        </>
    )
}